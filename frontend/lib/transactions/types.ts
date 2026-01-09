export type Tx = {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: string | number;
  status: string;
  timestamp: string;
  gasLimit?: string;
  gasPrice?: string;
  __optimistic__?: boolean;
};
