import { IPFSLink } from "./IPFSLink";

export interface MetadataAttribute {
  trait_type: string;
  value: string | number | boolean;
  display_type?: string;
}

export class TokenMetadata {
  private readonly name: string;
  private readonly description: string;
  private readonly image: IPFSLink;
  private readonly animationUrl?: IPFSLink;
  private readonly attributes: MetadataAttribute[];

  constructor(
    name: string,
    description: string,
    image: IPFSLink,
    attributes: MetadataAttribute[],
    animationUrl?: IPFSLink
  ) {
    if (!name || name.trim().length === 0) {
      throw new Error("Metadata name cannot be empty");
    }
    this.name = name;
    this.description = description;
    this.image = image;
    this.attributes = [...attributes];
    this.animationUrl = animationUrl;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getImage(): IPFSLink {
    return this.image;
  }

  public getAnimationUrl(): IPFSLink | undefined {
    return this.animationUrl;
  }

  public getAttributes(): MetadataAttribute[] {
    return [...this.attributes];
  }

  public toJSON(): Record<string, any> {
    return {
      name: this.name,
      description: this.description,
      image: this.image.getUri(),
      animation_url: this.animationUrl?.getUri(),
      attributes: this.attributes,
    };
  }
}