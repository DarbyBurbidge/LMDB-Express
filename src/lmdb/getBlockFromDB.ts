import { block_db, db } from "../db"
import { IBlock } from "../models/src/proto/Block"

export const getBlockFromDB = (blockNum: string): IBlock | {} => {
    const db_txn = db.beginTxn()
    try {
        const block: IBlock = IBlock.decode(db_txn.getBinary(block_db, blockNum))
        db_txn.commit()
        return block
    } catch (err) {
        console.error(err)
        db_txn.abort()
        return {}
    }
}
