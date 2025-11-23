-- Add status column to products table for draft support
ALTER TABLE public.products 
ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'));

-- Update RLS policy to allow admins to see draft products
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;

CREATE POLICY "Anyone can view published products"
ON public.products
FOR SELECT
USING (
  status = 'published' OR 
  (status IN ('draft', 'archived') AND has_role(auth.uid(), 'admin'::app_role))
);

-- Create index on status for better performance
CREATE INDEX idx_products_status ON public.products(status);