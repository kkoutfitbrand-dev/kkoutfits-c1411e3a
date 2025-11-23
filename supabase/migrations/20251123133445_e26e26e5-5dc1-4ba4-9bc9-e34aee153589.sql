-- Create categories table with subcategory support
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view active categories
CREATE POLICY "Anyone can view active categories"
ON public.categories
FOR SELECT
USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert categories
CREATE POLICY "Admins can insert categories"
ON public.categories
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update categories
CREATE POLICY "Admins can update categories"
ON public.categories
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete categories
CREATE POLICY "Admins can delete categories"
ON public.categories
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Insert initial categories
INSERT INTO public.categories (name, slug, parent_id, display_order) VALUES
  ('Shirts', 'shirts', NULL, 1),
  ('Pants and Shorts', 'pants-shorts', NULL, 2),
  ('T-shirt', 't-shirt', NULL, 3),
  ('Sarees', 'sarees', NULL, 4),
  ('Chudithar', 'chudithar', NULL, 5);

-- Insert subcategories for Shirts
INSERT INTO public.categories (name, slug, parent_id, display_order) VALUES
  ('Formal Shirts', 'formal-shirts', (SELECT id FROM public.categories WHERE slug = 'shirts'), 1),
  ('Casual Shirts', 'casual-shirts', (SELECT id FROM public.categories WHERE slug = 'shirts'), 2),
  ('Party Wear Shirts', 'party-wear-shirts', (SELECT id FROM public.categories WHERE slug = 'shirts'), 3);