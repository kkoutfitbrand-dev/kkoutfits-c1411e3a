import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { SaleCampaign } from '@/lib/saleCampaign';

export interface SaleCountdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  status: 'scheduled' | 'live' | 'ended';
}

export const useSaleCampaign = () => {
  const [campaign, setCampaign] = useState<SaleCampaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchCampaign = async () => {
      const { data, error } = await (supabase as any)
        .from('sale_campaigns')
        .select('*')
        .eq('enabled', true)
        .lte('start_at', new Date().toISOString())
        .gte('end_at', new Date().toISOString())
        .order('start_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) console.error('Error fetching active sale campaign:', error);
      if (mounted) {
        setCampaign(data as SaleCampaign | null);
        setLoading(false);
      }
    };

    fetchCampaign();
    return () => { mounted = false; };
  }, []);

  return { campaign, loading };
};

export const useSaleCountdown = (campaign: SaleCampaign | null): SaleCountdown => {
  const calculate = (): SaleCountdown => {
    if (!campaign) return { days: 0, hours: 0, minutes: 0, seconds: 0, status: 'ended' };
    const now = Date.now();
    const start = new Date(campaign.start_at).getTime();
    const end = new Date(campaign.end_at).getTime();
    const target = now < start ? start : end;
    const diff = Math.max(0, target - now);
    const totalSeconds = Math.floor(diff / 1000);

    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      status: now < start ? 'scheduled' : now <= end ? 'live' : 'ended',
    };
  };

  const [countdown, setCountdown] = useState<SaleCountdown>(calculate);

  useEffect(() => {
    setCountdown(calculate());
    const interval = window.setInterval(() => setCountdown(calculate()), 1000);
    return () => window.clearInterval(interval);
  }, [campaign]);

  return countdown;
};