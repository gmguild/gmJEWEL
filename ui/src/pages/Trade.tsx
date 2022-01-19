import React from "react";
import { useAccount } from "wagmi";
import { classNames } from "../utils/classNames";
import { addresses } from "../utils/env";

export default function Trade() {
  const [{ data: accountData }] = useAccount();

  return (
    <article className="font-lora prose lg:prose-xl mx-auto py-6 pb-32">
      {accountData?.address ? (
        <>
          <p>
            Please go to the marketplace on{" "}
            <a
              href="https://game.defikingdoms.com/#/marketplace"
              target="_blank"
              rel="noreferrer"
            >
              DefiKingdoms
            </a>
          </p>
          <p>These are the token addresses:</p>
          <div className="w-8/12 mx-auto">
            <table className={classNames("min-w-full table-auto")}>
              <thead>
                <tr>
                  <th>
                    Token
                  </th>
                  <th>
                    Address
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>JEWEL</td>
                  <td>{addresses.JewelToken}</td>
                </tr>
                <tr>
                  <td>gmJEWEL</td>
                  <td>{addresses.gmJEWEL}</td>
                </tr>
                <tr>
                  <td>GMG</td>
                  <td>{addresses.GMGToken}</td>
                </tr>
                <tr>
                  <td>JEWEL-gmJEWEL LP Token</td>
                  <td>{addresses.JgmJLPToken}</td>
                </tr>
                <tr>
                  <td>JEWEL-GMG LP Token</td>
                  <td>{addresses.JGMGLPToken}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>Please connect your wallet in order to trade</p>
      )}
    </article>
  );
}
