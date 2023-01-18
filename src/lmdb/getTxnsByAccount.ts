import { Request, Response } from "express"
import { eth } from "../eth"
import { Block, Transaction } from "web3-eth"
import Web3 from "web3"
// import { db } from "../db"

export const getTxnsByAccount = async (req: Request, res: Response) => {
    const account = req.params.accountId
    const { startBlock, endBlock } = req.query
    console.log(req.query)
    //const txns: string[] = []
    //const txn = db.beginTxn()
    console.log(startBlock, endBlock)
    const endBlockNum = endBlock ? Number(endBlock) : await eth.getBlockNumber()
    const startBlockNum = startBlock ? Number(startBlock) : endBlockNum - 1000
    /*for (let i = startBlockNum; i <= endBlockNum; i++) {
        console.log(startBlockNum, endBlockNum)
        if (i % 1000 == 0) {
            console.log(`Searching block ${i}`)
        }
        const block = await eth.getBlock(i, true);
        if (block != null && block.transactions != null) {
            block.transactions.forEach((txn) => {
                if (account == txn.from || account == txn.to) {
                    txns.push(txn.hash)
                    console.log(txn.hash)
                }
            })
        }
    }*/

    const txns = await scanBlockRange(account, startBlockNum, endBlockNum, 200)


    res.send(txns)
}

const scanTransactionCallback = (account: string, txn: Transaction, block: Block) => {

//    console.log(JSON.stringify(block, null, 4));
//    console.log(JSON.stringify(txn, null, 4));

    if (txn.to === account) {

        // A transaction credited ether into this wallet
        var ether = Web3.utils.fromWei(txn.value, 'ether');
        console.log(`\r${block.number} +${ether} from ${txn.from}`);
        return txn.hash

    } else if (txn.from === account) {

        // A transaction debitted ether from this wallet
        var ether = Web3.utils.fromWei(txn.value, 'ether');
        console.log(`\r${block.number} -${ether} to ${txn.to}`);
        return txn.hash
    } else {
        return undefined
    }
}

const scanBlockCallback = (account: string, block: Block) => {
    const txns: (string | undefined)[] = []
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
        return -1
    }

    let blockNumber = start,
        gotError = false,
        numThreads = 0

    const exitThread = () => {
        numThreads--
        if (callback) {
            callback(gotError, end)
        }
        return numThreads
    }

    const asyncScanNextBlock = async (account: string) => {

        // If we've encountered an error, stop scanning blocks
        if (gotError) {
            exitThread();
        }

        // If we've reached the end, don't scan more blocks
        if (blockNumber > end) {
            exitThread();
        }

        // Scan the next block and assign a callback to scan even more
        // once that is done.
        var myBlockNumber = blockNumber++;

        // Write periodic status update so we can tell something is happening
        if (myBlockNumber % maxThreads == 0 || myBlockNumber == end) {
            process.stdout.write(`\rScanning block ${myBlockNumber}`);
        }

        // Async call to getBlock() means we can run more than 1 thread
        // at a time, which is MUCH faster for scanning.
        try {
            const block = await eth.getBlock(myBlockNumber, true,)
            const txns: (string | undefined)[] = scanBlockCallback(account, block);
            return txns
        } catch (err) {
            // Error retrieving this block
            gotError = true;
            return []
        }
    }
    
    const pending: Promise<(string | undefined)[]>[] = []
    do {
        for (let nt = 0; nt < maxThreads && start + nt <= end; nt++) {
            numThreads++;
            pending.push(asyncScanNextBlock(account))
        }
        console.log(numThreads)
    } while (blockNumber < end)
    const txns = await Promise.all(pending)
    return txns.flat().filter((element) => {
        if (element) return true
        return false
    }); // number of threads spawned (they'll continue processing)
}
