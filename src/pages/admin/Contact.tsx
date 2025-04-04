
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
import { RefreshCw, Mail, Trash2, Eye, CheckCircle, ArchiveIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const Contact = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [messageOpen, setMessageOpen] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: language === 'en' 
          ? 'Failed to load messages' 
          : 'Fehler beim Laden der Nachrichten',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setMessages(
        messages.map(message => 
          message.id === id ? { ...message, status } : message
        )
      );
      
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
      
      toast({
        title: language === 'en' ? 'Success' : 'Erfolg',
        description: language === 'en' 
          ? 'Message status updated' 
          : 'Nachrichtenstatus aktualisiert',
      });
    } catch (error) {
      console.error('Error updating message status:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: language === 'en' 
          ? 'Failed to update message status' 
          : 'Fehler beim Aktualisieren des Nachrichtenstatus',
        variant: 'destructive',
      });
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm(language === 'en' 
      ? 'Are you sure you want to delete this message?' 
      : 'Sind Sie sicher, dass Sie diese Nachricht löschen möchten?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setMessages(messages.filter(message => message.id !== id));
      
      // Close dialog if the deleted message was open
      if (selectedMessage?.id === id) {
        setMessageOpen(false);
        setSelectedMessage(null);
      }
      
      toast({
        title: language === 'en' ? 'Success' : 'Erfolg',
        description: language === 'en' 
          ? 'Message deleted successfully' 
          : 'Nachricht erfolgreich gelöscht',
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: language === 'en' 
          ? 'Failed to delete message' 
          : 'Fehler beim Löschen der Nachricht',
        variant: 'destructive',
      });
    }
  };

  const viewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setMessageOpen(true);
    
    // If the message is unread, mark it as read
    if (message.status === 'Unread') {
      updateMessageStatus(message.id, 'Read');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Unread':
        return (
          <Badge className="bg-blue-500">
            <Mail className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Unread' : 'Ungelesen'}
          </Badge>
        );
      case 'Read':
        return (
          <Badge variant="outline" className="text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Read' : 'Gelesen'}
          </Badge>
        );
      case 'Archived':
        return (
          <Badge variant="outline" className="text-gray-500">
            <ArchiveIcon className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Archived' : 'Archiviert'}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'Contact Messages' : 'Kontaktnachrichten'}
        </h1>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-16" />
          ))}
        </div>
      </div>
    );
  }

  // Count unread messages
  const unreadCount = messages.filter(m => m.status === 'Unread').length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {language === 'en' ? 'Contact Messages' : 'Kontaktnachrichten'}
          </h1>
          {unreadCount > 0 && (
            <p className="text-blue-600 font-medium mt-1">
              {language === 'en' 
                ? `${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}`
                : `${unreadCount} ungelesene Nachricht${unreadCount !== 1 ? 'en' : ''}`}
            </p>
          )}
        </div>
        <Button 
          onClick={fetchMessages} 
          variant="outline"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Refresh' : 'Aktualisieren'}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{language === 'en' ? 'Status' : 'Status'}</TableHead>
            <TableHead>{language === 'en' ? 'Date' : 'Datum'}</TableHead>
            <TableHead>{language === 'en' ? 'Name' : 'Name'}</TableHead>
            <TableHead>{language === 'en' ? 'Email' : 'E-Mail'}</TableHead>
            <TableHead>{language === 'en' ? 'Subject' : 'Betreff'}</TableHead>
            <TableHead>{language === 'en' ? 'Actions' : 'Aktionen'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.length > 0 ? (
            messages.map((message) => (
              <TableRow 
                key={message.id}
                className={message.status === 'Unread' ? 'font-medium bg-muted/30' : ''}
              >
                <TableCell>{getStatusBadge(message.status)}</TableCell>
                <TableCell>{new Date(message.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{message.name}</TableCell>
                <TableCell>{message.email}</TableCell>
                <TableCell className="max-w-[200px] truncate">{message.subject}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => viewMessage(message)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateMessageStatus(message.id, 'Archived')}
                    >
                      <ArchiveIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => deleteMessage(message.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                {language === 'en' ? 'No messages found' : 'Keine Nachrichten gefunden'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        {selectedMessage && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedMessage.subject}</DialogTitle>
              <DialogDescription>
                {language === 'en' ? 'From' : 'Von'}: {selectedMessage.name} ({selectedMessage.email})
                <br />
                {language === 'en' ? 'Received' : 'Erhalten'}: {new Date(selectedMessage.created_at).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4 p-4 bg-muted/20 rounded-md whitespace-pre-wrap">
              {selectedMessage.message}
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`;
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Reply via Email' : 'Per E-Mail antworten'}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => updateMessageStatus(selectedMessage.id, 
                    selectedMessage.status === 'Archived' ? 'Read' : 'Archived'
                  )}
                >
                  {selectedMessage.status === 'Archived' ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Mark as Read' : 'Als gelesen markieren'}
                    </>
                  ) : (
                    <>
                      <ArchiveIcon className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Archive' : 'Archivieren'}
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="destructive"
                  onClick={() => deleteMessage(selectedMessage.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Delete' : 'Löschen'}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Contact;
