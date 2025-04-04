
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect URL from query params
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '/';
  
  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate(redirectTo);
      }
    };
    
    checkAuth();
  }, [navigate, redirectTo]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          throw error;
        }
        
        toast({
          title: language === 'en' ? 'Success' : 'Erfolg',
          description: language === 'en' 
            ? 'You have been successfully logged in.' 
            : 'Sie wurden erfolgreich angemeldet.',
        });
        
        navigate(redirectTo);
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        });
        
        if (error) {
          throw error;
        }
        
        if (data.user && data.session) {
          toast({
            title: language === 'en' ? 'Success' : 'Erfolg',
            description: language === 'en' 
              ? 'Your account has been created successfully.' 
              : 'Ihr Konto wurde erfolgreich erstellt.',
          });
          
          navigate(redirectTo);
        } else {
          toast({
            title: language === 'en' ? 'Email Verification Required' : 'E-Mail-Bestätigung erforderlich',
            description: language === 'en' 
              ? 'Please check your email to confirm your registration.' 
              : 'Bitte überprüfen Sie Ihre E-Mail, um Ihre Registrierung zu bestätigen.',
          });
        }
      }
    } catch (error: any) {
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="container mx-auto px-4 py-12 flex-grow flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold">
                {isLogin 
                  ? (language === 'en' ? 'Login' : 'Anmelden') 
                  : (language === 'en' ? 'Create Account' : 'Konto erstellen')}
              </h1>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <Label htmlFor="firstName">
                      {language === 'en' ? 'First Name' : 'Vorname'} *
                    </Label>
                    <Input 
                      id="firstName" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">
                      {language === 'en' ? 'Last Name' : 'Nachname'} *
                    </Label>
                    <Input 
                      id="lastName" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              
              <div>
                <Label htmlFor="email">
                  {language === 'en' ? 'Email Address' : 'E-Mail-Adresse'} *
                </Label>
                <Input 
                  id="email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">
                  {language === 'en' ? 'Password' : 'Passwort'} *
                </Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading 
                  ? (language === 'en' ? 'Processing...' : 'Verarbeitung...') 
                  : (isLogin 
                      ? (language === 'en' ? 'Sign In' : 'Anmelden') 
                      : (language === 'en' ? 'Create Account' : 'Konto erstellen'))}
              </Button>
              
              <div className="text-center mt-4">
                <button 
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin 
                    ? (language === 'en' ? 'Need an account? Sign up' : 'Benötigen Sie ein Konto? Registrieren') 
                    : (language === 'en' ? 'Already have an account? Sign in' : 'Haben Sie bereits ein Konto? Anmelden')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AuthPage;
