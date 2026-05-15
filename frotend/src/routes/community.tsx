import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquare, ThumbsUp, Send, Users, Clock, Plus, Flame, Hash } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
  }
];

const TRENDING_TAGS = ["Maize", "Market & Sales", "Irish Potato", "Irrigation", "Pest Control"];

function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      author: "You (Guest Farmer)",
      title: newTitle.trim(),
      content: newContent.trim(),
      timestamp: "Just now",
      tag: "General",
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

  const filteredPosts = selectedTag ? posts.filter(p => p.tag === selectedTag) : posts;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      
      <motion.main 
        className="container mx-auto px-4 py-8 md:py-12 max-w-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-border/50">
          <div>
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Users className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground md:text-5xl tracking-tight mb-3">Farmer Community</h1>
            <p className="text-lg text-muted-foreground">
              Connect with thousands of farmers across Rwanda. Share tips, ask questions, and learn from agricultural experts.
            </p>
          </div>
          {!isPosting && (
            <Button onClick={() => setIsPosting(true)} size="lg" className="gap-2 rounded-full font-bold px-8 shadow-md hover:shadow-lg transition-all">
              <Plus className="h-5 w-5" /> Ask a Question
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
          
          {/* Main Feed */}
          <div className="space-y-6">
            
            {/* New Post Form */}
            <AnimatePresence>
              {isPosting && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  className="rounded-3xl border border-primary/30 bg-card p-6 md:p-8 shadow-lg relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-green-400"></div>
                  <h2 className="text-xl font-bold mb-6 text-foreground">Post a New Question</h2>
                  <form onSubmit={handleCreatePost} className="space-y-5">
                    <div>
                      <input
                        type="text"
                        placeholder="Question Title (e.g., Best time to plant tomatoes?)"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full rounded-xl border border-input bg-background/50 px-5 py-3.5 text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="Provide more details about your question..."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="w-full min-h-[140px] rounded-xl border border-input bg-background/50 px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y transition-all"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <Button type="button" variant="ghost" onClick={() => setIsPosting(false)} className="rounded-full px-6">
                        Cancel
                      </Button>
                      <Button type="submit" className="rounded-full px-8 shadow-md">Post Question</Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Posts List */}
            <div className="space-y-6">
              {filteredPosts.map((post, i) => (
                <motion.article 
                  key={post.id} 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="rounded-3xl border border-border/50 bg-card shadow-sm transition-all hover:border-primary/30 hover:shadow-md overflow-hidden group"
                >
                  <div className="p-6 md:p-8 cursor-pointer" onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-base font-extrabold text-secondary-foreground shadow-sm">
                          {post.author.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-foreground">{post.author}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground mt-1">
                            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {post.timestamp}</span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-primary">
                              {post.tag}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Hot badge for posts with >20 likes */}
                      {post.likes > 20 && (
                        <div className="hidden md:flex items-center gap-1.5 text-xs font-bold text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full">
                          <Flame className="h-3.5 w-3.5" /> Hot Topic
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-5">
                      <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{post.title}</h2>
                      <p className="text-base leading-relaxed text-muted-foreground">{post.content}</p>
                    </div>

                    <div className="mt-6 flex items-center gap-6 pt-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
                        className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors bg-secondary/50 hover:bg-primary/10 px-4 py-2 rounded-full"
                      >
                        <ThumbsUp className="h-4 w-4" /> {post.likes}
                      </button>
                      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground px-2">
                        <MessageSquare className="h-4 w-4" /> {post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Replies Section */}
                  <AnimatePresence>
                    {expandedPost === post.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-border/50 bg-muted/30 p-6 md:p-8"
                      >
                        <h4 className="text-sm font-bold mb-5 uppercase tracking-wider text-muted-foreground">Discussion ({post.replies.length})</h4>
                        
                        {post.replies.length > 0 ? (
                          <div className="space-y-5 mb-8">
                            {post.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-background border border-border/50 text-sm font-bold text-foreground shadow-sm">
                                  {reply.author.charAt(0)}
                                </div>
                                <div className="flex-1 rounded-2xl bg-background border border-border/50 p-4 px-5 shadow-sm">
                                  <div className="flex items-baseline justify-between mb-2">
                                    <span className="text-sm font-bold text-foreground">{reply.author}</span>
                                    <span className="text-xs font-medium text-muted-foreground">{reply.timestamp}</span>
                                  </div>
                                  <p className="text-sm text-foreground leading-relaxed">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mb-8 italic bg-background p-4 rounded-xl border border-border/50 text-center">No replies yet. Be the first to answer this question!</p>
                        )}

                        <form onSubmit={(e) => handleReply(post.id, e)} className="relative flex items-center">
                          <input
                            type="text"
                            placeholder="Write a helpful reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="w-full rounded-full border border-input bg-background px-6 py-4 pr-16 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground shadow-sm"
                          />
                          <Button
                            type="submit"
                            size="icon"
                            disabled={!replyContent.trim()}
                            className="absolute right-2 h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
                          >
                            <Send className="h-4 w-4 ml-0.5" />
                          </Button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              ))}
              
              {filteredPosts.length === 0 && (
                <div className="text-center p-12 bg-card rounded-3xl border border-border/50">
                  <Hash className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-lg font-bold">No posts found</h3>
                  <p className="text-muted-foreground mt-2">There are no discussions for this specific topic yet.</p>
                  <Button variant="link" onClick={() => setSelectedTag(null)} className="mt-2">View all posts</Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 hidden lg:block sticky top-24">
            <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Flame className="h-5 w-5 text-orange-500" />
                <h3 className="text-lg font-bold text-foreground">Trending Topics</h3>
              </div>
              <div className="space-y-2">
                {TRENDING_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      selectedTag === tag 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2"><Hash className="h-4 w-4 opacity-50" /> {tag}</span>
                  </button>
                ))}
              </div>
              {selectedTag && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedTag(null)}
                  className="w-full mt-4 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear filter
                </Button>
              )}
            </div>

            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 shadow-sm text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Join the Conversation</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Help other farmers by sharing your expertise and experiences.
              </p>
              <Button onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsPosting(true);
              }} className="w-full rounded-full shadow-sm">
                Write a Post
              </Button>
            </div>
          </aside>
          
        </div>
      </motion.main>
      
      <SiteFooter />
    </div>
  );
}
