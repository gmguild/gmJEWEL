import { addresses, abis } from "./env/dev";

declare let SERVICE_URL: string;

export const serverUrl = SERVICE_URL;

declare let RPC_URL: string;

export const rpcUrl = RPC_URL;

export { addresses, abis };

declare let DFK_URL: string;

export const dfkUrl = DFK_URL;
