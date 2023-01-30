import { txn_db } from "../db"
import { ITxn } from "../models/Txn"

export const getTxnFromDB = (txnId: string): ITxn | undefined => {
        const txn: ITxn = txn_db.get(txnId)
        return txn
}