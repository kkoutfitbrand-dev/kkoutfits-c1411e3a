-- Add minimum quantity requirement to combo_products
ALTER TABLE public.combo_products 
ADD COLUMN min_quantity integer NOT NULL DEFAULT 1;