import { block_db } from "../db"
import { IBlock } from "../models/src/proto/Block"

export const getBlockFromDB = (blockNum: string): IBlock | {} => {
        const block = block_db.get(blockNum)
        return block
}
