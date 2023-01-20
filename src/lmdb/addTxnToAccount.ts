import { account_db, db } from "../db"

export const addTxnToAccount = (txnId: string, accountId: string) => {
    const db_txn = db.beginTxn()
    try {
        const txnStr = db_txn.getString(account_db, accountId)
        const prevHistory = txnStr ? JSON.parse(txnStr) : []
        const newHistory = [...new Set([prevHistory.length > 0 ? prevHistory : [] , txnId].flat())]
        db_txn.putString(account_db, accountId, JSON.stringify(newHistory))
        db_txn.commit()
        return true
    } catch (err) {
        console.error(err)
        db_txn.abort()
        return false
    }
}