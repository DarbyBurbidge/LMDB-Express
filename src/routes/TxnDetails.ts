import { Request, Response } from "express";
import { db, txn_db } from "../db";
import { eth } from "../eth";
import { Txn } from "node-lmdb";

export const getTxnDetails = async (req: Request, res: Response) => {
    const txn = db.beginTxn()
    try {
        const sender = txn.getString(txn_db, `${req.params.txnId}-sender`)
        const receiver = txn.getString(txn_db, `${req.params.txnId}-receiver`)
        const amount = txn.getString(txn_db, `${req.params.txnId}-amt`)
        // Check if key is in database
        if (!sender || !receiver || !amount) {
            // Gets a block from sepolia testnet
            const chain_txn = await eth.getTransaction(req.params.txnId);
            // Logs each transaction into the database with key blockId
            txn.putString(txn_db, `${req.params.txnId}-sender`, chain_txn.from)
            txn.putString(txn_db, `${req.params.txnId}-receiver`, chain_txn.to!)
            txn.putString(txn_db, `${req.params.txnId}-amt`, chain_txn.value)
            console.log(`Added Txn: ${req.params.txnId}`)
        }            
        // Returns the transactions from the database to the front end
        res.send(getDetailsByTxnId(req.params.txnId, txn))
        txn.commit();
        console.log("success" )
    } catch (err) {
        // If anything bad happens, kill the transaction and log what happened
        txn.abort()
        console.error(err)
        res.send(err)
    }
}

const getDetailsByTxnId = (txnId: string, txn: Txn) => {
    return {
        sender: txn.getString(txn_db, `${txnId}-sender`),
        receiver: txn.getString(txn_db, `${txnId}-receiver`),
        amount: txn.getNumber(txn_db, `${txnId}-amt`)
    }
}