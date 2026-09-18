CREATE TABLE public.sale_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  enabled boolean NOT NULL DEFAULT false,
  discount_percentage integer NOT NULL DEFAULT 0,
  title text NOT NULL,
  subtitle text NOT NULL,
  promotional_text text NOT NULL,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  banner_image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.sale_campaigns TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sale_campaigns TO authenticated;
GRANT ALL ON public.sale_campaigns TO service_role;

ALTER TABLE public.sale_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active sale campaigns"
  ON public.sale_campaigns
  FOR SELECT
  TO anon, authenticated
  USING (
    enabled = true
    AND start_at <= now()
    AND end_at >= now()
  );

CREATE POLICY "Admins can view all sale campaigns"
  ON public.sale_campaigns
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can create sale campaigns"
  ON public.sale_campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update sale campaigns"
  ON public.sale_campaigns
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete sale campaigns"
  ON public.sale_campaigns
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX sale_campaigns_active_window_idx
  ON public.sale_campaigns (enabled, start_at, end_at);

CREATE TRIGGER update_sale_campaigns_updated_at
  BEFORE UPDATE ON public.sale_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

INSERT INTO public.sale_campaigns (
  name,
  enabled,
  discount_percentage,
  title,
  subtitle,
  promotional_text,
  start_at,
  end_at,
  banner_image_url
)
VALUES (
  'Big Sale',
  true,
  50,
  'Big Sale — Big Style',
  'Fresh fashion, standout prices, and easy everyday dressing.',
  'Your next favorite look is waiting. Shop the Big Sale before it ends.',
  now() - interval '1 day',
  now() + interval '30 days',
  NULL
);