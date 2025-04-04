
import { useState, useEffect } from 'react';
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types';

const CartPage = () => {
  const { cart, cartItems, removeFromCart, updateQuantity, getTotalPrice, getTotalPriceAsync } = useCart();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  
  useEffect(() => {
    const fetchTotalPrice = async () => {
      const price = await getTotalPriceAsync();
      setTotalPrice(price);
    };
    
    fetchTotalPrice();
  }, [cart, getTotalPriceAsync]);
  
  // Fetch all courses in the cart from Supabase
  const { data: coursesData = [] } = useQuery({
    queryKey: ['cartCourses', cartItems],
    queryFn: async () => {
      if (!cartItems || cartItems.length === 0) return [];
      
      try {
        const { data, error } = await supabase
          .from('courses')
          .select(`
            id,
            title,
            description,
            duration,
            level,
            format,
            price,
            category,
            start_date,
            image_url,
            instructor
          `)
          .in('id', cartItems)
          .order('start_date', { ascending: true });
          
        if (error) {
          console.error('Error fetching cart courses:', error);
          return [];
        }
        
        return data.map(courseData => ({
          id: courseData.id,
          title: typeof courseData.title === 'object' ? courseData.title : { en: courseData.title || '', de: courseData.title || '' },
          shortDescription: { en: '', de: '' },
          description: typeof courseData.description === 'object' ? courseData.description : { en: courseData.description || '', de: courseData.description || '' },
          duration: courseData.duration,
          level: courseData.level,
          format: courseData.format,
          price: courseData.price,
          category: courseData.category,
          startDate: courseData.start_date,
          imageUrl: courseData.image_url,
          instructor: courseData.instructor,
          interval: 'Weekly',
          maxParticipants: 30,
          targetGroup: { en: '', de: '' },
          syllabus: [],
          objectives: []
        })) as Course[];
      } catch (error) {
        console.error('Error in cart courses query:', error);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    enabled: cartItems && cartItems.length > 0,
    refetchOnWindowFocus: false,
  });
  
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      setIsLoading(false);
    }
  }, [cartItems]);
  
  const cartCourses = cart.map(item => {
    const course = coursesData.find(c => c.id === item.courseId);
    return {
      ...item,
      course
    };
  }).filter(item => item.course);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'de-DE', {
      style: 'currency',
      currency: language === 'en' ? 'USD' : 'EUR',
    }).format(price);
  };

  // Translation helper function
  const translations: Record<string, Record<string, string>> = {
    'cart.title': {
      en: 'Shopping Cart',
      de: 'Warenkorb'
    },
    'cart.continue': {
      en: 'Continue Shopping',
      de: 'Weiter Einkaufen'
    },
    'cart.empty': {
      en: 'Your Cart is Empty',
      de: 'Ihr Warenkorb ist leer'
    },
    'cart.remove': {
      en: 'Remove',
      de: 'Entfernen'
    },
    'cart.total': {
      en: 'Total',
      de: 'Gesamt'
    },
    'cart.checkout': {
      en: 'Proceed to Checkout',
      de: 'Zur Kasse'
    }
  };
  
  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center">
              <ShoppingCart className="mr-3 h-8 w-8" />
              {t('cart.title')}
            </h1>
            <Link to="/courses">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t('cart.continue')}
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="mx-auto w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>{language === 'en' ? 'Loading your cart...' : 'Lade deinen Warenkorb...'}</p>
            </div>
          ) : cartCourses.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">{t('cart.empty')}</h2>
              <p className="text-gray-500 mb-6">
                {language === 'en' 
                  ? 'Your cart is empty. Add some courses to get started!' 
                  : 'Ihr Warenkorb ist leer. Fügen Sie einige Kurse hinzu, um zu beginnen!'}
              </p>
              <Button asChild size="lg">
                <Link to="/courses">{t('cart.continue')}</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <ul className="divide-y divide-gray-200">
                  {cartCourses.map(({ course, quantity, courseId }) => (
                    <li key={courseId} className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="sm:w-24 h-20 overflow-hidden rounded-md">
                          <img 
                            src={course?.imageUrl} 
                            alt={course?.title[language]} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <div>
                              <h3 className="font-medium text-lg">{course?.title[language]}</h3>
                              <p className="text-sm text-gray-500">
                                {course?.level} · {course?.format}
                              </p>
                            </div>
                            <div className="mt-2 sm:mt-0 text-right">
                              <div className="font-semibold text-lg">
                                {formatPrice(course ? course.price * quantity : 0)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {quantity} x {formatPrice(course?.price || 0)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center">
                              <button 
                                onClick={() => updateQuantity(courseId, quantity - 1)}
                                className="p-1 border rounded-md h-8 w-8 flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="mx-3">{quantity}</span>
                              <button 
                                onClick={() => updateQuantity(courseId, quantity + 1)}
                                className="p-1 border rounded-md h-8 w-8 flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeFromCart(courseId)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-1"
                            >
                              <Trash2 className="h-4 w-4" />
                              {t('cart.remove')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">{t('cart.total')}</span>
                    <span className="font-semibold text-xl">{formatPrice(totalPrice)}</span>
                  </div>
                  
                  <Button asChild size="lg" className="w-full bg-[#007bff] hover:bg-[#0069d9] text-white">
                    <Link to="/checkout">{t('cart.checkout')}</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CartPage;
