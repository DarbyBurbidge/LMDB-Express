import { Request, Response } from "express"
import { eth } from "../eth"
import { Block, Transaction } from "web3-eth"
// import { db } from "../db"

export const getAccountHistory = async (req: Request, res: Response) => {
    const account = req.params.accountId
    const { startBlock, endBlock } = req.query
    const endBlockNum = endBlock ? Number(endBlock) : await eth.getBlockNumber()
    const startBlockNum = startBlock ? Number(startBlock) : endBlockNum - 1000

    const txns = await scanBlockRange(account, startBlockNum, endBlockNum, 200)
    // txns.forEach((txn) => {
    //     if (txn) addTxnToAccount(txn, account)
    // })

    res.send(txns)
}
// Most of the design for the next section comes from:
// https://gist.github.com/ross-p/bd5d4258ac23319f363dc75c2b722dd9
// With changes coming from a need to return a list of the txns
// rather than print them.

const scanTransactionCallback = (account: string, txn: Transaction, block: Block) => {
    if (txn.to !== account && txn.from !== account) {
        return undefined
    }
    console.log(`Transaction Found: ${txn.hash} in block ${block.number}`);
    return txn.hash
}

const scanBlockCallback = (account: string, block: Block) => {
    const txns: (string | undefined)[] = []
    console.log("scanning block")
    if (block.transactions) {
        for (var i = 0; i < block.transactions.length; i++) {
            var txn = block.transactions[i] as Transaction;
            txns.push(scanTransactionCallback(account, txn, block));
        }
    }
    return txns
}

const scanBlockRange = async (account: string, start: number, end: number, maxThreads: number, callback?: Function) => {
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

    const asyncScanNextBlock = async (account: string) => {
        // If we've reached the end, don't scan more blocks
        if (blockNumber > end) {
            exitThread();
        }
        // Scan the next block and assign a callback to scan even more
        // once that is done.
        var myBlockNumber = blockNumber++;
        // Write periodic status update so we can tell something is happening
        if (myBlockNumber % maxThreads == 0 || myBlockNumber == end) {
            console.log(`Scanning block ${myBlockNumber}`);
        }
        // Async call to getBlock() means we can run more than 1 thread
        // at a time, which is MUCH faster for scanning.
        try {
            const block = await eth.getBlock(myBlockNumber, true)
            const txns = scanBlockCallback(account, block);
            return txns
        } catch (err) {
            // Error retrieving this block
            gotError = true;
            console.error(err)
            exitThread();
            return []
        }
    }
    
    // Create a list of Promises, with each Promise being the return value
    // of asyncScanNextBlock (a list of string/undefineds)
    const pending: Promise<(string | undefined)[]>[] = []
    const txns: (string | undefined)[][] = []
    while (blockNumber < end) {
        // As long as we haven't reached the end block,
        // If numThreads < maxThreads, spawn a new request
        if (pending.length < maxThreads && !gotError) {    
            const active = asyncScanNextBlock(account)
            pending.push(active)
        }
        if (pending.length >= maxThreads) {
            txns.push((await Promise.all(pending)).flat())
            pending.splice(0, maxThreads)
        }
    }
    // Filter out all undefined txns
    return txns.flat().filter((element) => {
        if (element) return true
        return false
    });
}
