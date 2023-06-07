import fetch from "node-fetch";
import AbortController from "abort-controller";
import { sha256 } from "js-sha256";
import { fetchBeacon, HttpChainClient, HttpCachingChain } from "drand-client";

global.fetch = fetch;
global.AbortController = AbortController;

const chainHash =
  "8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce"; // (hex encoded)
const publicKey =
  "868f005eb8e6e4ca0a47c8a77ceaa5309a47978a7c71bc5cce96366b5d7a569937c529eeda66c7293784a9402801af31"; // (hex encoded)

export class RandomNumber {
  async beacon() {
    const options = {
      disableBeaconVerification: false,
      noCache: false,
      chainVerificationParams: { chainHash, publicKey },
    };

    const chain = new HttpCachingChain("https://api.drand.sh", options);
    const client = new HttpChainClient(chain, options);
    return await fetchBeacon(client);
  }

  toBigInt(n) {
    return BigInt("0x" + n);
  }

  async setup(_bits = 256) {
    this.bits = _bits;
    this.hash = this.toBigInt((await this.beacon()).randomness);
    this.cnt = 0n;
  }

  rand() {
    const seed = this.hash + this.cnt;
    const hash = this.toBigInt(sha256(seed.toString()));
    this.cnt += 1n;
    return 1n + (hash % (1n << BigInt(this.bits)));
  }
}
