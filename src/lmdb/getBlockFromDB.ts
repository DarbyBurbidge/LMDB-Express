import { block_db } from "../db"
import { IBlock } from "../models/Block"

export const getBlockFromDB = (blockNum: string): IBlock | {} => {
        const block = block_db.get(blockNum)
        return block
}
