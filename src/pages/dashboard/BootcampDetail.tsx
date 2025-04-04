
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Clock, Award, Calendar, User, Video } from 'lucide-react';
import CourseImage from '@/components/courseDetail/CourseImage';
import CourseDescription from '@/components/bootcampDetail/BootcampDescription';
import CourseSyllabus from '@/components/courseDetail/CourseSyllabus';
import CourseTimetable from '@/components/courseDetail/CourseTimetable';
import { Course, CourseLevel, CourseFormat, CourseCategory } from '@/types';
import SyllabusDetails from '@/components/courseDetail/SyllabusDetails';

const DashboardBootcampDetail = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('content');

  useEffect(() => {
    if (id) {
      fetchCourse();
      checkEnrollment();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const transformedCourse: Course = {
          id: data.id,
          title: {
            en: data.title,
            de: data.title
          },
          shortDescription: {
            en: data.description.substring(0, 150) + '...',
            de: data.description.substring(0, 150) + '...'
          },
          description: {
            en: data.description,
            de: data.description
          },
          duration: data.duration,
          level: data.level as CourseLevel,
          format: data.format as CourseFormat,
          price: data.price,
          category: data.category as CourseCategory,
          startDate: data.start_date,
          imageUrl: data.image_url,
          instructor: data.instructor,
          interval: 'One-time',
          maxParticipants: 20,
          targetGroup: {
            en: data.target_group || '',
            de: data.target_group || ''
          },
          syllabus: [],
          objectives: [],
          openinfo_video: data.openinfo_video || null,
          courseinfo_video: data.courseinfo_video || null,
          course_type: data.course_type === 'bootcamp' ? 'bootcamp' : 'course'
        };
        
        setCourse(transformedCourse);
      } else {
        toast({
          title: language === 'en' ? 'Error' : 'Fehler',
          description: language === 'en' 
            ? 'Course not found' 
            : 'Kurs nicht gefunden',
          variant: 'destructive',
        });
        navigate('/dashboard/courses');
      }
    } catch (error: any) {
      console.error('Error fetching course:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
      navigate('/dashboard/bootcamps');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      // Check enrollments table first
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', session.session.user.id)
        .eq('course_id', id)
        .maybeSingle();

      if (enrollmentError && enrollmentError.code !== 'PGRST116') {
        console.error('Error checking enrollment:', enrollmentError);
      }

      if (enrollmentData) {
        setIsEnrolled(true);
        setActiveTab('materials');
        return;
      }

      // If not found in enrollments, check order_items
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          id,
          order_items!inner(course_id)
        `)
        .eq('user_id', session.session.user.id)
        .eq('order_items.course_id', id);

      if (orderError) {
        console.error('Error checking orders:', orderError);
        return;
      }

      if (orderData && orderData.length > 0) {
        setIsEnrolled(true);
        setActiveTab('materials');
        
        // Create enrollment record if it doesn't exist
        const { error: createError } = await supabase
          .from('enrollments')
          .insert({
            user_id: session.session.user.id,
            course_id: id,
            completion_status: 'Not Started'
          });
          
        if (createError) {
          console.error('Error creating enrollment record:', createError);
        }
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderVideoPlayer = (videoUrl: string | null | undefined) => {
    if (!videoUrl) return null;

    return (
      <div className="rounded-lg overflow-hidden bg-black mb-6">
        <div className="aspect-w-16 aspect-h-9">
          <iframe 
            src={videoUrl}
            title="Video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            style={{ aspectRatio: '16/9' }}
          ></iframe>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/dashboard/bootcamps')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {language === 'en' ? 'Back to My Courses' : 'Zurück zu Meine Bootcamps'}
        </Button>
        <h1 className="text-3xl font-bold">{course.title[language]}</h1>
      </div>

      <CourseImage imageUrl={course.imageUrl} alt={course.title[language]} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass rounded-xl p-4 flex flex-col items-center justify-center">
          <Clock className="h-8 w-8 text-primary mb-2" />
          <p className="text-sm text-gray-500">{language === 'en' ? 'Duration' : 'Dauer'}</p>
          <p className="font-semibold">{course.duration}</p>
        </div>
        
        <div className="glass rounded-xl p-4 flex flex-col items-center justify-center">
          <Award className="h-8 w-8 text-primary mb-2" />
          <p className="text-sm text-gray-500">{language === 'en' ? 'Level' : 'Niveau'}</p>
          <p className="font-semibold">{course.level}</p>
        </div>
        
        <div className="glass rounded-xl p-4 flex flex-col items-center justify-center">
          <Calendar className="h-8 w-8 text-primary mb-2" />
          <p className="text-sm text-gray-500">{language === 'en' ? 'Start Date' : 'verfügbar ab'}</p>
          <p className="font-semibold">{formatDate(course.startDate)}</p>
        </div>
        
        <div className="glass rounded-xl p-4 flex flex-col items-center justify-center">
          <User className="h-8 w-8 text-primary mb-2" />
          <p className="text-sm text-gray-500">{language === 'en' ? 'Instructor' : 'Dozent'}</p>
          <p className="font-semibold">{course.instructor}</p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="content">
            {language === 'en' ? 'Course Content' : 'Kursinhalt'}
          </TabsTrigger>
          <TabsTrigger value="syllabus">
            {language === 'en' ? 'Syllabus' : 'Kursplan'}
          </TabsTrigger>
          <TabsTrigger value="schedule">
            {language === 'en' ? 'Schedule' : 'Zeitplan'}
          </TabsTrigger>
          {isEnrolled && (
            <TabsTrigger value="materials">
              {language === 'en' ? 'Learning Materials' : 'Lernmaterialien'}
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="content" className="space-y-6">
          {course.courseinfo_video && (
            <div className="glass rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Video className="h-5 w-5 mr-2 text-primary" />
                {language === 'en' ? 'Course Introduction' : 'Kurseinführung'}
              </h2>
              {renderVideoPlayer(course.courseinfo_video)}
            </div>
          )}
          
          <CourseDescription course={course} />
          
          {!isEnrolled && (
            <div className="glass rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">
                {language === 'en' ? 'Lecture Materials' : 'Unterrichtsmaterialien'}
              </h2>
              <div className="bg-white rounded-lg p-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {language === 'en' ? 'Enroll to Access Materials' : 'Einschreiben, um auf Materialien zuzugreifen'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {language === 'en' 
                    ? 'Complete enrollment to access all lecture materials.' 
                    : 'Schließen Sie die Anmeldung ab, um auf alle Unterrichtsmaterialien zuzugreifen.'}
                </p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="syllabus">
          <CourseSyllabus course={course} />
        </TabsContent>

        <TabsContent value="schedule">
          {id && <CourseTimetable courseId={id} isEnrolled={isEnrolled} />}
        </TabsContent>

        {isEnrolled && (
          <TabsContent value="materials">
            <SyllabusDetails courseId={course.id} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default DashboardBootcampDetail;
