
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
import { Check, X, UserCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean;
  created_at: string;
}

const Users = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: language === 'en' 
          ? 'Failed to load users' 
          : 'Fehler beim Laden der Benutzer',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_admin: !currentStatus } : user
      ));
      
      toast({
        title: language === 'en' ? 'Success' : 'Erfolg',
        description: language === 'en' 
          ? 'User status updated successfully' 
          : 'Benutzerstatus erfolgreich aktualisiert',
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: language === 'en' 
          ? 'Failed to update user status' 
          : 'Fehler beim Aktualisieren des Benutzerstatus',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'User Management' : 'Benutzerverwaltung'}
        </h1>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-16" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'User Management' : 'Benutzerverwaltung'}
        </h1>
        <Button onClick={fetchUsers}>
          {language === 'en' ? 'Refresh' : 'Aktualisieren'}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{language === 'en' ? 'Name' : 'Name'}</TableHead>
            <TableHead>{language === 'en' ? 'Email' : 'E-Mail'}</TableHead>
            <TableHead>{language === 'en' ? 'Admin' : 'Administrator'}</TableHead>
            <TableHead>{language === 'en' ? 'Join Date' : 'Beitrittsdatum'}</TableHead>
            <TableHead>{language === 'en' ? 'Actions' : 'Aktionen'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {[user.first_name, user.last_name].filter(Boolean).join(' ') || 
                    (language === 'en' ? 'Not provided' : 'Nicht angegeben')}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.is_admin ? (
                    <Badge variant="default" className="bg-green-500">
                      <Check className="h-4 w-4 mr-1" />
                      {language === 'en' ? 'Yes' : 'Ja'}
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <X className="h-4 w-4 mr-1" />
                      {language === 'en' ? 'No' : 'Nein'}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                  >
                    <UserCog className="h-4 w-4 mr-1" />
                    {user.is_admin 
                      ? (language === 'en' ? 'Remove Admin' : 'Admin entfernen')
                      : (language === 'en' ? 'Make Admin' : 'Zum Admin machen')}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                {language === 'en' ? 'No users found' : 'Keine Benutzer gefunden'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Users;
