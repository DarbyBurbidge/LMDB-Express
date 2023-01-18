import { Cursor, Dbi, Txn } from "node-lmdb"
import { block_db, db } from "../db"
import { IBlock, blockKeys } from "../schema/Block.schema"

export const getDBBlock = (blockNum: string): IBlock | null => {
    const db_txn = db.beginTxn()
    try {
        const block: IBlock = {
            hash: db_txn.getString(block_db, blockKeys(blockNum).hash),
            createdAt: db_txn.getString(block_db, blockKeys(blockNum).createdAt),
            miner: db_txn.getString(block_db, blockKeys(blockNum).miner),
            gasUsed: db_txn.getNumber(block_db, blockKeys(blockNum).gasUsed),
            gasLimit: db_txn.getNumber(block_db, blockKeys(blockNum).gasLimit),
            data: db_txn.getString(block_db, blockKeys(blockNum).data),
            txns: getDupValuesByKeyString(blockKeys(blockNum).txns, db_txn, block_db)
        }
        db_txn.commit()
        return block
    } catch (err) {
        console.error(err)
        db_txn.abort()
        return null

    }
}

const getDupValuesByKeyString = (key: string, db_txn: Txn, db_name: Dbi): string[] => {
    const cursor = new Cursor(db_txn, db_name)
    const entries: (string | null)[] = []
    if(cursor.goToKey(key)) {  
        var i = 0;
        do {
            entries[i] = cursor.getCurrentString()
            i++
        } while (cursor.goToNextDup())
    }
    const txns = entries.flatMap((entry) => {
        return entry ? [entry] : []
    })
    return txns
}

