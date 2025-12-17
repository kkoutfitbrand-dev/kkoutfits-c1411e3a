-- Insert main category options
INSERT INTO public.categories (name, slug, description, display_order, is_active) VALUES
('Men', 'men', 'Men''s clothing and accessories', 0, true),
('Women', 'women', 'Women''s clothing and accessories', 0, true),
('Casual', 'casual', 'Casual wear for everyday style', 0, true),
('Formal', 'formal', 'Formal and office wear', 0, true)
ON CONFLICT (slug) DO NOTHING;