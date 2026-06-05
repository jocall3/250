import { DigitalTwin } from "./DigitalTwin";
import { WalletAddress } from "./WalletAddress";

export interface BridgeEvent {
  sourceChainId: number;
  targetChainId: number;
  tokenAddress: WalletAddress;
  tokenId: string;
  sender: WalletAddress;
  recipient: WalletAddress;
  bridgeTxHash: string;
  timestamp: Date;
}

export class CrossChainBridge {
  private readonly supportedChainIds: Set<number>;

  constructor(supportedChainIds: number[]) {
    this.supportedChainIds = new Set(supportedChainIds);
  }

  public isChainSupported(chainId: number): boolean {
    return this.supportedChainIds.has(chainId);
  }

  public initiateBridge(
    digitalTwin: DigitalTwin,
    targetChainId: number,
    recipient: WalletAddress,
    bridgeTxHash: string
  ): BridgeEvent {
    if (!this.isChainSupported(targetChainId)) {
      throw new Error(`Target chain ID ${targetChainId} is not supported by this bridge`);
    }

    if (digitalTwin.getChainId() === targetChainId) {
      throw new Error("Source and target chain IDs cannot be the same");
    }

    if (digitalTwin.isBurned()) {
      throw new Error("Cannot bridge a burned digital twin");
    }

    const event: BridgeEvent = {
      sourceChainId: digitalTwin.getChainId(),
      targetChainId,
      tokenAddress: digitalTwin.getContractAddress(),
      tokenId: digitalTwin.getTokenId(),
      sender: digitalTwin.getOwner(),
      recipient,
      bridgeTxHash,
      timestamp: new Date(),
    };

    digitalTwin.lockForBridging();

    return event;
  }
}