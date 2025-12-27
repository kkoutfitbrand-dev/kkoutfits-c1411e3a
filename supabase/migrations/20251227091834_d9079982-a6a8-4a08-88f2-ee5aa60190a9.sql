-- Create combo_products table
CREATE TABLE public.combo_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  original_price_cents INTEGER NOT NULL,
  combo_price_cents INTEGER NOT NULL,
  discount_percentage INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create combo_product_items table for color variants in each combo
CREATE TABLE public.combo_product_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  combo_id UUID REFERENCES public.combo_products(id) ON DELETE CASCADE NOT NULL,
  color_name TEXT NOT NULL,
  color_code TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.combo_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combo_product_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for combo_products
CREATE POLICY "Anyone can view published combos"
ON public.combo_products
FOR SELECT
USING ((status = 'published') OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert combos"
ON public.combo_products
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update combos"
ON public.combo_products
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete combos"
ON public.combo_products
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for combo_product_items
CREATE POLICY "Anyone can view combo items for published combos"
ON public.combo_product_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.combo_products
    WHERE combo_products.id = combo_product_items.combo_id
    AND (combo_products.status = 'published' OR has_role(auth.uid(), 'admin'::app_role))
  )
);

CREATE POLICY "Admins can insert combo items"
ON public.combo_product_items
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update combo items"
ON public.combo_product_items
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete combo items"
ON public.combo_product_items
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_combo_products_updated_at
BEFORE UPDATE ON public.combo_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();