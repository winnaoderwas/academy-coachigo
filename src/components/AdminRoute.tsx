
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const { language } = useLanguage();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }
        
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        setIsAdmin(!!profileData?.is_admin);
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: language === 'en' ? 'Error' : 'Fehler',
          description: language === 'en' 
            ? 'Failed to verify admin permissions' 
            : 'Fehler beim Überprüfen der Administratorrechte',
          variant: 'destructive',
        });
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [toast, language]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    toast({
      title: language === 'en' ? 'Access Denied' : 'Zugriff verweigert',
      description: language === 'en' 
        ? 'You do not have admin privileges' 
        : 'Sie haben keine Administratorrechte',
      variant: 'destructive',
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
