-- Add size columns to combo_products table
ALTER TABLE public.combo_products
ADD COLUMN size_type text DEFAULT 'free',
ADD COLUMN available_sizes jsonb DEFAULT '[]'::jsonb;