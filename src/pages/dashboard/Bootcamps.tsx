
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Clock, Award, Calendar } from 'lucide-react';
import { Course } from '@/types';

const Bootcamps = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        // Get all orders for the user
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            id,
            order_items(course_id)
          `)
          .eq('user_id', user.id);
        
        if (ordersError) throw ordersError;
        
        if (!ordersData || ordersData.length === 0) {
          setCourses([]);
          setLoading(false);
          return;
        }
        
        // Extract all course IDs from orders
        const courseIds = new Set<string>();
        ordersData.forEach(order => {
          if (order.order_items) {
            order.order_items.forEach((item: any) => {
              if (item.course_id) {
                courseIds.add(item.course_id);
              }
            });
          }
        });
        
        if (courseIds.size === 0) {
          setCourses([]);
          setLoading(false);
          return;
        }
        
        // Fetch course details
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .eq('course_type', 'bootcamp') 
          .in('id', Array.from(courseIds)
          );
        
        if (coursesError) throw coursesError;
        
        // Transform courses data to match the Course type
        if (coursesData) {
          const transformedCourses: Course[] = coursesData.map((course: any) => ({
            id: course.id,
            title: {
              en: course.title,
              de: course.title
            },
            shortDescription: {
              en: course.description.substring(0, 150) + '...',
              de: course.description.substring(0, 150) + '...'
            },
            description: {
              en: course.description,
              de: course.description
            },
            duration: course.duration,
            level: course.level,
            format: course.format,
            price: course.price,
            category: course.category,
            startDate: course.start_date,
            imageUrl: course.image_url,
            instructor: course.instructor,
            interval: 'One-time',
            maxParticipants: 20,
            targetGroup: {
              en: course.target_group || '',
              de: course.target_group || ''
            },
            syllabus: [],
            objectives: []
          }));
          
          setCourses(transformedCourses);
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

    fetchCourses();
  }, [language, toast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
        {language === 'en' ? 'My Bootcamps' : 'Meine Bootcamps'}
      </h1>

      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {language === 'en' ? 'No Bootcamp Yet' : 'Noch kein Bootcamp'}
          </h2>
          <p className="text-gray-500 mb-6">
            {language === 'en' 
              ? 'You haven\'t enrolled in any Bootcamp yet.' 
              : 'Sie haben sich noch für kein Bootcamp angemeldet.'}
          </p>
          <Button onClick={() => navigate('/bootcampview')}>
            {language === 'en' ? 'Browse bootcamps' : 'Bootcamps durchsuchen'}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/4 h-48 md:h-auto">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title[language]} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full md:w-3/4 p-6">
                  <h2 className="text-xl font-bold mb-2">{course.title[language]}</h2>
                  <p className="text-gray-600 mb-4">{course.shortDescription[language]}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">
                          {language === 'en' ? 'Duration' : 'Dauer'}
                        </p>
                        <p className="text-sm font-medium">{course.duration}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">
                          {language === 'en' ? 'Level' : 'Niveau'}
                        </p>
                        <p className="text-sm font-medium">{course.level}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">
                          {language === 'en' ? 'Start Date' : 'buchbar ab'}
                        </p>
                        <p className="text-sm font-medium">{formatDate(course.startDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">
                          {language === 'en' ? 'Format' : 'Format'}
                        </p>
                        <p className="text-sm font-medium">{course.format}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={() => navigate(`/dashboard/bootcamps/${course.id}`)}>
                      {language === 'en' ? 'View Bootcamp Details' : 'Bootcamp anzeigen'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bootcamps;
