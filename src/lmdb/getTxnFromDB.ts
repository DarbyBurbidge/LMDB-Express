import { txn_db } from "../db"
import { ITxn } from "../models/src/proto/Txn"

export const getTxnFromDB = (txnId: string): ITxn | undefined => {
        const txn: ITxn = txn_db.get(txnId)
        return txn
}