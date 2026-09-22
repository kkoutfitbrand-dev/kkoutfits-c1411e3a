import campaignDiwali from '@/assets/campaign-diwali.jpg';
import campaignPongal from '@/assets/campaign-pongal.jpg';
import campaignHoli from '@/assets/campaign-holi.jpg';
import campaignEid from '@/assets/campaign-eid.jpg';
import campaignNavratri from '@/assets/campaign-navratri.jpg';
import campaignIndependence from '@/assets/campaign-independence.jpg';
import campaignEvening from '@/assets/campaign-evening.jpg';
import campaignClearance from '@/assets/campaign-clearance.jpg';
import campaignBlackFriday from '@/assets/campaign-blackfriday.jpg';
import campaignNewYear from '@/assets/campaign-newyear.jpg';

export type SaleThemeId =
  | 'diwali'
  | 'pongal'
  | 'holi'
  | 'eid'
  | 'onam'
  | 'navratri'
  | 'independence-day'
  | 'big-sale'
  | 'end-of-season'
  | 'clearance'
  | 'black-friday'
  | 'new-year';

export type SaleParticle = 'glow' | 'confetti' | 'stars';

export interface SaleThemePreset {
  id: SaleThemeId;
  name: string;
  group: 'Indian festivals' | 'Retail events';
  title: string;
  subtitle: string;
  promotionalText: string;
  discountPercentage: number;
  motif: string;
  label: string;
  /** Realistic photography banner used across hero and promo placements. */
  heroImage: string;
  /** Ambient particle animation style for themed sections. */
  particle: SaleParticle;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    accentForeground: string;
    onPrimary: string;
    ink: string;
    surface: string;
  };
}

export const SALE_THEME_PRESETS: SaleThemePreset[] = [
  {
    id: 'diwali', name: 'Diwali Sale', group: 'Indian festivals', title: 'Diwali — Light Up Your Style',
    subtitle: 'Festive fashion, radiant details, and celebration-ready looks.',
    promotionalText: 'Celebrate the season of lights with special prices across the store.', discountPercentage: 50,
    motif: '✦', label: 'Festival of lights',
    heroImage: campaignDiwali, particle: 'glow',
    colors: { primary: '345 72% 22%', secondary: '28 82% 38%', accent: '43 96% 56%', accentForeground: '345 72% 12%', onPrimary: '40 40% 96%', ink: '345 72% 12%', surface: '40 40% 94%' },
  },
  {
    id: 'pongal', name: 'Pongal Sale', group: 'Indian festivals', title: 'Pongal — Dress for New Beginnings',
    subtitle: 'Warm colours and joyful everyday styles for the harvest celebration.',
    promotionalText: 'Welcome abundance with fresh looks for every family gathering.', discountPercentage: 40,
    motif: '✺', label: 'Harvest celebration',
    heroImage: campaignPongal, particle: 'glow',
    colors: { primary: '25 75% 28%', secondary: '43 78% 42%', accent: '12 82% 54%', accentForeground: '25 75% 14%', onPrimary: '40 40% 97%', ink: '25 75% 14%', surface: '45 70% 94%' },
  },
  {
    id: 'holi', name: 'Holi Sale', group: 'Indian festivals', title: 'Holi — Colour Your Wardrobe',
    subtitle: 'Bright layers, playful prints, and feel-good festival dressing.',
    promotionalText: 'Bring more colour to your style with vibrant seasonal favourites.', discountPercentage: 45,
    motif: '●', label: 'Festival of colour',
    heroImage: campaignHoli, particle: 'confetti',
    colors: { primary: '331 68% 35%', secondary: '191 70% 35%', accent: '47 96% 55%', accentForeground: '331 68% 15%', onPrimary: '0 0% 98%', ink: '331 68% 15%', surface: '330 55% 96%' },
  },
  {
    id: 'eid', name: 'Eid Edit', group: 'Indian festivals', title: 'Eid Edit — Made for Moments',
    subtitle: 'Elegant silhouettes and polished details for every celebration.',
    promotionalText: 'Find graceful occasion wear and thoughtful gifts for the season.', discountPercentage: 35,
    motif: '☾', label: 'Celebration edit',
    heroImage: campaignEid, particle: 'stars',
    colors: { primary: '166 48% 22%', secondary: '151 50% 32%', accent: '43 79% 55%', accentForeground: '166 48% 12%', onPrimary: '45 50% 97%', ink: '166 48% 12%', surface: '156 35% 94%' },
  },
  {
    id: 'onam', name: 'Onam Collection', group: 'Indian festivals', title: 'Onam — A Season of Grace',
    subtitle: 'Classic textures and modern fits for a beautifully dressed celebration.',
    promotionalText: 'Step into the festivities with effortless, occasion-ready style.', discountPercentage: 30,
    motif: '✿', label: 'Festive collection',
    heroImage: campaignPongal, particle: 'glow',
    colors: { primary: '146 42% 24%', secondary: '42 54% 37%', accent: '43 83% 60%', accentForeground: '146 42% 12%', onPrimary: '45 45% 97%', ink: '146 42% 12%', surface: '45 42% 94%' },
  },
  {
    id: 'navratri', name: 'Navratri Sale', group: 'Indian festivals', title: 'Navratri — Nine Nights, One Signature Style',
    subtitle: 'Statement colour, movement, and festive energy in every look.',
    promotionalText: 'Get celebration-ready with expressive styles made to move.', discountPercentage: 45,
    motif: '✧', label: 'Nine nights of style',
    heroImage: campaignNavratri, particle: 'glow',
    colors: { primary: '270 48% 30%', secondary: '342 65% 36%', accent: '34 92% 55%', accentForeground: '270 48% 13%', onPrimary: '0 0% 98%', ink: '270 48% 13%', surface: '270 35% 96%' },
  },
  {
    id: 'independence-day', name: 'Independence Day', group: 'Indian festivals', title: 'Independence Day — Wear Your Spirit',
    subtitle: 'A confident edit of timeless essentials and occasion-ready layers.',
    promotionalText: 'Celebrate your everyday freedom with a wardrobe that feels like you.', discountPercentage: 35,
    motif: '✦', label: 'Proudly yours',
    heroImage: campaignIndependence, particle: 'confetti',
    colors: { primary: '205 66% 28%', secondary: '150 54% 30%', accent: '18 83% 55%', accentForeground: '205 66% 12%', onPrimary: '0 0% 98%', ink: '205 66% 12%', surface: '205 38% 95%' },
  },
  {
    id: 'big-sale', name: 'Big Sale', group: 'Retail events', title: 'Big Sale — Big Style',
    subtitle: 'Fresh fashion, standout prices, and easy everyday dressing.',
    promotionalText: 'Your next favourite look is waiting. Shop the Big Sale before it ends.', discountPercentage: 50,
    motif: '✦', label: 'Limited-time offer',
    heroImage: campaignEvening, particle: 'stars',
    colors: { primary: '210 75% 22%', secondary: '28 82% 38%', accent: '28 100% 54%', accentForeground: '0 0% 100%', onPrimary: '0 0% 98%', ink: '210 75% 12%', surface: '210 40% 95%' },
  },
  {
    id: 'end-of-season', name: 'End of Season', group: 'Retail events', title: 'End of Season — Last Looks',
    subtitle: 'Final chances to take home the pieces everyone has been wearing.',
    promotionalText: 'Make room for what is next with exceptional prices on selected styles.', discountPercentage: 60,
    motif: '↘', label: 'Final markdowns',
    heroImage: campaignClearance, particle: 'glow',
    colors: { primary: '198 47% 24%', secondary: '185 48% 34%', accent: '171 55% 47%', accentForeground: '198 47% 12%', onPrimary: '0 0% 98%', ink: '198 47% 12%', surface: '195 38% 95%' },
  },
  {
    id: 'clearance', name: 'Clearance Sale', group: 'Retail events', title: 'Clearance — Find Your Next Favourite',
    subtitle: 'Limited quantities, easy prices, and plenty of room for personal style.',
    promotionalText: 'Once they are gone, they are gone. Shop the final selection now.', discountPercentage: 70,
    motif: '!', label: 'Limited quantities',
    heroImage: campaignClearance, particle: 'stars',
    colors: { primary: '12 64% 30%', secondary: '4 69% 38%', accent: '46 93% 55%', accentForeground: '12 64% 12%', onPrimary: '0 0% 98%', ink: '12 64% 12%', surface: '12 42% 95%' },
  },
  {
    id: 'black-friday', name: 'Black Friday', group: 'Retail events', title: 'Black Friday — The Big Drop',
    subtitle: 'High-impact style and can’t-miss prices for a limited time.',
    promotionalText: 'The biggest picks of the season are moving fast. Shop before the drop ends.', discountPercentage: 60,
    motif: '◆', label: 'The big drop',
    heroImage: campaignBlackFriday, particle: 'stars',
    colors: { primary: '0 0% 10%', secondary: '0 0% 24%', accent: '43 96% 56%', accentForeground: '0 0% 8%', onPrimary: '0 0% 98%', ink: '0 0% 8%', surface: '0 0% 94%' },
  },
  {
    id: 'new-year', name: 'New Year Sale', group: 'Retail events', title: 'New Year — Start in Style',
    subtitle: 'A fresh edit for fresh plans, new memories, and your next chapter.',
    promotionalText: 'Step into the new year with a look that feels unmistakably yours.', discountPercentage: 50,
    motif: '✧', label: 'Fresh start',
    heroImage: campaignNewYear, particle: 'stars',
    colors: { primary: '229 48% 31%', secondary: '267 47% 38%', accent: '43 90% 58%', accentForeground: '229 48% 12%', onPrimary: '0 0% 98%', ink: '229 48% 12%', surface: '229 38% 96%' },
  },
];

export const DEFAULT_SALE_THEME_ID: SaleThemeId = 'big-sale';

export const getSaleTheme = (id?: string | null): SaleThemePreset =>
  SALE_THEME_PRESETS.find((theme) => theme.id === id) ?? SALE_THEME_PRESETS.find((theme) => theme.id === DEFAULT_SALE_THEME_ID) ?? SALE_THEME_PRESETS[0];
