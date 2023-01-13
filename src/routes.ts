import { Request, Response } from "express";
import { db, db1 } from "./db";

// handle get requests across '/data/:id' endpoint
export const getDataById = (req: Request, res: Response) => {
    // Note: this example is setup to handle reqests with a JSON body
    const txn = db.beginTxn()
    try {
        // The whole transaction just toggles between outputting 'Hello World!' and null
        const val = txn.getString(db1, 1)
        console.log(val)
        if (val == null || req == null) {
            txn.putString(db1, 1, "Hello World!");
        } else {
            txn.del(db1, 1);
        }
        console.log(req.params.id)
        // console.log(req.body.id)
        
        txn.putString(db1, 2, req.params.id);
        // txn.putString(db1, 2, req.body.id)
        txn.commit();
    } catch (err) {
        // If anything bad happens, kill the transaction and log what happened
        txn.abort()
        console.error(err)
    }
    res.send("tada")
}