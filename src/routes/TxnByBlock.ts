import { Request, Response } from "express";

import { db, block_db } from "../db";
import { eth } from "../eth";
import { Cursor } from "node-lmdb";

// handle get requests across '/data/:blockId' endpoint
export const getTxnsByBlock = async (req: Request, res: Response) => {
    // set keys for block data
    const blockId = req.params.blockId
    const keys = {
        createdAt: `${blockId}-createdAt`,
        miner: `${blockId}-miner`,
        gasUsed: `${blockId}-gasUsed`,
        gasLimit: `${blockId}-gasLimit`,
        data: `${blockId}-data`,
        txns: `${blockId}-txns`
    }
        
    const txn = db.beginTxn()
    // create a cursor for scanning over duplicate keys
    const cursor = new Cursor(txn, block_db);
    try {
        // Check if key is in database
        if (Object.keys(keys).some((key) => {
            console.log(key)
            if (key.includes('gas')) {
                return txn.getNumber(block_db, key) ? false : true
            }
            return (txn.getString(block_db, key) ? false : true)
        })) {
            // Gets a block from sepolia testnet
            const block = await eth.getBlock(blockId);
            txn.putString(block_db, keys.createdAt, String(block.timestamp), { noDupData: true })
            txn.putString(block_db, keys.miner, block.miner, { noDupData: true })
            txn.putNumber(block_db, keys.gasUsed, block.gasUsed, { noDupData: true })
            txn.putNumber(block_db, keys.gasLimit, block.gasLimit, { noDupData: true })
            txn.putString(block_db, keys.data, block.extraData, { noDupData: true })
            // Logs each transaction into the database with key blockId
            block.transactions.forEach((transaction) => {
                txn.putString(block_db, keys.txns, transaction)
                console.log(`Transaction ID Added: ${transaction}`)
            })

        }            
        // Returns the transactions from the database to the front end
        res.send({
            createdAt: txn.getString(block_db, keys.createdAt),
            miner: txn.getString(block_db, keys.miner),
            gasUsed: txn.getNumber(block_db, keys.gasUsed),
            gasLimit: txn.getNumber(block_db, keys.gasLimit),
            data: txn.getString(block_db, keys.data),
            txns: getDupValuesByKeyString(keys.txns, cursor)
        })
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