import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const instagramPosts = [
  { id: 1, image: product1, likes: 1240 },
  { id: 2, image: product2, likes: 2180 },
  { id: 3, image: product3, likes: 956 },
  { id: 4, image: product4, likes: 1543 },
  { id: 5, image: product5, likes: 3201 },
  { id: 6, image: product6, likes: 1789 },
];

export const InstagramFeed = () => {
  return (
    <section className="bg-muted/20 py-12 md:py-16">
      <div className="container px-4">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Instagram className="h-6 w-6 text-pink-600" />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold">
              Follow Us on Instagram
            </h2>
          </div>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Get inspired by our community #KKOUTFIT
          </p>
          <Button variant="outline" size="lg" className="gap-2">
            <Instagram className="h-5 w-5" />
            Follow @kkoutfit
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href="#"
              className="group relative overflow-hidden rounded-lg aspect-square bg-muted"
            >
              <img
                src={post.image}
                alt={`Instagram post ${post.id}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white text-center">
                  <Instagram className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-semibold">{post.likes.toLocaleString()} likes</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
