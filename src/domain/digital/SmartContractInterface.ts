import { WalletAddress } from "./WalletAddress";
import { TokenStandard } from "./TokenStandard";

export class SmartContractInterface {
  private readonly address: WalletAddress;
  private readonly chainId: number;
  private readonly standard: TokenStandard;
  private readonly name: string;
  private readonly symbol: string;

  constructor(address: WalletAddress, chainId: number, standard: TokenStandard, name: string, symbol: string) {
    if (chainId <= 0) {
      throw new Error("Chain ID must be a positive integer");
    }
    this.address = address;
    this.chainId = chainId;
    this.standard = standard;
    this.name = name;
    this.symbol = symbol;
  }

  public getAddress(): WalletAddress {
    return this.address;
  }

  public getChainId(): number {
    return this.chainId;
  }

  public getStandard(): TokenStandard {
    return this.standard;
  }

  public getName(): string {
    return this.name;
  }

  public getSymbol(): string {
    return this.symbol;
  }
}