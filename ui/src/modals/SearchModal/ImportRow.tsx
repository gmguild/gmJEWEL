import React, { FC } from "react";
import Chip from "../../components/Chip";
import { CurrencyLogo } from "../../components/CurrencyLogo";
import HeadlessUiModal from "../../components/Modal/HeadlessUIModal";
import Typography from "../../components/Typography";
import { Token } from "../../package";
import { shortenAddress } from "../../utils/conversion";

interface ImportRow {
  token: Token;
  onClick(x: any): void;
}

const ImportRow: FC<ImportRow> = ({ token, onClick }) => {
  return (
    <HeadlessUiModal.BorderedContent
      className="border hover:border-gray-700 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full overflow-hidden border border-taupe-200">
            <CurrencyLogo currency={token} size={48} />
          </div>
          <div className="flex flex-col">
            <div className="flex gap-2 items-center">
              <Typography
                variant="lg"
                weight={700}
                component="span"
                className="text-white"
              >
                {token.symbol}{" "}
                <Typography variant="xs" component="span">
                  {token.name}
                </Typography>
              </Typography>

              <Chip color="yellow" size="sm" label={`Unknown Source`}>
                {`Unknown Source`}
              </Chip>
            </div>
            <Typography variant="xxs" weight={700}>
              {shortenAddress(token.address)}
            </Typography>
          </div>
        </div>
      </div>
    </HeadlessUiModal.BorderedContent>
  );
};

export default ImportRow;
