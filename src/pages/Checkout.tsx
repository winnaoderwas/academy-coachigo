
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().optional(),
  street: z.string().min(5, {
    message: 'Street address must be at least 5 characters.',
  }),
  zipCode: z.string().min(3, {
    message: 'Zip code must be at least 3 characters.',
  }),
  city: z.string().min(2, {
    message: 'City must be at least 2 characters.',
  }),
  country: z.string().min(2, {
    message: 'Country must be at least 2 characters.',
  }),
  paymentMethod: z.enum(['credit-card', 'paypal', 'bank-transfer'], {
    required_error: 'Please select a payment method.',
  }),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

const Checkout = () => {
  const { language } = useLanguage();
  const { cartItems, clearCart, getTotalPriceAsync } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [courseNames, setCourseNames] = useState<{ [key: string]: string }>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      street: '',
      zipCode: '',
      city: '',
      country: '',
      paymentMethod: 'credit-card',
    },
  });

  useEffect(() => {
    const fetchTotalPrice = async () => {
      const price = await getTotalPriceAsync();
      setTotalPrice(price);
    };
    
    fetchTotalPrice();
  }, [getTotalPriceAsync]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (!error && profile) {
          setUserProfile(profile);
          
          form.setValue('firstName', profile.first_name || '');
          form.setValue('lastName', profile.last_name || '');
          form.setValue('email', profile.email || session.user.email || '');
          form.setValue('phone', profile.phone || '');
          form.setValue('street', profile.street || '');
          form.setValue('zipCode', profile.zipcode || '');
          form.setValue('city', profile.city || '');
          form.setValue('country', profile.country || '');
        }
      }
    };
    
    checkUser();
  }, [form]);

  useEffect(() => {
    const loadCourseNames = async () => {
      if (!cartItems || cartItems.length === 0) {
        navigate('/cart');
        return;
      }

      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .in('id', cartItems);

        if (error || !data) {
          console.error('Error loading course names:', error || 'No data');
        return;
        }


      const namesMap: { [key: string]: string } = {};
      data.forEach(course => {
        namesMap[course.id] = course.title;
      });
      setCourseNames(namesMap);
    };

    loadCourseNames();
  }, [cartItems, navigate]);

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setIsLoading(true);
      
      if (!cartItems || cartItems.length === 0) {
        toast.error(language === 'en' ? 'Your cart is empty' : 'Ihr Warenkorb ist leer');
        navigate('/cart');
        return;
      }

      const totalAmount = await getTotalPriceAsync();

      // Create order - allowing for guest checkout with null user_id
      const orderData = {
        user_id: user?.id || null,
        total_amount: totalAmount,
        payment_status: 'Pending',
        payment_method: data.paymentMethod,
        guest_email: !user ? data.email : null, // Store email for guest users
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map(courseId => ({
        order_id: order.id,
        course_id: courseId,
        price: 0, // This will be updated with actual price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // If user is logged in, create enrollments
      if (user) {
        const enrollments = cartItems.map(courseId => ({
          user_id: user.id,
          course_id: courseId,
          completion_status: 'not_started',
        }));

        const { error: enrollError } = await supabase
          .from('enrollments')
          .insert(enrollments);

        if (enrollError) throw enrollError;
      
        // Update user profile if user is logged in
        const profileUpdate = {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          street: data.street,
          zipcode: data.zipCode,
          city: data.city,
          country: data.country
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileUpdate)
          .eq('id', user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
        }
      }

      clearCart();
      navigate(`/order-confirmation/${order.id}`);
      
    } catch (error: any) {
      console.error('Error processing order:', error);
      toast.error(
        language === 'en' 
          ? 'There was an error processing your order. Please try again.' 
          : 'Bei der Verarbeitung Ihrer Bestellung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToLogin = () => {
    navigate(`/login?redirect=${encodeURIComponent('/checkout')}`);
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8 pt-32">
          <h1 className="text-2xl font-bold mb-6">
            {language === 'en' ? 'Checkout' : 'Zur Kasse'}
          </h1>
          <div className="text-center py-20">
            <p>
              {language === 'en' 
                ? 'Your cart is empty. Add some courses before checking out.' 
                : 'Ihr Warenkorb ist leer. Fügen Sie einige Kurse hinzu, bevor Sie zur Kasse gehen.'}
            </p>
            <Button 
              onClick={() => navigate('/courses')} 
              className="mt-4"
            >
              {language === 'en' ? 'Browse Courses' : 'Kurse durchsuchen'}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8 pt-32">
        <h1 className="text-2xl font-bold mb-6">
          {language === 'en' ? 'Checkout' : 'Zur Kasse'}
        </h1>
        
        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-800">
                {language === 'en' ? 'Already have an account?' : 'Haben Sie bereits ein Konto?'}
              </h3>
              <p className="text-blue-700 text-sm">
                {language === 'en' 
                  ? 'Sign in to use your saved information and track your orders.' 
                  : 'Melden Sie sich an, um Ihre gespeicherten Informationen zu verwenden und Ihre Bestellungen zu verfolgen.'}
              </p>
            </div>
            <Button 
              onClick={redirectToLogin}
              variant="outline" 
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <LogIn className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Sign In' : 'Anmelden'}
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="glass rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {language === 'en' ? 'Contact Information' : 'Kontaktinformationen'}
              </h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{language === 'en' ? 'First Name' : 'Vorname'}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{language === 'en' ? 'Last Name' : 'Nachname'}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{language === 'en' ? 'Email' : 'E-Mail'}</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{language === 'en' ? 'Phone (optional)' : 'Telefon (optional)'}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">
                      {language === 'en' ? 'Shipping Address' : 'Lieferadresse'}
                    </h2>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'en' ? 'Street' : 'Straße'}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{language === 'en' ? 'Zip Code' : 'Postleitzahl'}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{language === 'en' ? 'City' : 'Stadt'}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'en' ? 'Country' : 'Land'}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">
                      {language === 'en' ? 'Payment Method' : 'Zahlungsmethode'}
                    </h2>
                    
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              className="space-y-3"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="credit-card" id="credit-card" />
                                <Label htmlFor="credit-card">
                                  {language === 'en' ? 'Credit Card' : 'Kreditkarte'}
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="paypal" id="paypal" />
                                <Label htmlFor="paypal">PayPal</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                                <Label htmlFor="bank-transfer">
                                  {language === 'en' ? 'Bank Transfer' : 'Banküberweisung'}
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      language === 'en' ? 'Complete Order' : 'Bestellung abschließen'
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
          
          <div>
            <div className="glass rounded-xl p-6 sticky top-32">
              <h2 className="text-xl font-semibold mb-4">
                {language === 'en' ? 'Order Summary' : 'Bestellübersicht'}
              </h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((courseId) => (
                  <div key={courseId} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{courseNames[courseId] || 'Loading...'}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>{language === 'en' ? 'Total' : 'Gesamtsumme'}</span>
                  <span>
                    {new Intl.NumberFormat(language === 'en' ? 'en-US' : 'de-DE', {
                      style: 'currency',
                      currency: language === 'en' ? 'USD' : 'EUR',
                    }).format(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
