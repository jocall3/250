export type StandardType = 'ERC721' | 'ERC1155';

export class TokenStandard {
  private readonly standard: StandardType;

  constructor(standard: StandardType) {
    this.standard = standard;
  }

  public getStandard(): StandardType {
    return this.standard;
  }

  public isERC721(): boolean {
    return this.standard === 'ERC721';
  }

  public isERC1155(): boolean {
    return this.standard === 'ERC1155';
  }

  public equals(other: TokenStandard): boolean {
    return this.standard === other.getStandard();
  }
}