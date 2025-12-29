-- Add category fields to combo_products table
ALTER TABLE public.combo_products 
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS subcategories JSONB DEFAULT '[]'::jsonb;