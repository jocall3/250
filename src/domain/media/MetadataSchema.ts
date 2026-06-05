export class MetadataSchema {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly tags: string[],
    public readonly creationDate: Date,
    public readonly creator: string,
    public readonly version: string
  ) {}

  public toJSON(): Record<string, any> {
    return {
      title: this.title,
      description: this.description,
      tags: this.tags,
      creationDate: this.creationDate.toISOString(),
      creator: this.creator,
      version: this.version
    };
  }

  public hasTag(tag: string): boolean {
    return this.tags.includes(tag);
  }
}
