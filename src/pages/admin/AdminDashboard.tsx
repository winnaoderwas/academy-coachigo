
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, FileText, Mail, MessageSquare } from 'lucide-react';

const AdminDashboard = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    orders: 0,
    subscribers: 0,
    messages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Get users count
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get courses count
        const { count: coursesCount } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true });

        // Get orders count
        const { count: ordersCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });

        // Get newsletter subscribers count
        const { count: subscribersCount } = await supabase
          .from('newsletter_subscribers')
          .select('*', { count: 'exact', head: true });

        // Get contact messages count
        const { count: messagesCount } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true });

        setStats({
          users: usersCount || 0,
          courses: coursesCount || 0,
          orders: ordersCount || 0,
          subscribers: subscribersCount || 0,
          messages: messagesCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: language === 'en' ? 'Total Users' : 'Benutzer insgesamt',
      value: stats.users,
      icon: <Users className="h-6 w-6 text-blue-500" />
    },
    {
      title: language === 'en' ? 'Total Courses' : 'Kurse insgesamt',
      value: stats.courses,
      icon: <BookOpen className="h-6 w-6 text-green-500" />
    },
    {
      title: language === 'en' ? 'Total Orders' : 'Bestellungen insgesamt',
      value: stats.orders,
      icon: <FileText className="h-6 w-6 text-orange-500" />
    },
    {
      title: language === 'en' ? 'Newsletter Subscribers' : 'Newsletter-Abonnenten',
      value: stats.subscribers,
      icon: <Mail className="h-6 w-6 text-purple-500" />
    },
    {
      title: language === 'en' ? 'Contact Messages' : 'Kontaktnachrichten',
      value: stats.messages,
      icon: <MessageSquare className="h-6 w-6 text-red-500" />
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        {language === 'en' ? 'Admin Dashboard' : 'Admin-Dashboard'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-medium">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {language === 'en' ? 'Admin Tools' : 'Administrator-Tools'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => window.location.href = '/admin/courses'}>
              <CardContent className="p-6 flex items-center">
                <BookOpen className="h-8 w-8 text-primary mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">
                    {language === 'en' ? 'Manage Courses' : 'Kurse verwalten'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {language === 'en' ? 'Add, edit or delete courses' : 'Kurse hinzufügen, bearbeiten oder löschen'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => window.location.href = '/admin/users'}>
              <CardContent className="p-6 flex items-center">
                <Users className="h-8 w-8 text-primary mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">
                    {language === 'en' ? 'Manage Users' : 'Benutzer verwalten'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {language === 'en' ? 'View and manage user accounts' : 'Benutzerkonten anzeigen und verwalten'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => window.location.href = '/admin/orders'}>
              <CardContent className="p-6 flex items-center">
                <FileText className="h-8 w-8 text-primary mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">
                    {language === 'en' ? 'Manage Orders' : 'Bestellungen verwalten'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {language === 'en' ? 'View and update order status' : 'Bestellstatus anzeigen und aktualisieren'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
