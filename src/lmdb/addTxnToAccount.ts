/*import { db, txn_db } from "../db"

export const addTxnToAccount = (txnId: string, accountId: string) {
    const db_txn = db.beginTxn()
    try {
        if (db_txn.getString(txn_db, `${accountId}-${txnId}`))
        db_txn.commit()
        return true
    } catch (err) {
        console.error(err)
        db_txn.abort()
        return false
    }
}*/