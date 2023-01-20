import { db, txn_db } from "../db"
import { ITxn } from "../schema/Txn.schema"

export const getTxnFromDB = (txnId: string): ITxn | {} => {
    const db_txn = db.beginTxn()
    try {
        const txn: ITxn = JSON.parse(db_txn.getString(txn_db, txnId))
        db_txn.commit()
        return txn
    } catch (err) {
        console.error(err)
        db_txn.abort()
        return {}
    } 
}