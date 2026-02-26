
-- Create promo_ticker_items table
CREATE TABLE public.promo_ticker_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  emoji TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.promo_ticker_items ENABLE ROW LEVEL SECURITY;

-- Anyone can read active items
CREATE POLICY "Anyone can view active ticker items"
ON public.promo_ticker_items
FOR SELECT
USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert
CREATE POLICY "Admins can insert ticker items"
ON public.promo_ticker_items
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update
CREATE POLICY "Admins can update ticker items"
ON public.promo_ticker_items
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete
CREATE POLICY "Admins can delete ticker items"
ON public.promo_ticker_items
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Updated_at trigger
CREATE TRIGGER update_promo_ticker_items_updated_at
  BEFORE UPDATE ON public.promo_ticker_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
