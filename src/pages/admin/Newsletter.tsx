
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, XCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

interface Subscriber {
  id: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}

const Newsletter = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });
      
      if (error) throw error;
      
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: language === 'en' 
          ? 'Failed to load subscribers' 
          : 'Fehler beim Laden der Abonnenten',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscriberStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setSubscribers(
        subscribers.map(subscriber => 
          subscriber.id === id 
            ? { ...subscriber, is_active: !currentStatus } 
            : subscriber
        )
      );
      
      toast({
        title: language === 'en' ? 'Success' : 'Erfolg',
        description: language === 'en' 
          ? 'Subscriber status updated' 
          : 'Abonnentenstatus aktualisiert',
      });
    } catch (error) {
      console.error('Error updating subscriber:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: language === 'en' 
          ? 'Failed to update subscriber' 
          : 'Fehler beim Aktualisieren des Abonnenten',
        variant: 'destructive',
      });
    }
  };

  const removeSubscriber = async (id: string) => {
    if (!confirm(language === 'en' 
      ? 'Are you sure you want to remove this subscriber?' 
      : 'Sind Sie sicher, dass Sie diesen Abonnenten entfernen möchten?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setSubscribers(subscribers.filter(subscriber => subscriber.id !== id));
      
      toast({
        title: language === 'en' ? 'Success' : 'Erfolg',
        description: language === 'en' 
          ? 'Subscriber removed successfully' 
          : 'Abonnent erfolgreich entfernt',
      });
    } catch (error) {
      console.error('Error removing subscriber:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: language === 'en' 
          ? 'Failed to remove subscriber' 
          : 'Fehler beim Entfernen des Abonnenten',
        variant: 'destructive',
      });
    }
  };

  const exportSubscribersCSV = () => {
    // Create CSV content
    const headers = ['Email', 'Status', 'Subscribed Date'];
    
    const csvContent = [
      headers.join(','),
      ...subscribers.map(s => 
        [
          s.email,
          s.is_active ? 'Active' : 'Inactive',
          new Date(s.subscribed_at).toLocaleDateString()
        ].join(',')
      )
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: language === 'en' ? 'Success' : 'Erfolg',
      description: language === 'en' 
        ? 'Subscriber list exported successfully' 
        : 'Abonnentenliste erfolgreich exportiert',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'Newsletter Management' : 'Newsletter-Verwaltung'}
        </h1>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-16" />
          ))}
        </div>
      </div>
    );
  }

  const activeSubscribers = subscribers.filter(s => s.is_active).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {language === 'en' ? 'Newsletter Management' : 'Newsletter-Verwaltung'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' 
              ? `${activeSubscribers} active subscribers out of ${subscribers.length} total`
              : `${activeSubscribers} aktive Abonnenten von insgesamt ${subscribers.length}`}
          </p>
        </div>
        <div className="space-x-2">
          <Button 
            onClick={fetchSubscribers} 
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Refresh' : 'Aktualisieren'}
          </Button>
          <Button 
            onClick={exportSubscribersCSV}
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Export CSV' : 'CSV exportieren'}
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{language === 'en' ? 'Email' : 'E-Mail'}</TableHead>
            <TableHead>{language === 'en' ? 'Status' : 'Status'}</TableHead>
            <TableHead>{language === 'en' ? 'Subscribed On' : 'Abonniert am'}</TableHead>
            <TableHead>{language === 'en' ? 'Actions' : 'Aktionen'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscribers.length > 0 ? (
            subscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell>{subscriber.email}</TableCell>
                <TableCell>
                  {subscriber.is_active ? (
                    <Badge className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {language === 'en' ? 'Active' : 'Aktiv'}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-500">
                      <XCircle className="h-3 w-3 mr-1" />
                      {language === 'en' ? 'Inactive' : 'Inaktiv'}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(subscriber.subscribed_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={subscriber.is_active}
                        onCheckedChange={() => toggleSubscriberStatus(subscriber.id, subscriber.is_active)}
                      />
                      <span className="text-sm">
                        {subscriber.is_active 
                          ? (language === 'en' ? 'Active' : 'Aktiv') 
                          : (language === 'en' ? 'Inactive' : 'Inaktiv')}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeSubscriber(subscriber.id)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                {language === 'en' ? 'No subscribers found' : 'Keine Abonnenten gefunden'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Newsletter;
