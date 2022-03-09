/* eslint-disable @typescript-eslint/ban-ts-comment */
import CID from "cids";
// @ts-ignore
import { getCodec, rmPrefix } from "multicodec";
// @ts-ignore
import { decode, toB58String } from "multihashes";

export function hexToUint8Array(hex: string): Uint8Array {
  hex = hex.startsWith("0x") ? hex.substr(2) : hex;
  if (hex.length % 2 !== 0)
    throw new Error("hex must have length that is multiple of 2");
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return arr;
}

const UTF_8_DECODER = new TextDecoder();

/**
 * Returns the URI representation of the content hash for supported codecs
 * @param contenthash to decode
 */
export function contenthashToUri(contenthash: string): string {
  const buff = hexToUint8Array(contenthash);
  const codec = getCodec(buff as Buffer); // the typing is wrong for @types/multicodec
  switch (codec) {
    case "ipfs-ns": {
      const data = rmPrefix(buff as Buffer);
      const cid = new CID(Buffer.from(data));
      return `ipfs://${toB58String(cid.multihash)}`;
    }
    case "ipns-ns": {
      const data = rmPrefix(buff as Buffer);
      const cid = new CID(Buffer.from(data));
      const multihash = decode(cid.multihash);
      if (multihash.name === "identity") {
        return `ipns://${UTF_8_DECODER.decode(multihash.digest).trim()}`;
      } else {
        return `ipns://${toB58String(cid.multihash)}`;
      }
    }
    default:
      throw new Error(`Unrecognized codec: ${codec}`);
  }
}
/**
 * Given a URI that may be ipfs, ipns, http, or https protocol, return the fetch-able http(s) URLs for the same content
 * @param uri to convert to fetch-able http url
 */
export function uriToHttp(uri: string): string[] {
  const protocol = uri.split(":")[0].toLowerCase();
  switch (protocol) {
    case "https":
      return [uri];
    case "http":
      return ["https" + uri.substr(4), uri];
    case "ipfs":
      const hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2];
      return [
        `https://cloudflare-ipfs.com/ipfs/${hash}/`,
        `https://ipfs.io/ipfs/${hash}/`,
      ];
    case "ipns":
      const name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2];
      return [
        `https://cloudflare-ipfs.com/ipns/${name}/`,
        `https://ipfs.io/ipns/${name}/`,
      ];
    default:
      return [];
  }
}
