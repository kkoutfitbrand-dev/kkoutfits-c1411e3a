import { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Pencil, Plus, Tag, Trash2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getSaleCampaignStatus, fromDateTimeLocal, toDateTimeLocal, type SaleCampaign, type SaleCampaignStatus } from '@/lib/saleCampaign';
import defaultBanner from '@/assets/big-sale-banner.jpg';

type CampaignForm = Omit<SaleCampaign, 'id' | 'created_at' | 'updated_at'>;

const emptyForm = (): CampaignForm => ({
  name: 'Big Sale', enabled: true, discount_percentage: 50,
  title: 'Big Sale — Big Style', subtitle: 'Fresh fashion, standout prices, and easy everyday dressing.',
  promotional_text: 'Your next favorite look is waiting. Shop the Big Sale before it ends.',
  start_at: new Date(Date.now() - 86400000).toISOString(), end_at: new Date(Date.now() + 30 * 86400000).toISOString(),
  banner_image_url: null,
});

const statusStyles: Record<SaleCampaignStatus, string> = {
  draft: 'bg-muted text-muted-foreground', scheduled: 'bg-secondary text-secondary-foreground',
  live: 'bg-accent/15 text-accent-foreground', ended: 'bg-destructive/10 text-destructive',
};

const AdminSales = () => {
  const [campaigns, setCampaigns] = useState<SaleCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SaleCampaign | null>(null);
  const [form, setForm] = useState<CampaignForm>(emptyForm());

  const db = supabase as any;

  const fetchCampaigns = async () => {
    const { data, error } = await db.from('sale_campaigns').select('*').order('created_at', { ascending: false });
    if (error) toast.error('Failed to load sale campaigns');
    else setCampaigns(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setDialogOpen(true); };
  const openEdit = (campaign: SaleCampaign) => {
    setEditing(campaign);
    setForm({ ...campaign, start_at: toDateTimeLocal(campaign.start_at), end_at: toDateTimeLocal(campaign.end_at) });
    setDialogOpen(true);
  };

  const setField = <K extends keyof CampaignForm>(key: K, value: CampaignForm[K]) => setForm(current => ({ ...current, [key]: value }));

  const uploadImage = async (file: File) => {
    const extension = file.name.split('.').pop() || 'jpg';
    const path = `campaigns/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    setField('banner_image_url', data.publicUrl);
  };

  const saveCampaign = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.title.trim() || !form.subtitle.trim() || !form.promotional_text.trim()) {
      toast.error('Complete all campaign text fields'); return;
    }
    if (form.discount_percentage < 0 || form.discount_percentage > 100) { toast.error('Discount must be between 0 and 100'); return; }
    if (new Date(form.end_at).getTime() <= new Date(form.start_at).getTime()) { toast.error('End date must be after the start date'); return; }
    setSaving(true);
    try {
      const payload = { ...form, name: form.name.trim(), title: form.title.trim(), subtitle: form.subtitle.trim(), promotional_text: form.promotional_text.trim(), start_at: fromDateTimeLocal(form.start_at), end_at: fromDateTimeLocal(form.end_at) };
      const result = editing ? await db.from('sale_campaigns').update(payload).eq('id', editing.id) : await db.from('sale_campaigns').insert(payload);
      if (result.error) throw result.error;
      toast.success(editing ? 'Sale campaign updated' : 'Sale campaign created');
      setDialogOpen(false); await fetchCampaigns();
    } catch (error) { console.error(error); toast.error('Could not save the sale campaign'); }
    finally { setSaving(false); }
  };

  const toggleCampaign = async (campaign: SaleCampaign) => {
    const { error } = await db.from('sale_campaigns').update({ enabled: !campaign.enabled }).eq('id', campaign.id);
    if (error) toast.error('Could not update campaign status'); else { toast.success(campaign.enabled ? 'Campaign disabled' : 'Campaign enabled'); fetchCampaigns(); }
  };

  const deleteCampaign = async (campaign: SaleCampaign) => {
    if (!window.confirm(`Delete ${campaign.name}?`)) return;
    const { error } = await db.from('sale_campaigns').delete().eq('id', campaign.id);
    if (error) toast.error('Could not delete campaign'); else { toast.success('Campaign deleted'); fetchCampaigns(); }
  };

  const liveCampaign = useMemo(() => campaigns.find(campaign => getSaleCampaignStatus(campaign) === 'live'), [campaigns]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div><h1 className="text-3xl font-bold">Sales</h1><p className="text-muted-foreground">Create and publish reusable sale campaigns.</p></div>
          <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />New campaign</Button>
        </div>
        {liveCampaign && <Card className="border-accent/30 bg-accent/5"><CardContent className="flex items-center gap-3 p-4 text-sm"><Tag className="h-4 w-4 text-accent" /><span><strong>{liveCampaign.name}</strong> is currently live on the storefront.</span></CardContent></Card>}
        {loading ? <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div> : campaigns.length === 0 ? <Card><CardContent className="py-16 text-center"><Tag className="mx-auto mb-4 h-10 w-10 text-muted-foreground" /><p className="text-muted-foreground">No sale campaigns yet.</p></CardContent></Card> : <div className="grid gap-4 lg:grid-cols-2">{campaigns.map(campaign => {
          const status = getSaleCampaignStatus(campaign);
          return <Card key={campaign.id} className="overflow-hidden"><div className="aspect-[3/1] bg-muted"><img src={campaign.banner_image_url || defaultBanner} alt="" className="h-full w-full object-cover" /></div><CardHeader className="pb-3"><div className="flex items-start justify-between gap-3"><div><CardTitle>{campaign.name}</CardTitle><CardDescription className="mt-1">{campaign.title}</CardDescription></div><Badge className={statusStyles[status]}>{status}</Badge></div></CardHeader><CardContent className="space-y-4"><p className="line-clamp-2 text-sm text-muted-foreground">{campaign.promotional_text}</p><div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground"><div><span className="block font-medium text-foreground">Discount</span>Up to {campaign.discount_percentage}%</div><div><span className="block font-medium text-foreground">Schedule</span>{new Date(campaign.start_at).toLocaleDateString()} – {new Date(campaign.end_at).toLocaleDateString()}</div></div><div className="flex items-center justify-between border-t pt-4"><div className="flex items-center gap-2 text-sm"><Switch checked={campaign.enabled} onCheckedChange={() => toggleCampaign(campaign)} /><span>{campaign.enabled ? 'Enabled' : 'Disabled'}</span></div><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(campaign)} title="Edit campaign"><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => deleteCampaign(campaign)} title="Delete campaign"><Trash2 className="h-4 w-4 text-destructive" /></Button></div></div></CardContent></Card>;
        })}</div>}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{editing ? 'Edit sale campaign' : 'Create sale campaign'}</DialogTitle><DialogDescription>Changes publish to the storefront after saving.</DialogDescription></DialogHeader><form onSubmit={saveCampaign} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="sale-name">Sale name</Label><Input id="sale-name" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Big Sale" /></div><div className="space-y-2"><Label htmlFor="sale-discount">Messaging percentage</Label><Input id="sale-discount" type="number" min="0" max="100" value={form.discount_percentage} onChange={e => setField('discount_percentage', Number(e.target.value))} /></div></div>
        <div className="space-y-2"><Label htmlFor="sale-title">Sale title</Label><Input id="sale-title" value={form.title} onChange={e => setField('title', e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="sale-subtitle">Subtitle</Label><Textarea id="sale-subtitle" value={form.subtitle} onChange={e => setField('subtitle', e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="sale-promo">Promotional text</Label><Textarea id="sale-promo" value={form.promotional_text} onChange={e => setField('promotional_text', e.target.value)} /></div>
        <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="sale-start">Starts</Label><Input id="sale-start" type="datetime-local" value={toDateTimeLocal(form.start_at)} onChange={e => setField('start_at', e.target.value)} /></div><div className="space-y-2"><Label htmlFor="sale-end">Ends</Label><Input id="sale-end" type="datetime-local" value={toDateTimeLocal(form.end_at)} onChange={e => setField('end_at', e.target.value)} /></div></div>
        <div className="space-y-2"><Label htmlFor="sale-image">Banner image</Label><div className="flex flex-wrap items-center gap-3"><Input id="sale-image" type="file" accept="image/*" className="max-w-sm" onChange={async e => { const file = e.target.files?.[0]; if (!file) return; try { await uploadImage(file); toast.success('Image uploaded'); } catch { toast.error('Image upload failed'); } }} /><Button type="button" variant="outline" onClick={() => setField('banner_image_url', null)}><Upload className="mr-2 h-4 w-4" />Use default artwork</Button></div>{form.banner_image_url && <p className="text-xs text-muted-foreground">Custom banner selected.</p>}</div>
        <div className="flex items-center justify-between border-t pt-4"><div><Label>Enabled</Label><p className="text-xs text-muted-foreground">Only enabled campaigns inside their date window appear publicly.</p></div><Switch checked={form.enabled} onCheckedChange={value => setField('enabled', value)} /></div>
        <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save campaign</Button></div>
      </form></DialogContent></Dialog>
    </AdminLayout>
  );
};

export default AdminSales;