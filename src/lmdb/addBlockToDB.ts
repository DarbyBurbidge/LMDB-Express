import { BlockTransactionObject, Transaction } from "web3-eth";
import { block_db, db } from "../db";
import { addTxnToDB } from "./addTxnToDB";
import { IBlock } from "../models/src/proto/Block";

export const addBlockToDB = (block: BlockTransactionObject) => {
    block.transactions.forEach((txn: Transaction) => {
        addTxnToDB(txn)
    })
    const db_txn = db.beginTxn()
    try {
        const bin_block = Buffer.from(IBlock.encode({
            number: block.number,
            hash: block.hash,
            createdAt: Number(block.timestamp),
            miner: block.miner,
            txns: block.transactions.map((txn: Transaction) => {return txn.hash}),
            gasUsed: block.gasUsed,
            gasLimit: block.gasLimit,
            data: block.extraData
        }).finish())
        db_txn.putBinary(block_db, block.number.toString(), bin_block)
        console.log(`Block Added: ${block.number}`)
        db_txn.commit()
    } catch (err) {
        console.error(err)
        db_txn.abort()
    }
}