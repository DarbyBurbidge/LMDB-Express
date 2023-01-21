import { block_db, db } from "../db"
import { IBlock } from "../models/src/proto/Block"

export const getBlocksFromDB = (startBlock: number, endBlock: number): IBlock[] => {
    const blocks: IBlock[] = []
    const db_txn = db.beginTxn()
    try {
        for (let i = startBlock; i <= endBlock; i++) {
            blocks.push(IBlock.decode(db_txn.getBinary(block_db, i.toString())))
        }
        db_txn.commit()
        return blocks.flatMap((block) => {return block ? [block] : []})
    } catch (err) {
        console.error(err)
        db_txn.abort()
        return []
    }
}