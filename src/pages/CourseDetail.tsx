
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  BarChart,
  ShoppingCart,
  Users,
  Award,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const { addToCart, cart } = useCart();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [objectives, setObjectives] = useState<any[]>([]);
  const [syllabus, setSyllabus] = useState<any[]>([]);
  const [userHasPurchased, setUserHasPurchased] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user && id) {
        // Check if user has already purchased this course
        const { data, error } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('course_id', id)
          .maybeSingle();
        
        if (!error && data) {
          setUserHasPurchased(true);
        }
      }
    };
    
    checkUser();
  }, [id]);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      
      console.log('Fetching course with ID:', id);
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('courses')
          .select(`
            *,
            course_objectives(*),
            course_syllabus(*)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        console.log('Fetched course data:', data);
        
        setCourse(data);
        setObjectives(data.course_objectives || []);
        setSyllabus(data.course_syllabus || []);
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error(language === 'en' ? 'Failed to load course details' : 'Fehler beim Laden der Kursdetails');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [id, language]);

  const handleAddToCart = () => {
    if (id) {
      addToCart(id);
      toast.success(
        language === 'en' 
          ? 'Course added to cart!' 
          : 'Kurs zum Warenkorb hinzugefügt!'
      );
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return '';
    
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'de-DE', {
      style: 'currency',
      currency: language === 'en' ? 'USD' : 'EUR',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8 pt-32">
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8 pt-32">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Course Not Found' : 'Kurs nicht gefunden'}
            </h1>
            <p className="mb-6">
              {language === 'en' 
                ? 'The course you are looking for does not exist or has been removed.' 
                : 'Der gesuchte Kurs existiert nicht oder wurde entfernt.'}
            </p>
            <Button asChild>
              <Link to="/courses">
                {language === 'en' ? 'Browse Courses' : 'Kurse durchsuchen'}
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const levelColors = {
    'Beginner': 'bg-emerald-500',
    'Intermediate': 'bg-blue-500',
    'Advanced': 'bg-purple-500',
    'Expert': 'bg-orange-500'
  };

  // Check if course is in cart
  const isInCart = cart && cart.some(item => item.courseId === id);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-50 to-white py-20 pt-32">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Course Info */}
              <div className="lg:w-7/12">
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline" className="bg-blue-50">
                    {course.category}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-50">
                    {course.format}
                  </Badge>
                  <Badge 
                    className={`text-white border-0 ${levelColors[course.level as keyof typeof levelColors] || 'bg-gray-500'}`}>
                    {course.level}
                  </Badge>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {course.title || ''}
                </h1>
                
                <p className="text-gray-600 mb-6">
                  {course.description || ''}
                </p>
                
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                    <span>
                      {new Date(course.start_date).toLocaleDateString(
                        language === 'en' ? 'en-US' : 'de-DE', 
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <BarChart className="h-5 w-5 text-amber-500 mr-2" />
                    <span>{language === 'en' ? 'Instructor:' : 'Dozent:'} <strong>{course.instructor}</strong></span>
                  </div>
                </div>
                
                {userHasPurchased ? (
                  <div className="flex items-center bg-green-50 text-green-800 p-4 rounded-lg mb-6">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>
                      {language === 'en' 
                        ? 'You have already enrolled in this course' 
                        : 'Sie haben diesen Kurs bereits gebucht'}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="text-3xl font-bold text-primary">
                      {formatPrice(course.price)}
                    </div>
                    
                    {isInCart ? (
                      <Button asChild variant="outline" className="gap-2">
                        <Link to="/cart">
                          <ShoppingCart className="h-4 w-4" />
                          {language === 'en' ? 'View in Cart' : 'Im Warenkorb ansehen'}
                        </Link>
                      </Button>
                    ) : (
                      <Button onClick={handleAddToCart} className="gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        {language === 'en' ? 'Add to Cart' : 'In den Warenkorb'}
                      </Button>
                    )}
                  </div>
                )}
              </div>
              
              {/* Course Image */}
              <div className="lg:w-5/12">
                <div className="rounded-xl overflow-hidden">
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-[320px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Course Details Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Learning Objectives */}
                {objectives.length > 0 && (
                  <div className="glass rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <Award className="h-6 w-6 text-primary mr-2" />
                      {language === 'en' ? 'What You Will Learn' : 'Was Sie lernen werden'}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {objectives.map((objective: any) => (
                        <div key={objective.id} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span>{objective.objective}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Course Syllabus */}
                {syllabus.length > 0 && (
                  <div className="glass rounded-xl p-6">
                    <h2 className="text-2xl font-bold mb-6">
                      {language === 'en' ? 'Course Content' : 'Kursinhalt'}
                    </h2>
                    
                    <div className="space-y-4">
                      {syllabus.map((item: any, index: number) => (
                        <div key={item.id} className="glass-inner p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">
                              {index + 1}. {item.title}
                            </h3>
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sidebar */}
              <div>
                {/* Course Info Card */}
                <div className="glass rounded-xl p-6 mb-8 sticky top-32">
                  <h3 className="text-xl font-semibold mb-4">
                    {language === 'en' ? 'Course Information' : 'Kursinformationen'}
                  </h3>
                  
                  <ul className="space-y-4">
                    <li className="flex justify-between">
                      <span className="text-gray-600">
                        {language === 'en' ? 'Duration:' : 'Dauer:'}
                      </span>
                      <span className="font-medium">{course.duration}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">
                        {language === 'en' ? 'Level:' : 'Niveau:'}
                      </span>
                      <span className="font-medium">{course.level}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">
                        {language === 'en' ? 'Format:' : 'Format:'}
                      </span>
                      <span className="font-medium">{course.format}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">
                        {language === 'en' ? 'Category:' : 'Kategorie:'}
                      </span>
                      <span className="font-medium">{course.category}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">
                        {language === 'en' ? 'Instructor:' : 'Dozent:'}
                      </span>
                      <span className="font-medium">{course.instructor}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">
                        {language === 'en' ? 'Start Date:' : 'Startdatum:'}
                      </span>
                      <span className="font-medium">
                        {new Date(course.start_date).toLocaleDateString(
                          language === 'en' ? 'en-US' : 'de-DE'
                        )}
                      </span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">
                        {language === 'en' ? 'Price:' : 'Preis:'}
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(course.price)}
                      </span>
                    </div>
                    
                    {userHasPurchased ? (
                      <div className="bg-green-50 text-green-800 p-4 rounded-lg text-center">
                        <CheckCircle className="h-5 w-5 mx-auto mb-2" />
                        <p>
                          {language === 'en' 
                            ? 'You have already enrolled in this course' 
                            : 'Sie haben diesen Kurs bereits gebucht'}
                        </p>
                      </div>
                    ) : (
                      isInCart ? (
                        <Button asChild variant="outline" className="w-full gap-2">
                          <Link to="/cart">
                            <ShoppingCart className="h-4 w-4" />
                            {language === 'en' ? 'View in Cart' : 'Im Warenkorb ansehen'}
                          </Link>
                        </Button>
                      ) : (
                        <Button onClick={handleAddToCart} className="w-full gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          {language === 'en' ? 'Add to Cart' : 'In den Warenkorb'}
                        </Button>
                      )
                    )}
                  </div>
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

export default CourseDetailPage;
