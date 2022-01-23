export type UTXO = {
  minter: string;
  utxoAddress: string;
};

export type FullUTXO = UTXO & {
  blockNumber: number;
  newVal: string;
  timestamp: Date;
};

export type UTXORedemptionRecord =   {
  tx: string;
  utxoAddress: string;
  redeemedBy: string;
  amount: string;
  fee: string;
  amountInJewel: string;
  totalCost: string;
  blockNumber: number;
  timestamp: string;
}
