import { block_db } from "../db"
import { IBlock } from "../models/Block"

export const getBlocksFromDB = async (startBlock: number, endBlock: number): Promise<IBlock[]> => {
    const blocks: IBlock[] = []
    for (let i = startBlock; i <= endBlock; i++) {
        blocks.push(await block_db.get(i.toString()))
    }
    return blocks.flatMap((block) => {return block ? [block] : []})
}