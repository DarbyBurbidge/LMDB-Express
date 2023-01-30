import { Transaction } from "web3-eth";
import { txn_db } from "../db";
import { ITxn } from "../models/Txn";

export const addTxnToDB = async (txn: Transaction) => {
    const stringified_txn: ITxn = {
        hash: txn.hash,
        sender: txn.from,
        receiver: txn.to ? txn.to : undefined,
        amount: txn.value,
        gas: txn.gasPrice,
        block: txn.blockNumber ? txn.blockNumber : undefined,
        blockHash: txn.blockHash ? txn.blockHash : undefined,
        note: txn.input
    }
    await txn_db.put(txn.hash, stringified_txn)
}