import { Transaction } from "web3-eth";
import { db, txn_db } from "../db";
import { ITxn } from "../models/src/proto/Txn";

export const addTxnToDB = (txn: Transaction) => {
    const db_txn = db.beginTxn()
    try {
        const stringified_txn = Buffer.from(ITxn.encode({
            hash: txn.hash,
            sender: txn.from,
            receiver: txn.to ? txn.to : undefined,
            amount: txn.value,
            gas: txn.gasPrice,
            block: txn.blockNumber ? txn.blockNumber : undefined,
            blockHash: txn.blockHash ? txn.blockHash : undefined,
            note: txn.input
        }).finish())
        db_txn.putBinary(txn_db, txn.hash, stringified_txn)
        console.log(`Txn Added: ${txn.hash}`)
        db_txn.commit()
    } catch (err) {
        console.error(err)
        db_txn.abort()
    }
}