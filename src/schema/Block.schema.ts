export interface IBlock {
    number: number,
    hash: string,
    createdAt: string,
    miner: string,
    gasUsed: string,
    gasLimit: string,
    data: string,
    txns: string[]
}