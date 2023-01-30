import { Request, Response } from "express"
import { eth } from "../eth"
import { BlockTransactionObject } from "web3-eth"
import { getBlocksFromDB } from "../lmdb/getBlocksFromDB"
import { getTxnFromDB } from "../lmdb/getTxnFromDB"
import { IBlock } from "../models/src/proto/Block"
import { addBlocksToDB } from "../lmdb/addBlocksToDB"

export const getAccountHistory = async (req: Request, res: Response) => {
    const { startBlock, endBlock } = req.query
    const endBlockNum = endBlock ? Number(endBlock) : await eth.getBlockNumber()
    const startBlockNum = startBlock ? Number(startBlock) : endBlockNum - 1000
    let blocks: BlockTransactionObject[] = []

    const blockRange = await getBlocksFromDB(startBlockNum, endBlockNum)
    if (blockRange.length < endBlockNum - startBlockNum) {
        // If the blocks fetched is shorter than the difference
        // Blocks are missing
        blocks = await fetchHistory(startBlockNum, endBlockNum)
    } else {
        if (blockRange && blockRange[0].number > startBlockNum) {
            console.log("low range")
            // Fetch low range -1 so we don't refetch the first block
            blocks = await fetchHistory(startBlockNum, blockRange[0].number - 1)
        }
        if (blockRange && blockRange[blockRange?.length - 1].number < endBlockNum) {
            console.log("high range")
            // Fetch high range + 1 so we don't refetch the last block
            blocks = await fetchHistory(blockRange[blockRange.length - 1].number + 1, endBlockNum)
        }
    }
    addBlocksToDB(blocks).then(async () => {
        res.send((await getBlocksFromDB(startBlockNum, endBlockNum)).map((block: IBlock) => {
            return {
                hash: block.hash,
                number: block.number,
                createdAt: block.createdAt,
                miner: block.miner,
                gasUsed: block.gasUsed,
                gasLimit: block.gasLimit,
                data: block.data,
                txns: block.txns.map((txn => { return getTxnFromDB(txn)}))
            }
        }))
    })
}

const fetchHistory = async (startBlock: number, endBlock: number) => {
    const start = new Date().getTime()
    console.log("fetching blocks", "0")
    const blocks = await scanBlockRange(startBlock, endBlock, 200)
    console.log("done", new Date().getTime() - start)
    return blocks
}
// Most of the design for the next section comes from:
// https://gist.github.com/ross-p/bd5d4258ac23319f363dc75c2b722dd9
// With changes coming from a need to return a list of the txns
// rather than print them.

const scanBlockRange = async (start: number, end: number, maxThreads: number, callback?: Function) => {
    if (typeof end === 'undefined') {
        end = await eth.getBlockNumber()
    }

    if (start > end) {
        return []
    }

    let blockNumber = start,
        gotError = false

    const exitThread = () => {
        if (callback) {
            callback(gotError, end)
        }
    }

    const asyncScanNextBlock = async () => {
        // If we've reached the end, don't scan more blocks
        if (blockNumber > end) {
            exitThread();
        }

        var myBlockNumber = blockNumber++;
        // Write periodic status update so we can tell something is happening
        if (myBlockNumber % maxThreads == 0 || myBlockNumber == end) {
            console.log(`Scanning block ${myBlockNumber}`);
        }
        // Async call to getBlock() means we can run more than 1 thread
        // at a time, which is MUCH faster for scanning.
        try {
            return await eth.getBlock(myBlockNumber, true)
            //const txns = scanBlockCallback(account, block);
            // return txns
        } catch (err) {
            // Error retrieving this block
            gotError = true;
            console.error(err)
            exitThread();
            return undefined
        }
    }
    
    // Create a list of Promises, with each Promise being the return value
    // of asyncScanNextBlock (a list of string/undefineds)
    const pending: Promise<BlockTransactionObject | undefined>[] = []
    const blocks: BlockTransactionObject[][] = []
    while (blockNumber <= end) {
        // Whittle down the number of maxThreads as we near the end
        maxThreads = end - blockNumber > 200 ? 200 : end - blockNumber + 1
        // As long as we haven't reached the end block,
        // and we have fewer pending requests than maxThreads
        // Spawn a new request
        if (pending.length < maxThreads && !gotError) {    
            const active = asyncScanNextBlock()
            pending.push(active)
        }
        // Once we get to maxThreads, make sure they are resolved and start a new batch
        // Then remove the resolved requests from the pending list
        if (pending.length >= maxThreads) {
            blocks.push((await Promise.all(pending)).flatMap((block) => {
                return block ? [block] : []
            }))
            pending.splice(0, maxThreads)
        }
    }
    // Filter out all undefined txns and flatten the list
    return blocks.flat()
}
