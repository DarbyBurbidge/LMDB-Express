import { Request, Response } from "express";

import { block_db } from "../db";
import { eth } from "../eth";
import { getBlockFromDB } from "../lmdb/getBlockFromDB";
import { checkKey } from "../lmdb/checkKey";
import { addBlockToDB } from "../lmdb/addBlockToDB";

// handle get requests across '/data/:blockNum' endpoint
export const getBlock = async (req: Request, res: Response) => {
    // set keys for block data
    const blockNum = req.params.blockNum.toString()
    // Check if keys are in database
    if (!checkKey(blockNum, block_db)) {
        // Gets a block from sepolia testnet
        const block = await eth.getBlock(blockNum, true);
        await addBlockToDB(block)
    }
    // Returns the transactions from the database to the front end
    res.send(getBlockFromDB(blockNum))
}