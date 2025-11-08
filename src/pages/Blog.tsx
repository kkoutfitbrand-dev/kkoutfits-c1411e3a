import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, User, Search } from "lucide-react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "The Ultimate Guide to Choosing Your Wedding Sherwani",
    excerpt: "Everything you need to know about selecting the perfect sherwani for your big day...",
    category: "Wedding",
    author: "Rajesh Kumar",
    date: "15 Nov 2024",
    image: "https://images.unsplash.com/photo-1583300239160-f8f19d86bd92?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    title: "Traditional vs Contemporary: Finding Your Style",
    excerpt: "Navigate the world of ethnic menswear with our style guide...",
    category: "Style Guide",
    author: "Priya Sharma",
    date: "12 Nov 2024",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    title: "How to Care for Your Silk Kurtas",
    excerpt: "Expert tips on maintaining the beauty and longevity of your silk garments...",
    category: "Care Guide",
    author: "Amit Patel",
    date: "10 Nov 2024",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    title: "Festival Fashion 2024: Top Trends",
    excerpt: "Discover the hottest trends in ethnic menswear for this festival season...",
    category: "Trends",
    author: "Vikram Singh",
    date: "8 Nov 2024",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=600&fit=crop",
  },
  {
    id: 5,
    title: "The Art of Draping: Bandhgala Styling Tips",
    excerpt: "Master the sophisticated look of Bandhgala jackets with our styling guide...",
    category: "Style Guide",
    author: "Karan Mehta",
    date: "5 Nov 2024",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=600&fit=crop",
  },
  {
    id: 6,
    title: "Understanding Fabric Quality: A Buyer's Guide",
    excerpt: "Learn how to identify premium fabrics and make informed purchasing decisions...",
    category: "Education",
    author: "Sneha Reddy",
    date: "3 Nov 2024",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=600&fit=crop",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-luxury-burgundy to-luxury-charcoal py-16 text-primary-foreground">
        <div className="container px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Style Guide & Blog</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Fashion tips, care guides, and everything you need to know about traditional menswear
          </p>
        </div>
      </section>

      <div className="container px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid sm:grid-cols-2 gap-6">
              {blogPosts.map(post => (
                <article key={post.id} className="bg-card border border-border rounded-lg overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-serif font-bold mb-3 group-hover:text-accent transition-colors">
                      <Link to={`/blog/${post.id}`}>{post.title}</Link>
                    </h2>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search articles..." className="pl-10" />
                </div>
              </div>

              {/* Categories */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                  {["Wedding", "Style Guide", "Care Guide", "Trends", "Education"].map(category => (
                    <button
                      key={category}
                      className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">Subscribe</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get style tips delivered to your inbox
                </p>
                <Input placeholder="Your email" className="mb-3" />
                <Button className="w-full">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
