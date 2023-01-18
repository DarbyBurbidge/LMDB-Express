import { Dbi } from "node-lmdb"
import { db } from "../db"

export const checkKey = (key: string, dbi: Dbi): boolean => {
    const db_txn = db.beginTxn()
    try {
        const result = db_txn.getString(dbi, key)
        db_txn.commit()
        return result ? true : false
    } catch (err) {
        console.error(err)
        db_txn.abort()
        return false
    }
}