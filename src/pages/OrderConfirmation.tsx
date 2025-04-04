
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!id) return;

        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items(
              *,
              course:courses(*)
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError(language === 'en' 
          ? 'Unable to load order details. Please try again later.' 
          : 'Bestelldetails konnten nicht geladen werden. Bitte versuchen Sie es später erneut.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, language]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              {language === 'en' ? 'Error' : 'Fehler'}
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link to="/">
              <Button>
                {language === 'en' ? 'Return to Homepage' : 'Zurück zur Startseite'}
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-green-50 border-b border-green-100 flex items-center">
              <div className="bg-green-100 rounded-full p-2 mr-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {language === 'en' 
                    ? 'Order Confirmed!' 
                    : 'Bestellung bestätigt!'}
                </h1>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? `Order #${order.id.substring(0, 8)} was placed on ${formatDate(order.created_at)}`
                    : `Bestellung #${order.id.substring(0, 8)} wurde am ${formatDate(order.created_at)} aufgegeben`}
                </p>
              </div>
            </div>
            
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">
                {language === 'en' ? 'Order Summary' : 'Bestellübersicht'}
              </h2>
              
              <div className="space-y-4">
                {order.order_items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <img 
                        src={item.course?.imageUrl} 
                        alt="" 
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <div>
                        <h3 className="font-medium">
                          {item.course?.title && item.course.title[language] ? 
                            item.course.title[language] : 
                            'Course'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.course?.format} · {item.course?.duration}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-b bg-gray-50">
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">
                  {language === 'en' ? 'Subtotal:' : 'Zwischensumme:'}
                </p>
                <p className="font-medium">
                  {formatPrice(order.total_amount)}
                </p>
              </div>
              
              <div className="flex justify-between font-bold text-lg mt-4">
                <p>
                  {language === 'en' ? 'Total:' : 'Gesamt:'}
                </p>
                <p>
                  {formatPrice(order.total_amount)}
                </p>
              </div>
            </div>
            
            <div className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <Link to="/dashboard/orders">
                <Button variant="outline">
                  {language === 'en' ? 'View All Orders' : 'Alle Bestellungen anzeigen'}
                </Button>
              </Link>
              
              <Link to="/courses">
                <Button className="flex items-center">
                  {language === 'en' ? 'Continue Shopping' : 'Weiter einkaufen'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
