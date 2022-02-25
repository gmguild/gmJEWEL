import { useCallback, useState } from "react";
import { getCurrencyLogoUrls } from "../components/CurrencyLogo/CurrencyLogo";
import { Currency, Token } from "../package";
import { useActiveWeb3React } from "../services/web3";

export default function useAddTokenToMetaMask(
  currencyToAdd: Currency | undefined
): {
  addToken: () => void;
  success: boolean | undefined;
} {
  const { library } = useActiveWeb3React();

  const token: Token | undefined = currencyToAdd?.wrapped;

  const [success, setSuccess] = useState<boolean | undefined>();

  const addToken = useCallback(() => {
    if (
      library &&
      library.provider.isMetaMask &&
      library.provider.request &&
      token
    ) {
      library.provider
        .request({
          method: "wallet_watchAsset",
          params: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //   @ts-ignore
            type: "ERC20",
            options: {
              address: token.address,
              symbol: token.symbol,
              decimals: token.decimals,
              image: getCurrencyLogoUrls(token),
            },
          },
        })
        .then((success) => {
          setSuccess(success);
        })
        .catch(() => setSuccess(false));
    } else {
      setSuccess(false);
    }
  }, [library, token]);

  return { addToken, success };
}
