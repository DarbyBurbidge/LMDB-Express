
export interface IBlock {
  number: number;
  hash: string;
  createdAt: number;
  miner: string;
  gasUsed: number;
  gasLimit: number;
  data: string;
  txns: string[];
}