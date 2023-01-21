import { db, txn_db } from "../db"
import { ITxn } from "../models/src/proto/Txn"

export const getTxnFromDB = (txnId: string): ITxn | undefined => {
    const db_txn = db.beginTxn()
    try {
        const txn: ITxn = ITxn.decode(db_txn.getBinary(txn_db, txnId))
        db_txn.commit()
        return txn
    } catch (err) {
        console.error(err)
        db_txn.abort()
        return undefined
    } 
}