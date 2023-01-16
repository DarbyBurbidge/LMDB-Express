import { Request, Response } from "express";
import { eth } from "../eth";

export const getBalance = async (req: Request, res: Response) => {
    const accountId = req.params.accountId
    const blockNum = req.query.blockNum
    console.log(blockNum)
    const balance = await eth.getBalance(accountId, blockNum ? String(blockNum) : 'latest')
        
    res.send({
        balance: balance
    })
}