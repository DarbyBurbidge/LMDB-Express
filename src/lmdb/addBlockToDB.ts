import { BlockTransactionObject, Transaction } from "web3-eth";
import { block_db } from "../db";
import { addTxnToDB } from "./addTxnToDB";
import { IBlock } from "../models/src/proto/Block";

export const addBlockToDB = async (block: BlockTransactionObject) => {
    block.transactions.forEach(async (txn: Transaction) => {
        await addTxnToDB(txn)
    })
    const bin_block: IBlock = {
        number: block.number,
        hash: block.hash,
        createdAt: Number(block.timestamp),
        miner: block.miner,
        txns: block.transactions.map((txn: Transaction) => {return txn.hash}),
        gasUsed: block.gasUsed,
        gasLimit: block.gasLimit,
        data: block.extraData
    }
    await block_db.put(block.number.toString(), bin_block)
}