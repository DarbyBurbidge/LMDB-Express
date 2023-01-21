import { BlockTransactionObject } from "web3-eth";
import { block_db, db, txn_db } from "../db";
import { IBlock } from "../models/src/proto/Block";
import { BatchOperation, BatchResult } from "node-lmdb";
import { ITxn } from "../models/src/proto/Txn";

export const addBlocksToDB = (blocks: BlockTransactionObject[]) => {
    try {
        db.batchWrite(blocks.map((block): BatchOperation[] => {
            return [{
                db: block_db,
                key: block.number.toString(),
                value: Buffer.from(IBlock.encode({
                    number: block.number,
                    hash: block.hash,
                    createdAt: Number(block.timestamp),
                    miner: block.miner,
                    txns: block.transactions.map((txn) => { return txn.hash }),
                    gasUsed: block.gasUsed,
                    gasLimit: block.gasLimit,
                    data: block.extraData
                }).finish())},
                block.transactions.map((txn): BatchOperation => {
                    return {
                        db: txn_db,
                        key: txn.hash,
                        value: Buffer.from(ITxn.encode({
                            hash: txn.hash,
                            sender: txn.from,
                            receiver: txn.to ? txn.to : undefined,
                            amount: txn.value,
                            gas: txn.gasPrice,
                            block: txn.blockNumber ? txn.blockNumber : undefined,
                            blockHash: txn.blockHash ? txn.blockHash : undefined,
                            note: txn.input
                        }).finish())
                    }
                })
            ].flat()
            }).flat(), { progress: (results: BatchResult[]) => console.log(results[0]) }, (err, results) => {
                if (err) {
                    console.error(err)
                } else {
                    console.log("success!")
                    console.log(results[0], results[results.length - 1])
                }
            })
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}