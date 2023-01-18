export interface IBlock {
    hash: string,
    createdAt: string,
    miner: string,
    gasUsed: number,
    gasLimit: number,
    data: string,
    txns: string[]
}

interface BlockKeys {
    hash: string,
    createdAt: string,
    miner: string,
    gasUsed: string,
    gasLimit: string,
    data: string,
    txns: string
}

export const blockKeys = (blockNum: string): BlockKeys => {
    return {
        hash: `${blockNum}-hash`,
        createdAt: `${blockNum}-createdAt`,
        miner: `${blockNum}-miner`,
        gasUsed: `${blockNum}-gasUsed`,
        gasLimit: `${blockNum}-gasLimit`,
        data: `${blockNum}-data`,
        txns: `${blockNum}-txns`
    }
}