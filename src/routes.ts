import { Request, Response } from "express";

import { db, db1 } from "./db";
import { eth } from "./eth";

// handle get requests across '/data/:blockId' endpoint
export const getDataById = async (req: Request, res: Response) => {
    // 
    const txn = db.beginTxn()
    try {
        // Get's the current value in position 1 in the database
        const val = txn.getString(db1, 1)
        console.log(val)
        // Gets a block from sepolia testnet
        const block = await eth.getBlock(req.params.blockId);
        // Logs that blockId into the database overwriting position 1
        txn.putString(db1, 1, req.params.blockId);
        txn.commit();
        console.log("success")
        // Returns the transactions from the block to the front end
        res.send(block.transactions)
    } catch (err) {
        // If anything bad happens, kill the transaction and log what happened
        txn.abort()
        console.error(err)
    }

}