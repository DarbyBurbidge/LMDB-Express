import { Transaction } from "web3-eth";
import { db, txn_db } from "../db";

export const addTxnToDB = (txn: Transaction) => {
    const db_txn = db.beginTxn()
    try {
        const stringified_txn = JSON.stringify({
            hash: txn.hash,
            sender: txn.from,
            receiver: txn.to,
            amount: txn.value,
            gas: txn.gasPrice,
            block: txn.blockNumber,
            blockHash: txn.blockHash,
            note: txn.input
        })
        db_txn.putString(txn_db, txn.hash, stringified_txn)
        console.log(`Txn Added: ${txn.hash}`)
        db_txn.commit()
    } catch (err) {
        console.error(err)
        db_txn.abort()
    }
}