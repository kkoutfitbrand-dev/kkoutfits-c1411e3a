import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useSaleCampaign } from '@/hooks/useSaleCampaign';
import { getSaleTheme, type SaleThemePreset } from '@/lib/saleThemes';

interface SaleThemeContextValue {
  theme: SaleThemePreset;
  themeId: string;
  loading: boolean;
}

const SaleThemeContext = createContext<SaleThemeContextValue | null>(null);

export const SaleThemeProvider = ({ children }: { children: ReactNode }) => {
  const { campaign, loading } = useSaleCampaign();
  const theme = getSaleTheme(campaign?.theme_id);
  const themeId = campaign?.theme_id || 'standard';

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const themeVariables: Record<string, string> = {
      '--campaign-primary': theme.colors.primary,
      '--campaign-secondary': theme.colors.secondary,
      '--campaign-accent': theme.colors.accent,
      '--campaign-accent-foreground': theme.colors.accentForeground,
      '--campaign-on-primary': theme.colors.onPrimary,
      '--campaign-ink': theme.colors.ink,
      '--campaign-surface': theme.colors.surface,
      '--accent': theme.colors.accent,
      '--accent-foreground': theme.colors.accentForeground,
      '--secondary': theme.colors.secondary,
      '--secondary-foreground': theme.colors.accentForeground,
      '--ring': theme.colors.accent,
      '--luxury-burgundy': theme.colors.primary,
      '--luxury-gold': theme.colors.accent,
    };

    if (!campaign) {
      body.removeAttribute('data-sale-theme');
      Object.keys(themeVariables).forEach((key) => root.style.removeProperty(key));
      return;
    }

    Object.entries(themeVariables).forEach(([key, value]) => root.style.setProperty(key, value));
    body.setAttribute('data-sale-theme', theme.id);
    return () => {
      body.removeAttribute('data-sale-theme');
      Object.keys(themeVariables).forEach((key) => root.style.removeProperty(key));
    };
  }, [campaign, theme]);

  return <SaleThemeContext.Provider value={{ theme, themeId, loading }}>{children}</SaleThemeContext.Provider>;
};

export const useSaleTheme = () => useContext(SaleThemeContext);