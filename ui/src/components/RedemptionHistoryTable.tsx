import React from "react";
import { classNames } from "../utils/classNames";
import { bigNumberToFloat, shortenAddress, shortenTx } from "../utils/conversion";
import { useGetUTXORedemptionHistory } from "../hooks/utxo/useGetUTXORedemptionHistory";
import { UpdatingTimestamp } from "./UpdatingTimestamp";

export function RedemptionHistoryTable() {
  const [utxoRedemptionHistory, loadingUtxoRedemptionHistory] = useGetUTXORedemptionHistory();

  return (
    <article className="px-4 md:px-0 my-4 prose w-full mx-auto max-w-5xl font-lora">
      <h4 className="italic text-center">Previous Redemptions (max 20)</h4>
      <table className={classNames("mt-4 min-w-full table-auto")}>
        <thead>
          <tr>
            <th>TX</th>
            <th>Time</th>
            <th>Stash</th>
            <th>Redeemed By</th>
            <th>Amount</th>
            <th>Fee</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {loadingUtxoRedemptionHistory ? (
            <>
              <tr>
                <td colSpan={7}>Loading...</td>
              </tr>
            </>
          ) : (
            <>
              {utxoRedemptionHistory.map((record, i) => (
                <tr key={i}>
                  <td>
                    <a
                      className="underline font-bold text-gray-900 hover:text-blue-500"
                      target="_blank"
                      href={`https://explorer.harmony.one/tx/${record.tx}`} rel="noreferrer">
                      {shortenTx(record.tx)}
                    </a>
                  </td>
                  <td><UpdatingTimestamp date={new Date(record.timestamp)} /></td>
                  <td>
                    <a
                      className="underline font-bold text-gray-900 hover:text-blue-500"
                      target="_blank"
                      href={`https://explorer.harmony.one/address/${record.utxoAddress}`} rel="noreferrer">
                      {shortenAddress(record.utxoAddress)}
                    </a>
                  </td>
                  <td>
                    <a
                      className="underline font-bold text-gray-900 hover:text-blue-500"
                      target="_blank"
                      href={`https://explorer.harmony.one/address/${record.redeemedBy}`} rel="noreferrer">
                      {shortenAddress(record.redeemedBy)}
                    </a>
                  </td>
                  <td>{bigNumberToFloat(record.amount).toFixed(3)}</td>
                  <td>{bigNumberToFloat(record.fee).toFixed(3)}</td>
                  <td>{bigNumberToFloat(record.totalCost).toFixed(3)}</td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </article>
  );
}
