import { BlockTransactionObject, Transaction } from "web3-eth";
import { block_db, db } from "../db";
import { addTxnToDB } from "./addTxnToDB";

export const addBlockToDB = (block: BlockTransactionObject) => {
    block.transactions.forEach((txn: Transaction) => {
        addTxnToDB(txn)
    })
    const db_txn = db.beginTxn()
    try {
        const stringified_block = JSON.stringify({
            number: block.number,
            hash: block.hash,
            createdAt: block.timestamp,
            miner: block.miner,
            txns: block.transactions.map((txn: Transaction) => {return txn.hash}),
            gasUsed: block.gasUsed,
            gasLimit: block.gasLimit,
            data: block.extraData
        })
        db_txn.putString(block_db, block.number.toString(), stringified_block)
        console.log(`Block Added: ${block.number}`)
        db_txn.commit()
    } catch (err) {
        console.error(err)
        db_txn.abort()
    }
}