import { Transaction } from "web3-eth";
import { db, txn_db } from "../db";

export const addDBTxns = (txns: Transaction[]) => {
    const db_txn = db.beginTxn()
    try {
        txns.forEach((txn) => {
            db_txn.putString(txn_db, `${txn.hash}-sender`, txn.from)
            db_txn.putString(txn_db, `${txn.hash}-receiver`, txn.to!)
            db_txn.putString(txn_db, `${txn.hash}-amt`, txn.value)
            db_txn.putString(txn_db, `${txn.hash}-gas`, String(txn.gasPrice))
            db_txn.putString(txn_db, `${txn.hash}-block`, String(txn.blockNumber))
            db_txn.putString(txn_db, `${txn.hash}-note`, txn.input)
            console.log(`Added Txn: ${txn.hash}`)
        })
        db_txn.commit()
        return true
    } catch (err) {
        console.error(err)
        db_txn.abort()
        return false
    }
}