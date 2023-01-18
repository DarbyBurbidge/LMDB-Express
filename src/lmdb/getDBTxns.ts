import Web3 from "web3"
import { db, txn_db } from "../db"
import { ITxn } from "../schema/Txn.schema"

export const getDBTxns = (txnIds: string[]): ITxn[] => {
    const db_txn = db.beginTxn()
    try {
        const txns = txnIds.map((txnId) => {
            return {
                sender: db_txn.getString(txn_db, `${txnId}-sender`),
                receiver: db_txn.getString(txn_db, `${txnId}-receiver`),
                amount: db_txn.getString(txn_db, `${txnId}-amt`),
                gas: Web3.utils.fromWei(db_txn.getString(txn_db, `${txnId}-gas`), 'Gwei'),
                block: db_txn.getString(txn_db, `${txnId}-block`),
                note: db_txn.getString(txn_db, `${txnId}-note`),
            }
        })
        db_txn.commit()
        return txns
    } catch (err) {
        console.error(err)
        db_txn.abort()
        return []
    }
}