import { Request, Response } from "express";
import { db, txn_db } from "../db";
import { eth } from "../eth";
import { Txn } from "node-lmdb";
import Web3 from "web3";
import { ITxn } from "../schema/Txn.schema";

export const getTxn = async (req: Request, res: Response) => {
    const txnId = req.params.txnId
    const keys: ITxn = {
        sender: `${txnId}-sender`,
        receiver: `${txnId}-receiver`,
        amount: `${txnId}-amount`,
        gas: `${txnId}-gas`,
        block: `${txnId}-block`,
        note: `${txnId}-note`
    }
    const txn = db.beginTxn()
    // Check if key is in database
    try {
        if (Object.keys(keys).some((key) => {
            console.log(key)
            /*if (key.includes('gas')) {
                return txn.getNumber(txn_db, key) ? false : true
            }*/
            return (txn.getString(txn_db, `${txnId}-${key}`) ? false : true)
        })) {
            // Gets a block from sepolia testnet
            const chain_txn = await eth.getTransaction(txnId);
            // Logs each transaction into the database with key txnId
            txn.putString(txn_db, `${txnId}-sender`, chain_txn.from)
            txn.putString(txn_db, `${txnId}-receiver`, chain_txn.to!)
            txn.putString(txn_db, `${txnId}-amount`, chain_txn.value)
            txn.putString(txn_db, `${txnId}-gas`, String(chain_txn.gasPrice))
            txn.putString(txn_db, `${txnId}-block`, String(chain_txn.blockNumber))
            txn.putString(txn_db, `${txnId}-note`, chain_txn.input)
            console.log(`Added Txn: ${txnId}`)
        }            
        // Returns the transactions from the database to the front end
        res.send(getDetailsByTxnId(req.params.txnId, txn))
        txn.commit();
        console.log("success" )
    } catch (err) {
        // If anything bad happens, kill the transaction and log what happened
        txn.abort()
        console.error(err)
        res.send(err)
    }
}

const getDetailsByTxnId = (txnId: string, txn: Txn): ITxn => {
    return {
        sender: txn.getString(txn_db, `${txnId}-sender`),
        receiver: txn.getString(txn_db, `${txnId}-receiver`),
        amount: txn.getString(txn_db, `${txnId}-amt`),
        gas: Web3.utils.fromWei(txn.getString(txn_db, `${txnId}-gas`), 'Gwei'),
        block: txn.getString(txn_db, `${txnId}-block`),
        note: txn.getString(txn_db, `${txnId}-note`)
    }
}