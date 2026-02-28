import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TickerItem {
  id: string;
  text: string;
  emoji: string | null;
  is_active: boolean;
  display_order: number;
}

export default function AdminSettings() {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState('');
  const [newEmoji, setNewEmoji] = useState('');
  const [saving, setSaving] = useState(false);
  const [tickerSpeed, setTickerSpeed] = useState(8);
  const [speedSaving, setSpeedSaving] = useState(false);

  const db = supabase as any;

  const fetchItems = async () => {
    const { data, error } = await db
      .from('promo_ticker_items')
      .select('*')
      .order('display_order', { ascending: true });
    if (!error) setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const addItem = async () => {
    if (!newText.trim()) return;
    setSaving(true);
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.display_order)) + 1 : 0;
    const { error } = await db
      .from('promo_ticker_items')
      .insert({ text: newText.trim(), emoji: newEmoji.trim() || null, display_order: maxOrder });
    if (error) { toast.error('Failed to add item'); }
    else { toast.success('Item added'); setNewText(''); setNewEmoji(''); fetchItems(); }
    setSaving(false);
  };

  const deleteItem = async (id: string) => {
    const { error } = await db.from('promo_ticker_items').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Deleted'); fetchItems(); }
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await db.from('promo_ticker_items').update({ is_active: !current }).eq('id', id);
    if (!error) fetchItems();
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return;
    const a = items[index], b = items[swapIndex];
    await Promise.all([
      db.from('promo_ticker_items').update({ display_order: b.display_order }).eq('id', a.id),
      db.from('promo_ticker_items').update({ display_order: a.display_order }).eq('id', b.id),
    ]);
    fetchItems();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your admin settings</p>
        </div>

        {/* Promo Ticker Management */}
        <Card>
          <CardHeader>
            <CardTitle>Promo Ticker Banner</CardTitle>
            <CardDescription>Manage the scrolling promotional banner at the top of the site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add new item */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Label htmlFor="ticker-text">Message</Label>
                <Input id="ticker-text" value={newText} onChange={e => setNewText(e.target.value)} placeholder="e.g. FAST DELIVERY" />
              </div>
              <div className="w-24">
                <Label htmlFor="ticker-emoji">Emoji</Label>
                <Input id="ticker-emoji" value={newEmoji} onChange={e => setNewEmoji(e.target.value)} placeholder="🚚" />
              </div>
              <Button onClick={addItem} disabled={saving || !newText.trim()} size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>

            {/* Items table */}
            {loading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : items.length === 0 ? (
              <p className="text-muted-foreground text-sm">No ticker items yet. Default messages will be shown.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Emoji</TableHead>
                    <TableHead>Text</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, idx) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.emoji || '—'}</TableCell>
                      <TableCell className="font-medium">{item.text}</TableCell>
                      <TableCell>
                        <Switch checked={item.is_active} onCheckedChange={() => toggleActive(item.id, item.is_active)} />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => moveItem(idx, 'up')} disabled={idx === 0}>
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => moveItem(idx, 'down')} disabled={idx === items.length - 1}>
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure your store settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Settings coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
