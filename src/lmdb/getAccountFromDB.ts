import { account_db, db } from "../db"

export const getAccountFromDB = (accountId: string) => {
    const db_txn = db.beginTxn()
    try {
        const history = JSON.parse(db_txn.getString(account_db, accountId))
        db_txn.commit()
        console.log(history)
        return history
    } catch (err) {
        console.error(err)
        db_txn.abort()
        return undefined
    }
}