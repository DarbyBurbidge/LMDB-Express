import { Request, Response } from "express";

import { db, block_db } from "./db";
import { eth } from "./eth";
import { Cursor } from "node-lmdb";

// handle get requests across '/data/:blockId' endpoint
export const getDataById = async (req: Request, res: Response) => {
    // 
    const txn = db.beginTxn()
    // create a cursor for scanning over duplicate keys
    const cursor = new Cursor(txn, block_db);
    try {
        // Check if key is in database
        if (!cursor.goToKey(req.params.blockId)) {
            // Gets a block from sepolia testnet
            const block = await eth.getBlock(req.params.blockId);
            // Logs each transaction into the database with key blockId
            block.transactions.forEach((transaction) => {
                txn.putString(block_db, req.params.blockId, transaction)
                console.log(`Transaction ID Added: ${transaction}`)
            })
        }            
        // Returns the transactions from the database to the front end
        res.send(getDupValuesByKeyString(req.params.blockId, cursor))
        txn.commit();
        console.log("success" )
    } catch (err) {
        // If anything bad happens, kill the transaction and log what happened
        txn.abort()
        console.error(err)
        res.send(err)
    }

}

const getDupValuesByKeyString = (key: string, cursor: Cursor) => {
    const txnIds: (string | null)[] = []
    if(cursor.goToKey(key)) {  
        var i = 0;
        do {
            txnIds[i] = cursor.getCurrentString()
            console.log(txnIds[i])
            i++
        } while (cursor.goToNextDup())
    }
    return txnIds
}