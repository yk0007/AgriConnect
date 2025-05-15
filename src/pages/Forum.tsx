import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  MoreHorizontal, 
  MessageSquare, 
  Heart, 
  Trash2, 
  Edit, 
  Users, 
  Loader2, 
  Share2,
  ThumbsUp,
  ThumbsDown,
  Image,
  Bookmark,
  Search
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  category_id: string;
  profile?: Profile | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  post_id: string;
  profile?: Profile | null;
}

const DEFAULT_CATEGORY_ID = "00000000-0000-0000-0000-000000000000";

const Forum = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categoryId, setCategoryId] = useState<string>(DEFAULT_CATEGORY_ID);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeSort, setActiveSort] = useState<string>("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const getFirstCategoryId = async () => {
      try {
        const { data, error } = await supabase
          .from('forum_categories')
          .select('id, name');
          
        if (data && data.length > 0) {
          setCategoryId(data[0].id);
          setCategories(data);
        } else {
          createDefaultCategory();
        }
      } catch (error) {
        console.error("Error getting category:", error);
        createDefaultCategory();
      }
    };
    
    getFirstCategoryId();
    fetchPosts();

    const channel = supabase
      .channel('public:forum_posts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'forum_posts' },
        (payload) => {
          console.log('Change received!', payload)
          fetchPosts();
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createDefaultCategory = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_categories')
        .insert({
          name: 'General Discussion',
          description: 'General farming discussions'
        })
        .select()
        .single();
        
      if (data && data.id) {
        setCategoryId(data.id);
        setCategories([{id: data.id, name: data.name}]);
      }
    } catch (error) {
      console.error("Error creating default category:", error);
    }
  };

  const fetchPosts = async (sortBy = activeSort, category = activeTab) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('forum_posts')
        .select(`
          id,
          title,
          content,
          created_at,
          user_id,
          category_id
        `);
        
      // Filter by category if not "all"
      if (category !== "all") {
        query = query.eq('category_id', category);
      }
      
      // Apply search term if exists
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }
        
      // Apply sorting
      if (sortBy === "recent") {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === "popular") {
        query = query.order('views', { ascending: false });
      }
      
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (data) {
        // Fetch profile data separately for each post
        const postsWithProfiles = await Promise.all(data.map(async (post) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, avatar_url')
            .eq('id', post.user_id)
            .single();
          
          return {
            ...post,
            profile: profileData || null
          };
        }));
        
        setPosts(postsWithProfiles);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (sortBy: string) => {
    setActiveSort(sortBy);
    fetchPosts(sortBy, activeTab);
  };

  const handleTabChange = (category: string) => {
    setActiveTab(category);
    fetchPosts(activeSort, category);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(activeSort, activeTab);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Community Forum
          </h1>
          <p className="text-muted-foreground">Share knowledge, ask questions, and connect with farmers</p>
        </div>
        {user && (
          <Button className="bg-primary hover:bg-primary/90">
            <Edit className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        )}
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search posts..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <div className="flex space-x-2 shrink-0">
            <Button 
              variant={activeSort === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange("recent")}
              className="shrink-0"
            >
              Latest
            </Button>
            <Button 
              variant={activeSort === "popular" ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange("popular")}
              className="shrink-0"
            >
              Popular
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="h-9 bg-muted/60">
              <TabsTrigger value="all" className="text-xs sm:text-sm rounded-md">
                All Topics
              </TabsTrigger>
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id} 
                  className="text-xs sm:text-sm rounded-md"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      </div>
      
      {user && <NewPostForm onPostCreated={fetchPosts} categoryId={categoryId} />}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <Card className="p-8 text-center bg-white dark:bg-gray-900/60">
              <div className="flex flex-col items-center gap-2">
                <Users className="h-10 w-10 text-muted-foreground" />
                <h3 className="text-lg font-medium">No posts found</h3>
                <p className="text-muted-foreground">Be the first to share your thoughts!</p>
                {user && (
                  <Button className="mt-4">
                    <Edit className="h-4 w-4 mr-2" />
                    Create a New Post
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            posts.map((post) => (
              <ForumPost key={post.id} post={post} onPostDeleted={fetchPosts} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

interface ForumPostProps {
  post: Post;
  onPostDeleted: () => void;
}

const ForumPost = ({ post, onPostDeleted }: ForumPostProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
  const [voteCount, setVoteCount] = useState<number>(Math.floor(Math.random() * 50)); // Simulating votes
  const [bookmarked, setBookmarked] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load post image based on content
  const getPostImage = () => {
    const images = [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
      'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
      'https://images.unsplash.com/photo-1500673922987-e212871fec22',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3',
      'https://images.unsplash.com/photo-1560493676-04071c5f467b',
      'https://images.unsplash.com/photo-1472289065668-ce650ac443d2',
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8'
    ];
    
    // Use post.id to deterministically select an image
    const charSum = post.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return images[charSum % images.length];
  };

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('forum_comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          post_id
        `)
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        // Fetch profile data separately for each comment
        const commentsWithProfiles = await Promise.all(data.map(async (comment) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, avatar_url')
            .eq('id', comment.user_id)
            .single();
          
          return {
            ...comment,
            profile: profileData || null
          };
        }));
        
        setComments(commentsWithProfiles);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoadingComments(false);
    }
  };

  const handleDeletePost = async () => {
    if (!user || user.id !== post.user_id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You are not authorized to delete this post.",
      });
      return;
    }

    try {
      await supabase.from('forum_posts').delete().eq('id', post.id);
      toast({
        title: "Post deleted",
        description: "The post has been successfully deleted.",
      });
      onPostDeleted(); // Refresh posts
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleVote = (direction: 'up' | 'down') => {
    if (voteStatus === direction) {
      // Removing vote
      setVoteStatus(null);
      setVoteCount(prevCount => direction === 'up' ? prevCount - 1 : prevCount + 1);
    } else {
      // Changing vote
      setVoteStatus(direction);
      setVoteCount(prevCount => {
        let newCount = prevCount;
        // Remove previous vote if exists
        if (voteStatus === 'up' && direction === 'down') newCount -= 1;
        if (voteStatus === 'down' && direction === 'up') newCount += 1;
        // Add new vote
        if (direction === 'up') newCount += 1;
        if (direction === 'down') newCount -= 1;
        return newCount;
      });
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h`;
    } else if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)}d`;
    } else {
      return postDate.toLocaleDateString();
    }
  };

  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-900/60 transition-all hover:shadow-md">
      <div className="flex flex-col">
        {/* Post Header */}
        <div className="flex items-start p-4 gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.profile?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback>{post.profile?.first_name?.[0] || 'U'}{post.profile?.last_name?.[0] || ''}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold truncate">
                  {post.profile?.first_name || 'Anonymous'} {post.profile?.last_name || ''}
                </span>
                <span className="text-xs text-muted-foreground">
                  • {formatTimeAgo(post.created_at)}
                </span>
              </div>
              {user && user.id === post.user_id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={handleDeletePost} className="text-red-500">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <h3 className="font-bold text-lg mt-1">{post.title}</h3>
            <p className="text-sm mt-2 line-clamp-3">{post.content}</p>
          </div>
        </div>

        {/* Remove the Post Image section */}

        {/* Post Actions */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm"
              className={`px-3 ${voteStatus === 'up' ? 'text-primary font-medium' : ''}`} 
              onClick={() => handleVote('up')}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              {voteCount}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={voteStatus === 'down' ? 'text-destructive font-medium' : ''}
              onClick={() => handleVote('down')}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              {comments.length > 0 ? comments.length : 'Comment'}
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={bookmarked ? 'text-yellow-500' : ''}
              onClick={() => setBookmarked(!bookmarked)}
            >
              <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-yellow-500' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="border-t border-gray-100 dark:border-gray-800 bg-muted/20">
            <NewCommentForm postId={post.id} onCommentCreated={fetchComments} />
            {loadingComments ? (
              <div className="px-4 pb-4 flex justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <div className="space-y-0 px-4 pb-4">
                {comments.length === 0 ? (
                  <div className="py-4 text-center text-muted-foreground text-sm">
                    No comments yet. Be the first to comment!
                  </div>
                ) : (
                  comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

interface CommentItemProps {
  comment: Comment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h`;
    } else if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)}d`;
    } else {
      return commentDate.toLocaleDateString();
    }
  };

  return (
    <div className="flex items-start space-x-3 py-3 border-t border-gray-100 dark:border-gray-800">
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.profile?.avatar_url || "/placeholder.svg"} />
        <AvatarFallback>{comment.profile?.first_name?.[0] || 'U'}{comment.profile?.last_name?.[0] || ''}</AvatarFallback>
      </Avatar>
      <div className="space-y-1 flex-1">
        <div className="flex items-center space-x-2">
          <div className="font-semibold text-sm">{comment.profile?.first_name || 'Anonymous User'}</div>
          <div className="text-xs text-muted-foreground">{formatTimeAgo(comment.created_at)}</div>
        </div>
        <div className="text-sm">{comment.content}</div>
        <div className="flex items-center space-x-2 pt-1">
          <Button variant="ghost" size="sm" className="h-7 px-2.5 text-xs">
            <Heart className="h-3 w-3 mr-1" />
            Like
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2.5 text-xs">
            <MessageSquare className="h-3 w-3 mr-1" />
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
};

interface NewCommentFormProps {
  postId: string;
  onCommentCreated: () => void;
}

const NewCommentForm = ({ postId, onCommentCreated }: NewCommentFormProps) => {
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to comment.",
      });
      return;
    }

    if (!commentText.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('forum_comments').insert({
        content: commentText,
        post_id: postId,
        user_id: user.id,
      });

      if (error) {
        throw error;
      }

      setCommentText("");
      onCommentCreated(); // Refresh comments
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">
          <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to leave a comment
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 flex items-start space-x-3">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={user.user_metadata.avatar_url || "/placeholder.svg"} />
        <AvatarFallback>
          {user.user_metadata.first_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="relative flex-1">
        <Textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="min-h-[60px] pr-20 resize-none"
        />
        <div className="absolute right-2 bottom-2 flex items-center space-x-1">
          <Button type="button" size="icon" variant="ghost" className="h-7 w-7">
            <Image className="h-4 w-4" />
          </Button>
          <Button 
            type="submit" 
            size="sm" 
            disabled={loading || !commentText.trim()} 
            className="h-7 px-3"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Post"}
          </Button>
        </div>
      </div>
    </form>
  );
};

interface NewPostFormProps {
  onPostCreated: () => void;
  categoryId: string;
}

const NewPostForm = ({ onPostCreated, categoryId }: NewPostFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to create a post.",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: newPost, error } = await supabase
        .from('forum_posts')
        .insert({
          title: title,
          content: content,
          user_id: user.id,
          category_id: categoryId
        })
        .select();

      if (error) {
        throw error;
      }

      if (newPost) {
        setTitle("");
        setContent("");
        onPostCreated(); // Refresh posts
        toast({
          title: "Post created",
          description: "Your post has been successfully created.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-900/60 mb-6 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="font-semibold flex items-center gap-2">
          <Edit className="h-4 w-4 text-primary" />
          Create a New Post
        </h3>
      </div>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">Title</Label>
            <Input
              id="title"
              placeholder="An interesting title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">Content</Label>
            <Textarea
              id="content"
              placeholder="Share your farming knowledge, questions, or experiences..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] focus:ring-primary resize-none"
              required
            />
          </div>
          <div className="flex justify-between items-center pt-2">
            <Button type="button" variant="outline" size="sm" className="text-sm">
              <Image className="h-4 w-4 mr-2" />
              Add Image
            </Button>
            <Button type="submit" disabled={loading} className="text-sm">
              {loading ? 
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Posting...</> : 
                <>Publish Post</>
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default Forum;
