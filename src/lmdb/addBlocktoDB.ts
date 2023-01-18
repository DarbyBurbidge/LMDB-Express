import { Block } from "web3-eth";
import { block_db, db } from "../db";

export const addBlockToDB = (block: Block) => {
    const db_txn = db.beginTxn()
    try {
        const stringified_block = JSON.stringify({
            hash: block.hash,
            createdAt: block.timestamp,
            miner: block.miner,
            txns: block.transactions,
            gasUsed: block.gasUsed,
            gasLimit: block.gasLimit,
            data: block.extraData
        })
        console.log(stringified_block)
        db_txn.putString(block_db, block.number.toString(), stringified_block)
        console.log(`Block Added: ${block.number}`)
        db_txn.commit()
    } catch (err) {
        console.error(err)
        db_txn.abort()
    }
}