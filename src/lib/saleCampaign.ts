export interface SaleCampaign {
  id: string;
  name: string;
  enabled: boolean;
  discount_percentage: number;
  title: string;
  subtitle: string;
  promotional_text: string;
  start_at: string;
  end_at: string;
  banner_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export type SaleCampaignStatus = 'draft' | 'scheduled' | 'live' | 'ended';

export const getSaleCampaignStatus = (campaign: Pick<SaleCampaign, 'enabled' | 'start_at' | 'end_at'>): SaleCampaignStatus => {
  if (!campaign.enabled) return 'draft';
  const now = Date.now();
  if (new Date(campaign.start_at).getTime() > now) return 'scheduled';
  if (new Date(campaign.end_at).getTime() < now) return 'ended';
  return 'live';
};

export const toDateTimeLocal = (value: string) => {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
};

export const fromDateTimeLocal = (value: string) => new Date(value).toISOString();