import { block_db, db } from "../db"
import { IBlock } from "../schema/Block.schema"

export const getBlocksFromDB = (startBlock: number, endBlock: number): IBlock[] => {
    const blocks: IBlock[] = []
    const db_txn = db.beginTxn()
    try {
        for (let i = startBlock; i <= endBlock; i++) {
            blocks.push(JSON.parse(db_txn.getString(block_db, i.toString())))
        }
        db_txn.commit()
        return blocks.flatMap((block) => {return block ? [block] : []})
    } catch (err) {
        console.error(err)
        db_txn.abort()
        return []
    }
}