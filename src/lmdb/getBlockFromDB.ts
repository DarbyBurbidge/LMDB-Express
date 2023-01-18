import { block_db, db } from "../db"
import { IBlock } from "../schema/Block.schema"

export const getBlockFromDB = (blockNum: string): IBlock | {} => {
    const db_txn = db.beginTxn()
    try {
        const block: IBlock = JSON.parse(db_txn.getString(block_db, blockNum))
        db_txn.commit()
        return block
    } catch (err) {
        console.error(err)
        db_txn.abort()
        return {}
    }
}
