
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ChevronRight, FileText } from 'lucide-react';
import { Order } from '@/types';

const Orders = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items(
              *,
              course:courses(id, title)
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          setOrders(data);
        }
      } catch (error: any) {
        toast({
          title: language === 'en' ? 'Error' : 'Fehler',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [language, toast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getOrderStatusLabel = (status: string) => {
    switch (status) {
      case 'Completed':
        return language === 'en' ? 'Completed' : 'Abgeschlossen';
      case 'Pending':
        return language === 'en' ? 'Pending' : 'In Bearbeitung';
      case 'Cancelled':
        return language === 'en' ? 'Cancelled' : 'Storniert';
      case 'Failed':
        return language === 'en' ? 'Failed' : 'Abgebrochen'; 
      case 'Refunded':
        return language === 'en' ? 'Refunded' : 'Erstattet';  
      default:
        return status;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600';
      case 'Pending':
        return 'text-yellow-600';
      case 'Cancelled':
        return 'text-red-600';
      case 'Refunded':
        return 'text-red-300';  
      case 'Failed':
        return 'text-yellow-300';  
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        {language === 'en' ? 'My Orders' : 'Meine Bestellungen'}
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {language === 'en' ? 'No Orders Yet' : 'Noch keine Bestellungen'}
          </h2>
          <p className="text-gray-500 mb-6">
            {language === 'en' 
              ? 'You haven\'t placed any orders yet.' 
              : 'Sie haben noch keine Bestellungen aufgegeben.'}
          </p>
          <Button onClick={() => navigate('/courses')}>
            {language === 'en' ? 'Browse Courses' : 'Kurse durchsuchen'}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold">
                        {language === 'en' ? 'Order' : 'Bestellung'} #{order.id.substring(0, 8)}
                      </h2>
                      <span className={`text-sm font-medium ${getOrderStatusColor(order.payment_status)}`}>
                        {getOrderStatusLabel(order.payment_status)}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {language === 'en' ? 'Total' : 'Gesamt'}
                    </p>
                    <p className="text-xl font-bold">
                      {formatPrice(order.total_amount)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <h3 className="font-medium text-gray-700 mb-3">
                  {language === 'en' ? 'Ordered Items' : 'Bestellte Artikel'}
                </h3>
                <div className="space-y-3">
                  {order.order_items && order.order_items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                                                       
                        <p className="font-medium">{item.course?.title[language] || 'Course'}</p>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/courses/${item.course_id}`)}
                        className="text-primary"
                      >
                        {language === 'en' ? 'View Course' : 'Kurs ansehen'}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 text-right">
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/order-confirmation/${order.id}`)}
                >
                  {language === 'en' ? 'View Order Details' : 'Bestelldetails anzeigen'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
