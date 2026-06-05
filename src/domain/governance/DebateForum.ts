export interface DebatePost {
  postId: string;
  authorAddress: string;
  content: string;
  timestamp: Date;
  verifiedBillSerial?: string;
  upvotes: number;
}

export class DebateForum {
  constructor(
    public readonly forumId: string,
    public readonly proposalId: string,
    public readonly posts: DebatePost[] = []
  ) {
    if (!forumId || !proposalId) {
      throw new Error("DebateForum requires a valid Forum ID and Proposal ID.");
    }
  }

  public addPost(authorAddress: string, content: string, verifiedBillSerial?: string): DebatePost {
    if (!content || content.trim().length === 0) {
      throw new Error("Post content cannot be empty.");
    }
    const newPost: DebatePost = {
      postId: `${this.forumId}-post-${this.posts.length + 1}`,
      authorAddress,
      content,
      timestamp: new Date(),
      verifiedBillSerial,
      upvotes: 0
    };
    this.posts.push(newPost);
    return newPost;
  }

  public upvotePost(postId: string): void {
    const post = this.posts.find(p => p.postId === postId);
    if (!post) {
      throw new Error("Post not found.");
    }
    post.upvotes += 1;
  }
}