
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { language } = useLanguage();
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { name: language === 'en' ? 'Home' : 'Startseite', path: '/' },
    { name: language === 'en' ? 'Courses' : 'Kurse', path: '/courses' },
    { name: language === 'en' ? 'Bootcamps' : 'Bootcamps', path: '/bootcampview' },
    { name: language === 'en' ? 'Coaching' : 'Coaching', path: '/coaching' }, 
     { name: language === 'en' ? 'Bootcamp' : 'Unsere Bootcamps', path: '/bootcamps' },
    { name: language === 'en' ? 'About' : 'Über uns', path: '/about' }
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 py-4',
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm'
          : 'bg-white/30 backdrop-blur-md shadow-sm'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold text-primary transition-opacity duration-200 hover:opacity-80"
          >
            COACHIGO ACADEMY 
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-sm font-medium transition-all duration-200 hover:text-primary',
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-gray-600'
                )}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center space-x-4 ml-2">
              <Link 
                to="/cart"
                className="relative text-sm font-medium transition-all duration-200 hover:text-primary"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Link>
              
              {user ? (
                <Link
                  to="/dashboard"
                  className="flex items-center text-sm font-medium text-primary"
                >
                  <UserCircle className="h-5 w-5 mr-1" />
                  <span className="hidden lg:inline">
                    {language === 'en' ? 'My Account' : 'Mein Konto'}
                  </span>
                </Link>
              ) : (
                <Button 
                  asChild 
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  <Link to="/login">
                    {language === 'en' ? 'Sign In' : 'Anmelden'}
                  </Link>
                </Button>
              )}
              
              <Button 
                asChild 
                className="bg-primary hover:bg-primary/90 text-white"
                size="sm"
              >
                <Link to="/courses">
                  {language === 'en' ? 'Explore Courses' : 'Kurse entdecken'}
                </Link>
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-4">
            <Link 
              to="/cart"
              className="relative text-gray-900"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {totalItems}
                </Badge>
              )}
            </Link>
            
            {user && (
              <Link
                to="/dashboard"
                className="text-primary"
              >
                <UserCircle className="h-5 w-5" />
              </Link>
            )}
            
            <button
              className="focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-900" />
              ) : (
                <Menu className="h-6 w-6 text-gray-900" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="glass absolute left-0 right-0 z-20 py-4 px-6 shadow-lg animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'text-base font-medium py-2 transition-colors',
                    location.pathname === link.path
                      ? 'text-primary'
                      : 'text-gray-600'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              {!user && (
                <Link
                  to="/login"
                  className="text-base font-medium py-2 text-gray-600"
                >
                  {language === 'en' ? 'Sign In' : 'Anmelden'}
                </Link>
              )}
              
              <Button 
                asChild 
                className="bg-primary hover:bg-primary/90 text-white w-full mt-2"
              >
                <Link to="/courses">
                  {language === 'en' ? 'Explore Courses' : 'Kurse entdecken'}
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
