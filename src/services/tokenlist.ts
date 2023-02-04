interface TokenInfo {
  readonly chainId: number;
  readonly address: string;
  readonly name: string;
  readonly decimals: number;
  readonly symbol: string;
  readonly logoURI?: string;
  readonly tags?: string[];
  readonly extensions?: {
    readonly [key: string]: string | number | boolean | null;
  };
}

interface TokenList {
  readonly name: string;
  readonly timestamp: string;
  readonly tokens: TokenInfo[];
  readonly keywords?: string[];
  readonly logoURI?: string;
}

const DEFAULT_LIST =
  'https://raw.githubusercontent.com/balancer-labs/assets/master/generated/listed.tokenlist.json';

class Service {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async get(): Promise<TokenList> {
    const response = await fetch(this.url);
    const list = await response.json();
    return list;
  }
}

export default Service;
export { DEFAULT_LIST, TokenList, TokenInfo };
