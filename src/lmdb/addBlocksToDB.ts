import { BlockTransactionObject } from "web3-eth";
//import { block_db, txn_db } from "../db";
import { addBlockToDB } from "./addBlockToDB";



export const addBlocksToDB = async (blocks: BlockTransactionObject[]) => {
    return await Promise.all(blocks.map(async (block) => {
        await addBlockToDB(block)
    }))
}