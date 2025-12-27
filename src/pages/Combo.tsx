import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Package, Sparkles } from 'lucide-react';

interface ComboProduct {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  original_price_cents: number;
  combo_price_cents: number;
  discount_percentage: number;
}

interface ComboItem {
  id: string;
  color_name: string;
  color_code: string;
  image_url: string;
}

const Combo = () => {
  const [combos, setCombos] = useState<(ComboProduct & { items: ComboItem[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    try {
      const { data: combosData, error: combosError } = await supabase
        .from('combo_products')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (combosError) throw combosError;

      const combosWithItems = await Promise.all(
        (combosData || []).map(async (combo) => {
          const { data: items } = await supabase
            .from('combo_product_items')
            .select('*')
            .eq('combo_id', combo.id);

          return {
            ...combo,
            images: Array.isArray(combo.images) ? combo.images as string[] : [],
            items: items || [],
          };
        })
      );

      setCombos(combosWithItems);
    } catch (error) {
      console.error('Error fetching combos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJ2LTJoMnYyem0wLTEwaC0ydjJoMnYtMnptLTEwIDBoLTJ2Mmgydi0yem0wIDEwaC0ydjJoMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="container px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              <Sparkles className="h-3 w-3 mr-1" />
              EXCLUSIVE OFFERS
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Combo Offers
            </h1>
            <p className="text-lg text-muted-foreground">
              Mix & match your favorite colors and save big with our exclusive combo deals
            </p>
          </div>
        </div>
      </section>

      {/* Combos Grid */}
      <section className="container px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-[4/3]" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : combos.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Combo Offers Available</h2>
            <p className="text-muted-foreground mb-6">
              Check back soon for exciting combo deals!
            </p>
            <Button asChild>
              <Link to="/shop">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {combos.map(combo => (
              <Link key={combo.id} to={`/combo/${combo.id}`}>
                <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    {combo.images[0] ? (
                      <img 
                        src={combo.images[0]} 
                        alt={combo.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Package className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    {combo.discount_percentage > 0 && (
                      <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-lg px-3 py-1">
                        {combo.discount_percentage}% OFF
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {combo.name}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {combo.description || 'Exclusive combo offer with multiple color options'}
                    </p>
                    
                    {/* Color swatches */}
                    {combo.items.length > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-muted-foreground">Colors:</span>
                        <div className="flex -space-x-1">
                          {combo.items.slice(0, 5).map((item, i) => (
                            <div
                              key={item.id}
                              className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
                              style={{ backgroundColor: item.color_code }}
                              title={item.color_name}
                            />
                          ))}
                          {combo.items.length > 5 && (
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                              +{combo.items.length - 5}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">
                          ₹{(combo.combo_price_cents / 100).toLocaleString()}
                        </span>
                        {combo.original_price_cents > combo.combo_price_cents && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{(combo.original_price_cents / 100).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <Button size="sm">View Combo</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Combo;
