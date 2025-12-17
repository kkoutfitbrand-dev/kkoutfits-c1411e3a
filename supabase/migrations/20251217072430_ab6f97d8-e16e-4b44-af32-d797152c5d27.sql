-- Add category column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category text;

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);