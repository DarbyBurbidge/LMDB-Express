import { Request, Response } from "express";

import { db, block_db } from "../db";
import { eth } from "../eth";
import { Cursor } from "node-lmdb";

// handle get requests across '/data/:blockNum' endpoint
export const getBlock = async (req: Request, res: Response) => {
    // set keys for block data
    const blockNum = req.params.blockNum
    const keys = {
        hash: `${blockNum}-hash`,
        createdAt: `${blockNum}-createdAt`,
        miner: `${blockNum}-miner`,
        gasUsed: `${blockNum}-gasUsed`,
        gasLimit: `${blockNum}-gasLimit`,
        data: `${blockNum}-data`,
        txns: `${blockNum}-txns`
    }
        
    const txn = db.beginTxn()
    // create a cursor for scanning over duplicate keys
    const cursor = new Cursor(txn, block_db);
    try {
        // Check if keys are in database
        if (Object.keys(keys).some((key) => {
            console.log(key)
            if (key.includes('gas')) {
                return txn.getNumber(block_db, `${blockNum}-${key}`) ? false : true
            }
            return (txn.getString(block_db, `${blockNum}-${key}`) ? false : true)
        })) {
            // Gets a block from sepolia testnet
            const block = await eth.getBlock(blockNum);
            txn.putString(block_db, keys.hash, block.hash, { noDupData: true })
            txn.putString(block_db, keys.createdAt, String(block.timestamp), { noDupData: true })
            txn.putString(block_db, keys.miner, block.miner, { noDupData: true })
            txn.putNumber(block_db, keys.gasUsed, block.gasUsed, { noDupData: true })
            txn.putNumber(block_db, keys.gasLimit, block.gasLimit, { noDupData: true })
            txn.putString(block_db, keys.data, block.extraData, { noDupData: true })
            // Logs each transaction into the database with key blockNum
            if (txn.getString(block_db, keys.txns)) {
                txn.del(block_db, keys.txns)
            }
            block.transactions.forEach((transaction) => {
                txn.putString(block_db, keys.txns, transaction)
            })
            console.log(`Block Added: ${blockNum}`)
        }            
        // Returns the transactions from the database to the front end
        res.send({
            hash: txn.getString(block_db, keys.hash),
            createdAt: txn.getString(block_db, keys.createdAt),
            miner: txn.getString(block_db, keys.miner),
            gasUsed: txn.getNumber(block_db, keys.gasUsed),
            gasLimit: txn.getNumber(block_db, keys.gasLimit),
            data: txn.getString(block_db, keys.data),
            txns: getDupValuesByKeyString(keys.txns, cursor)
        })
        txn.commit();
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
            i++
        } while (cursor.goToNextDup())
    }
    return txnIds
}