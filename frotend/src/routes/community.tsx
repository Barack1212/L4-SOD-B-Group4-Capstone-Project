import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquare, ThumbsUp, Send, Users, Clock, Plus } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/community")({
  component: CommunityPage,
  head: () => ({
    meta: [
      { title: "Community · Smart Farming Rwanda" },
      {
        name: "description",
        content: "Join the global community of farmers. Ask questions, share tips, and learn from experts.",
      },
    ],
  }),
});

type Reply = {
  id: string;
  author: string;
  content: string;
  timestamp: string;
};

type Post = {
  id: string;
  author: string;
  title: string;
  content: string;
  timestamp: string;
  tag: string;
  likes: number;
  replies: Reply[];
};

const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    author: "Jean Baptiste",
    title: "Best fertilizer for Maize in Northern Province?",
    content: "I'm planning to plant maize next month in Musanze. What fertilizer mix yields the best results given the soil acidity here? I usually use NPK 17-17-17 but looking for better alternatives.",
    timestamp: "2 hours ago",
    tag: "Maize",
    likes: 12,
    replies: [
      {
        id: "r1",
        author: "Agronomist Sarah",
        content: "For Musanze, NPK 17-17-17 is good for basal application, but you should definitely top-dress with Urea after 4 weeks. Also, consider adding agricultural lime if your pH is below 5.5.",
        timestamp: "1 hour ago",
      }
    ],
  },
  {
    id: "2",
    author: "Marie Claire",
    title: "Dealing with pests on Irish Potatoes",
    content: "My potato leaves are getting spots and some are curling up. Does anyone have an organic pest control method that works well during the rainy season?",
    timestamp: "5 hours ago",
    tag: "Irish Potato",
    likes: 8,
    replies: [],
  },
  {
    id: "3",
    author: "Emmanuel N.",
    title: "Market prices for Beans - Season A",
    content: "Is it better to sell beans immediately after harvest or store them for a few months? Trying to maximize profits this season.",
    timestamp: "1 day ago",
    tag: "Market & Sales",
    likes: 24,
    replies: [
      {
        id: "r2",
        author: "Trader Paul",
        content: "If you have proper storage (like PIC bags to prevent weevils), wait 2-3 months. Prices usually spike once the harvest surplus clears from the market.",
        timestamp: "20 hours ago",
      },
      {
        id: "r3",
        author: "Jean Baptiste",
        content: "I agree with Paul. Last year I sold immediately and missed out on a 30% price increase just 2 months later.",
        timestamp: "18 hours ago",
      }
    ],
  }
];

function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      author: "You (Guest Farmer)",
      title: newTitle.trim(),
      content: newContent.trim(),
      timestamp: "Just now",
      tag: "General Discussion",
      likes: 0,
      replies: [],
    };

    setPosts([post, ...posts]);
    setNewTitle("");
    setNewContent("");
    setIsPosting(false);
  }

  function handleReply(postId: string, e: React.FormEvent) {
    e.preventDefault();
    if (!replyContent.trim()) return;

    const reply: Reply = {
      id: Date.now().toString(),
      author: "You (Guest Farmer)",
      content: replyContent.trim(),
      timestamp: "Just now",
    };

    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, replies: [...p.replies, reply] };
      }
      return p;
    }));
    setReplyContent("");
  }

  function toggleLike(postId: string) {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Users className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold text-primary md:text-4xl">Community Forum</h1>
            <p className="mt-2 text-muted-foreground">
              Connect with farmers across Rwanda. Ask questions, share tips, and learn.
            </p>
          </div>
          {!isPosting && (
            <Button onClick={() => setIsPosting(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Ask a Question
            </Button>
          )}
        </div>

        {isPosting && (
          <div className="mb-8 rounded-2xl border border-border/50 bg-card p-5 md:p-6 shadow-sm" style={{ boxShadow: "var(--shadow-card)" }}>
            <h2 className="text-lg font-bold mb-4">Post a New Question</h2>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Question Title (e.g., Best time to plant tomatoes?)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="Provide more details about your question..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full min-h-[120px] rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsPosting(false)}>
                  Cancel
                </Button>
                <Button type="submit">Post Question</Button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-5">
          {posts.map((post) => (
            <article 
              key={post.id} 
              className="rounded-2xl border border-border/50 bg-card shadow-sm transition-all hover:border-primary/20"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="p-5 md:p-6 cursor-pointer" onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{post.author}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.timestamp}</span>
                        <span>•</span>
                        <span className="text-primary font-medium">{post.tag}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h2 className="text-lg font-bold text-foreground mb-2">{post.title}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{post.content}</p>
                </div>

                <div className="mt-5 flex items-center gap-6 border-t border-border/40 pt-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
                    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ThumbsUp className="h-4 w-4" /> {post.likes}
                  </button>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <MessageSquare className="h-4 w-4" /> {post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}
                  </div>
                </div>
              </div>

              {/* Expanded Replies Section */}
              {expandedPost === post.id && (
                <div className="border-t border-border/50 bg-muted/20 p-5 md:p-6 rounded-b-2xl">
                  <h4 className="text-sm font-bold mb-4">Discussion</h4>
                  
                  {post.replies.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                            {reply.author.charAt(0)}
                          </div>
                          <div className="flex-1 rounded-2xl bg-card border border-border/40 p-3.5 px-4">
                            <div className="flex items-baseline justify-between mb-1">
                              <span className="text-sm font-bold text-foreground">{reply.author}</span>
                              <span className="text-[11px] text-muted-foreground">{reply.timestamp}</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mb-6 italic">No replies yet. Be the first to answer!</p>
                  )}

                  <form onSubmit={(e) => handleReply(post.id, e)} className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="w-full rounded-full border border-input bg-card px-5 py-3 pr-14 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground shadow-sm"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!replyContent.trim()}
                      className="absolute right-1.5 h-9 w-9 rounded-full"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              )}
            </article>
          ))}
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
