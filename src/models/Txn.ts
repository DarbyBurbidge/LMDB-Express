
export interface ITxn {
  hash: string;
  sender: string;
  receiver?: string;
  amount: string;
  gas: string;
  block?: number;
  blockHash?: string;
  note: string;
}
