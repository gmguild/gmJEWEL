export type UTXO = {
  minter: string;
  utxoAddress: string;
};

export type FullUTXO = UTXO & {
  blockNumber: number;
  newVal: string;
  timestamp: Date;
};
