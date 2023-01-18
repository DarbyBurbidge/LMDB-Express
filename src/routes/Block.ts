import { Request, Response } from "express";

import { db, block_db } from "../db";
import { eth } from "../eth";
import { blockKeys } from "../schema/Block.schema";
import { getDBBlock } from "../lmdb/getDBBlock";

// handle get requests across '/data/:blockNum' endpoint
export const getBlock = async (req: Request, res: Response) => {
    // set keys for block data
    const blockNum = req.params.blockNum
    const keys = blockKeys(blockNum)
        
    const txn = db.beginTxn()
    // create a cursor for scanning over duplicate keys
    try {
        // Check if keys are in database
        if (Object.values(keys).some((key: string) => {
            return (txn.getString(block_db, key) ? false : true)
        })) {
            // Gets a block from sepolia testnet
            const block = await eth.getBlock(blockNum);
            txn.putString(block_db, keys.hash, block.hash, { noDupData: true })
            txn.putString(block_db, keys.createdAt, String(block.timestamp), { noDupData: true })
            txn.putString(block_db, keys.miner, block.miner, { noDupData: true })
            txn.putString(block_db, keys.gasUsed, String(block.gasUsed), { noDupData: true })
            txn.putString(block_db, keys.gasLimit, String(block.gasLimit), { noDupData: true })
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
        txn.commit()        
        // Returns the transactions from the database to the front end
        res.send(getDBBlock(blockNum))
    } catch (err) {
        // If anything bad happens, kill the transaction and log what happened
        txn.abort()
        console.error(err)
        res.send(err)
    }
}