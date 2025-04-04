
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

// Define interfaces for Supabase data structure
interface SupabaseCourse {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  format: string;
  price: number;
  category: string;
  start_date: string;
  image_url: string;
  instructor: string;
  target_group: string | null;
  created_at: string;
  updated_at: string;
}

interface SupabaseOrderItem {
  id: string;
  order_id: string;
  course_id: string;
  price: number;
  created_at: string;
  course: SupabaseCourse;
}

interface SupabaseOrder {
  id: string;
  user_id: string;
  total_amount: number;
  payment_status: string;
  payment_method: string | null;
  invoice_id: string | null;
  order_date: string;
  created_at: string;
  updated_at: string;
  order_items: SupabaseOrderItem[];
}

const Dashboard = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState<SupabaseCourse[]>([]);
  const [recentOrders, setRecentOrders] = useState<SupabaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) return;
        
        const userId = session.user.id;
        
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', userId)
          .single();
        
        if (profileData) {
          const fullName = [profileData.first_name, profileData.last_name]
            .filter(Boolean)
            .join(' ');
          setUserName(fullName || session.user.email || '');
        }
        
        // Fetch enrolled courses
        const { data: enrollmentsData } = await supabase
          .from('enrollments')
          .select('course_id, courses(*)')
          .eq('user_id', userId);
        
        if (enrollmentsData) {
          const courses = enrollmentsData.map(enrollment => enrollment.courses);
          setEnrolledCourses(courses);
        }
        
        // Fetch recent orders with course details
        const { data: ordersData } = await supabase
          .from('orders')
          .select(`
            *,
            order_items:order_items(
              *,
              course:courses(*)
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (ordersData) {
          setRecentOrders(ordersData as SupabaseOrder[]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="p-8 flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-xl text-gray-600">
          {language === 'en' ? 'Welcome back, ' : 'Willkommen zurück, '}
          {userName}!
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Enrolled Courses Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {language === 'en' ? 'Enrolled Courses' : 'Eingeschriebene Kurse'}
          </h2>
          
          <Card className="mb-4">
            <CardContent className="p-6">
              {enrolledCourses.length > 0 ? (
                <ul className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <li key={course.id} className="pb-3 border-b border-gray-100 last:border-0">
                      <p className="font-medium">{course.title}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">{course.instructor}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/dashboard/courses/${course.id}`)}
                        >
                          {language === 'en' ? 'View Course' : 'Kurs anzeigen'}
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <p className="mb-4 text-gray-500">
                    {language === 'en' ? 'Noch keine eingeschriebenen Kurse.' : 'Noch keine eingeschriebenen Kurse.'}
                  </p>
                  <Button onClick={() => navigate('/courses')}>
                    {language === 'en' ? 'Find new courses' : 'Neue Kurse finden'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {language === 'en' ? 'Recent Orders' : 'Letzte Bestellungen'}
          </h2>
          
          <Card className="mb-4">
            <CardContent className="p-6">
              {recentOrders.length > 0 ? (
                <ul className="space-y-4">
                  {recentOrders.map((order) => (
                    <li key={order.id} className="pb-3 border-b border-gray-100 last:border-0">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">
                            {language === 'en' ? 'Order ID' : 'Bestellnummer'}: {order.id.substring(0, 8)}...
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.order_date).toLocaleDateString(
                              language === 'en' ? 'en-US' : 'de-DE', 
                              { year: 'numeric', month: 'long', day: 'numeric' }
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${order.total_amount}</p>
                          <p className="text-sm text-gray-500">
                            {order.payment_status}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">
                    {language === 'en' ? 'No recent orders.' : 'Keine letzten Bestellungen.'}
                  </p>
                </div>
              )}
              
              {recentOrders.length > 0 && (
                <div className="mt-4 text-center">
                  <Button 
                    onClick={() => navigate('/dashboard/orders')}
                    className="w-full"
                  >
                    {language === 'en' ? 'View all orders' : 'Alle Bestellungen anzeigen'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
