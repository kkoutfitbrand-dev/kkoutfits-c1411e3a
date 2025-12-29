import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FloatingCartPreview } from '@/components/FloatingCartPreview';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ShoppingCart, Check, Package, ArrowLeft, Sparkles, PartyPopper } from 'lucide-react';
interface ComboProduct {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  original_price_cents: number;
  combo_price_cents: number;
  discount_percentage: number;
  min_quantity: number;
  size_type: string;
  available_sizes: string[];
}
interface ComboCartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
  is_combo: true;
  combo_id: string;
  selected_size: string;
  combo_items: Array<{
    color_name: string;
    quantity: number;
    image_url: string;
  }>;
}
interface ComboItem {
  id: string;
  color_name: string;
  color_code: string;
  image_url: string;
}
interface SelectedColor {
  item: ComboItem;
  quantity: number;
}
const ComboDetail = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const [combo, setCombo] = useState<ComboProduct | null>(null);
  const [items, setItems] = useState<ComboItem[]>([]);
  const [selectedColors, setSelectedColors] = useState<SelectedColor[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [cartPreviewItem, setCartPreviewItem] = useState<{name: string; image: string; price: number; details?: string} | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  useEffect(() => {
    if (id) fetchComboDetails();
  }, [id]);
  const fetchComboDetails = async () => {
    try {
      const {
        data: comboData,
        error: comboError
      } = await supabase.from('combo_products').select('*').eq('id', id).maybeSingle();
      if (comboError) throw comboError;
      if (!comboData) {
        navigate('/combo');
        return;
      }
      const formattedCombo: ComboProduct = {
        ...comboData,
        images: Array.isArray(comboData.images) ? comboData.images as string[] : [],
        size_type: comboData.size_type || 'free',
        available_sizes: Array.isArray(comboData.available_sizes) ? comboData.available_sizes as string[] : ['Free Size']
      };
      setCombo(formattedCombo);
      setMainImage(formattedCombo.images[0] || '');
      // Set default size if available
      if (formattedCombo.available_sizes.length > 0) {
        setSelectedSize(formattedCombo.available_sizes[0]);
      }
      const {
        data: itemsData,
        error: itemsError
      } = await supabase.from('combo_product_items').select('*').eq('combo_id', id);
      if (itemsError) throw itemsError;
      setItems(itemsData || []);
    } catch (error) {
      console.error('Error fetching combo:', error);
      toast.error('Failed to load combo details');
    } finally {
      setLoading(false);
    }
  };
  const getTotalQuantity = () => selectedColors.reduce((sum, sc) => sum + sc.quantity, 0);
  const toggleColorSelection = (item: ComboItem) => {
    const existing = selectedColors.find(sc => sc.item.id === item.id);
    if (existing) {
      setSelectedColors(selectedColors.filter(sc => sc.item.id !== item.id));
    } else {
      setSelectedColors([...selectedColors, {
        item,
        quantity: 1
      }]);
    }
    if (item.image_url) setMainImage(item.image_url);
  };
  const updateQuantity = (itemId: string, delta: number) => {
    setSelectedColors(selectedColors.map(sc => {
      if (sc.item.id === itemId) {
        const newQty = Math.max(1, sc.quantity + delta);
        return {
          ...sc,
          quantity: newQty
        };
      }
      return sc;
    }));
  };
  const getTotalPrice = () => {
    if (!combo) return 0;
    const totalQty = getTotalQuantity();
    if (totalQty < combo.min_quantity) return 0;
    return combo.combo_price_cents / 100;
  };
  const getOriginalTotal = () => {
    if (!combo) return 0;
    return combo.original_price_cents / 100;
  };
  const isComboComplete = () => {
    if (!combo) return false;
    return getTotalQuantity() === combo.min_quantity;
  };
  const getRemainingCount = () => {
    if (!combo) return 0;
    return Math.max(0, combo.min_quantity - getTotalQuantity());
  };
  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/auth');
      return;
    }
    if (!isComboComplete()) {
      toast.error(`Please select exactly ${combo?.min_quantity} items to get this combo offer`);
      return;
    }
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    setAddingToCart(true);
    try {
      // Get current cart
      const {
        data: cartData
      } = await supabase.from('carts').select('items').eq('user_id', user.id).maybeSingle();
      const currentItems = Array.isArray(cartData?.items) ? cartData.items : [];

      // Build combo item details string for display
      const colorsList = selectedColors.map(sc => `${sc.item.color_name}${sc.quantity > 1 ? ` ×${sc.quantity}` : ''}`).join(', ');

      // Add combo as a SINGLE cart item with the bundle price
      const comboCartItem: ComboCartItem = {
        id: `combo-${combo!.id}-${Date.now()}`,
        name: combo!.name,
        price: combo!.combo_price_cents / 100,
        image: selectedColors[0]?.item.image_url || combo!.images[0] || '',
        quantity: 1,
        size: `${combo!.min_quantity} items`,
        color: colorsList,
        is_combo: true,
        combo_id: combo!.id,
        selected_size: selectedSize,
        combo_items: selectedColors.map(sc => ({
          color_name: sc.item.color_name,
          quantity: sc.quantity,
          image_url: sc.item.image_url || ''
        }))
      };
      const updatedItems = [...currentItems, comboCartItem];
      const {
        error
      } = await supabase.from('carts').upsert({
        user_id: user.id,
        items: JSON.parse(JSON.stringify(updatedItems))
      } as any, {
        onConflict: 'user_id'
      });
      if (error) throw error;
      
      // Show success animation
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2500);
      
      // Show floating cart preview
      const previewColorsList = selectedColors.map(sc => sc.item.color_name).join(', ');
      setCartPreviewItem({
        name: combo!.name,
        image: selectedColors[0]?.item.image_url || combo!.images[0] || '',
        price: combo!.combo_price_cents / 100,
        details: `${combo!.min_quantity} items: ${previewColorsList}`
      });
      setShowCartPreview(true);
      setTimeout(() => {
        setShowCartPreview(false);
      }, 5000);
      
      toast.success('Combo added to cart!', {
        icon: <PartyPopper className="h-4 w-4 text-green-500" />,
      });
      setSelectedColors([]);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>;
  }
  if (!combo) return null;
  return <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/combo')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Combos
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              {mainImage ? <img src={mainImage} alt={combo.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-24 w-24 text-muted-foreground" />
                </div>}
            </div>
            {combo.images.length > 1 && <div className="flex gap-2 overflow-x-auto pb-2">
                {combo.images.map((img, i) => <button key={i} onClick={() => setMainImage(img)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${mainImage === img ? 'border-primary' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>)}
              </div>}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              {combo.discount_percentage > 0 && <Badge className="mb-3 bg-destructive text-destructive-foreground">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {combo.discount_percentage}% OFF
                </Badge>}
              <h1 className="text-3xl font-bold mb-2">{combo.name}</h1>
              <p className="text-muted-foreground">{combo.description}</p>
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                ₹{(combo.combo_price_cents / 100).toLocaleString()}
              </span>
              {combo.original_price_cents > combo.combo_price_cents && <>
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{(combo.original_price_cents / 100).toLocaleString()}
                  </span>
                  <Badge variant="secondary">
                    Save ₹{((combo.original_price_cents - combo.combo_price_cents) / 100).toLocaleString()}
                  </Badge>
                </>}
            </div>

            {/* Color Selection */}
            {items.length > 0 && <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Select {combo.min_quantity} Colors</h3>
                    <Badge variant={isComboComplete() ? "default" : "secondary"}>
                      {getTotalQuantity()}/{combo.min_quantity} selected
                    </Badge>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${isComboComplete() ? 'bg-green-500' : 'bg-primary'}`} style={{
                    width: `${Math.min(100, getTotalQuantity() / combo.min_quantity * 100)}%`
                  }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      {isComboComplete() ? '✓ Your combo is complete!' : `Select ${getRemainingCount()} more item${getRemainingCount() > 1 ? 's' : ''}`}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {items.map((item) => {
                      const isSelected = selectedColors.some((sc) => sc.item.id === item.id);
                      const selectedItem = selectedColors.find((sc) => sc.item.id === item.id);

                      return (
                        <div
                          key={item.id}
                          className={`relative border rounded-lg p-3 cursor-pointer transition-all ${
                            isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50"
                          }`}
                          onClick={() => toggleColorSelection(item)}
                        >
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}

                          <div className="flex items-center gap-3">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.color_name}
                                className="w-12 h-12 rounded object-cover"
                              />
                            ) : (
                              <div
                                className="w-12 h-12 rounded border"
                                style={{ backgroundColor: item.color_code }}
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.color_name}</p>
                              <div
                                className="w-4 h-4 rounded-full border mt-1"
                                style={{ backgroundColor: item.color_code }}
                              />
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>}

            {/* Size Selection */}
            {combo.available_sizes && combo.available_sizes.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Select Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {combo.available_sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedSize(size)}
                        className="min-w-[60px]"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selection Summary */}
            {selectedColors.length > 0 && <Card className="bg-muted/50">
                
              </Card>}

            {/* Add to Cart */}
            <div className="relative">
              <AnimatePresence>
                {showSuccess && (
                  <>
                    {/* Flying cart icons */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ 
                          opacity: 1, 
                          scale: 0.5,
                          x: 0,
                          y: 0
                        }}
                        animate={{ 
                          opacity: 0, 
                          scale: 1.5,
                          x: (i % 2 === 0 ? -1 : 1) * (50 + Math.random() * 100),
                          y: -100 - Math.random() * 100,
                          rotate: (i % 2 === 0 ? -1 : 1) * 45
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ 
                          duration: 0.8, 
                          delay: i * 0.1,
                          ease: "easeOut"
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                      >
                        <Sparkles className="h-5 w-5 text-primary" />
                      </motion.div>
                    ))}
                    
                    {/* Success overlay */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-green-500 rounded-lg flex items-center justify-center gap-2 z-20"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                      >
                        <Check className="h-6 w-6 text-white" />
                      </motion.div>
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white font-semibold"
                      >
                        Added to Cart!
                      </motion.span>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
              
              <Button 
                size="lg" 
                className={`w-full transition-all duration-300 ${isComboComplete() ? 'bg-green-600 hover:bg-green-700' : ''}`} 
                onClick={handleAddToCart} 
                disabled={addingToCart || !isComboComplete()}
              >
                {addingToCart ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <ShoppingCart className="h-5 w-5 mr-2" />
                )}
                {addingToCart ? 'Adding...' : !isComboComplete() ? `Select ${getRemainingCount()} more to unlock combo` : `Add Combo to Cart - ₹${getTotalPrice().toLocaleString()}`}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <FloatingCartPreview
        isVisible={showCartPreview}
        onClose={() => setShowCartPreview(false)}
        item={cartPreviewItem}
      />

      <Footer />
    </div>;
};
export default ComboDetail;