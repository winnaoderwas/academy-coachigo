
import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  FileText, 
  LogOut, 
  BarChart4, 
  Mail, 
  MessageSquare,
  Settings,
  Calendar
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const AdminLayout = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: language === 'en' ? 'Success' : 'Erfolg',
      description: language === 'en' 
        ? 'You have been successfully logged out.' 
        : 'Sie wurden erfolgreich abgemeldet.',
    });
    
    navigate('/');
  };

  const menuItems = [
    { 
      path: '/admin', 
      label: language === 'en' ? 'Dashboard' : 'Dashboard',
      icon: <BarChart4 className="w-5 h-5 mr-2" /> 
    },
    { 
      path: '/admin/courses', 
      label: language === 'en' ? 'Courses' : 'Kurse',
      icon: <BookOpen className="w-5 h-5 mr-2" /> 
    },
    { 
      path: '/admin/sessions', 
      label: language === 'en' ? 'Sessions' : 'Sitzungen',
      icon: <Calendar className="w-5 h-5 mr-2" /> 
    },
    { 
      path: '/admin/users', 
      label: language === 'en' ? 'Users' : 'Benutzer',
      icon: <Users className="w-5 h-5 mr-2" /> 
    },
    { 
      path: '/admin/orders', 
      label: language === 'en' ? 'Orders' : 'Bestellungen',
      icon: <FileText className="w-5 h-5 mr-2" /> 
    },
    { 
      path: '/admin/newsletter', 
      label: language === 'en' ? 'Newsletter' : 'Newsletter',
      icon: <Mail className="w-5 h-5 mr-2" /> 
    },
    { 
      path: '/admin/contact', 
      label: language === 'en' ? 'Contact Messages' : 'Kontaktnachrichten',
      icon: <MessageSquare className="w-5 h-5 mr-2" /> 
    },
    { 
      path: '/admin/settings', 
      label: language === 'en' ? 'Settings' : 'Einstellungen',
      icon: <Settings className="w-5 h-5 mr-2" /> 
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="flex-grow flex flex-col md:flex-row mt-16">
        {/* Mobile menu toggle */}
        <div className="md:hidden p-4 border-b">
          <button
            onClick={toggleMobileMenu}
            className="flex items-center justify-between w-full p-2 bg-gray-100 rounded"
          >
            <span className="font-medium">
              {language === 'en' ? 'Admin Menu' : 'Admin-Menü'}
            </span>
            <svg
              className={`w-5 h-5 transition-transform ${
                isMobileMenuOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMobileMenuOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
              ></path>
            </svg>
          </button>
        </div>

        {/* Sidebar - always visible on desktop, toggleable on mobile */}
        <aside
          className={`w-full md:w-64 bg-gray-50 border-r md:block ${
            isMobileMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">
              {language === 'en' ? 'Admin Area' : 'Administrationsbereich'}
            </h2>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-left text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                {language === 'en' ? 'Logout' : 'Abmelden'}
              </button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminLayout;
