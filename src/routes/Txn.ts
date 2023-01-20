import { Request, Response } from "express";
import { txn_db } from "../db";
import { eth } from "../eth";
import { checkKey } from "../lmdb/checkKey";
import { addTxnToDB } from "../lmdb/addTxnToDB";
import { getTxnFromDB } from "../lmdb/getTxnFromDB";

export const getTxn = async (req: Request, res: Response) => {
    const txnId = req.params.txnId

    // Check if key is in database
    if (!checkKey(txnId, txn_db)) {
        // Gets a Transaction from sepolia testnet
        const chain_txn = await eth.getTransaction(txnId);
        addTxnToDB(chain_txn)
    }            
    // Returns the transactions from the database to the front end
    res.send(getTxnFromDB(txnId))
}