export class IPFSLink {
  private readonly uri: string;

  constructor(uri: string) {
    if (!IPFSLink.isValid(uri)) {
      throw new Error(`Invalid IPFS URI: ${uri}`);
    }
    this.uri = uri;
  }

  public static isValid(uri: string): boolean {
    return /^ipfs:\/\/(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]{55})$/.test(uri);
  }

  public getUri(): string {
    return this.uri;
  }

  public getHttpGatewayUrl(gateway: string = "https://ipfs.io/ipfs/"): string {
    const cid = this.uri.replace("ipfs://", "");
    return `${gateway}${cid}`;
  }

  public equals(other: IPFSLink): boolean {
    return this.uri === other.getUri();
  }
}