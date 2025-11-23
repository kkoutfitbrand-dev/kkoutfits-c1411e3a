-- Create product_variants table for managing product variations
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  
  -- Variant options (e.g., Size: M, Color: Blue)
  option1_name TEXT,
  option1_value TEXT,
  option2_name TEXT,
  option2_value TEXT,
  option3_name TEXT,
  option3_value TEXT,
  
  -- Pricing and inventory per variant
  sku TEXT UNIQUE,
  barcode TEXT,
  price_cents INTEGER,
  compare_at_price_cents INTEGER,
  inventory_count INTEGER NOT NULL DEFAULT 0,
  
  -- Variant-specific images
  image_url TEXT,
  
  -- Status
  is_available BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Ensure at least one option is defined
  CONSTRAINT at_least_one_option CHECK (
    option1_name IS NOT NULL AND option1_value IS NOT NULL
  )
);

-- Create index for faster lookups
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON public.product_variants(sku) WHERE sku IS NOT NULL;

-- Enable RLS
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_variants
CREATE POLICY "Anyone can view available variants for published products"
  ON public.product_variants
  FOR SELECT
  USING (
    is_available = true 
    AND EXISTS (
      SELECT 1 FROM public.products 
      WHERE products.id = product_variants.product_id 
      AND products.status = 'published'
    )
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can insert variants"
  ON public.product_variants
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update variants"
  ON public.product_variants
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete variants"
  ON public.product_variants
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();