
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Book,
  CheckCircle,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<string>('not_started');

  // Fetch course details
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['dashboardCourse', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch user enrollment for this course
  const { data: enrollment, isLoading: enrollmentLoading } = useQuery({
    queryKey: ['enrollment', id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No results found
          return null;
        }
        throw error;
      }
      
      return data;
    },
    enabled: !!id,
  });

  // Fetch syllabus for this course
  const { data: syllabus, isLoading: syllabusLoading } = useQuery({
    queryKey: ['courseSyllabus', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_syllabus')
        .select('*')
        .eq('course_id', id)
        .order('order_num', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Update progress from enrollment data
  useEffect(() => {
    if (enrollment) {
      setProgress(enrollment.progress || 0);
      setEnrollmentId(enrollment.id);
      setEnrollmentStatus(enrollment.completion_status);
    }
  }, [enrollment]);

  // Handle viewing course content
  const handleViewContent = (syllabusId: string) => {
    navigate(`/dashboard/course/${id}/content/${syllabusId}`);
  };

  const getStatusBadge = () => {
    switch (enrollmentStatus) {
      case 'completed':
        return <Badge className="bg-green-500">
          {language === 'en' ? 'Completed' : 'Abgeschlossen'}
        </Badge>;
      case 'in progress':
        return <Badge className="bg-blue-500">
          {language === 'en' ? 'In Progress' : 'In Bearbeitung'}
        </Badge>;
      default:
        return <Badge variant="outline">
          {language === 'en' ? 'Not Started' : 'Nicht begonnen'}
        </Badge>;
    }
  };

  // Cast the course_type to the correct type
  const getCourseType = (): "course" | "bootcamp" => {
    if (!course?.course_type) return "course";
    return course.course_type as "course" | "bootcamp";
  };

  if (courseLoading || enrollmentLoading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">
          {language === 'en' ? 'Course not found' : 'Kurs nicht gefunden'}
        </h2>
        <Button onClick={() => navigate('/dashboard/courses')}>
          {language === 'en' ? 'Back to My Courses' : 'Zurück zu Meinen Kursen'}
        </Button>
      </div>
    );
  }

  // Get formatted title based on course title type
  const getTitle = () => {
    if (typeof course.title === 'object') {
      return course.title[language as keyof typeof course.title] || course.title.en || '';
    }
    return course.title;
  }

  // Get formatted description based on course description type
  const getDescription = () => {
    if (typeof course.description === 'object') {
      return course.description[language as keyof typeof course.description] || course.description.en || '';
    }
    return course.description;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{getTitle()}</h1>
          <div className="flex items-center mt-2 text-gray-500">
            {getStatusBadge()}
            <span className="mx-2">•</span>
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(course.start_date).toLocaleDateString(
                language === 'en' ? 'en-US' : 'de-DE'
              )}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline"
            onClick={() => navigate('/dashboard/courses')}
          >
            {language === 'en' ? 'Back to My Courses' : 'Zurück zu Meinen Kursen'}
          </Button>
          
          {enrollment && (
            <Button 
              onClick={() => navigate(`/course/${id}`)}
              variant="secondary"
            >
              {language === 'en' ? 'View Course Details' : 'Kursdetails anzeigen'}
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              {language === 'en' ? 'Course Overview' : 'Kursübersicht'}
            </h2>
            <p className="text-gray-700">{getDescription()}</p>
            
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm text-gray-500">
                  {language === 'en' ? 'Duration' : 'Dauer'}
                </h3>
                <p className="font-medium flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  {course.duration}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500">
                  {language === 'en' ? 'Level' : 'Niveau'}
                </h3>
                <p className="font-medium mt-1">{course.level}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500">
                  {language === 'en' ? 'Format' : 'Format'}
                </h3>
                <p className="font-medium mt-1">{course.format}</p>
              </div>
            </div>
          </div>
          
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              {language === 'en' ? 'Course Content' : 'Kursinhalt'}
            </h2>
            
            {syllabusLoading ? (
              <div className="py-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : syllabus && syllabus.length > 0 ? (
              <div className="space-y-4">
                {syllabus.map((item, index) => (
                  <div 
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="bg-primary/10 text-primary h-7 w-7 rounded-full flex items-center justify-center mr-3">
                          {index + 1}
                        </span>
                        <h3 className="font-medium">{item.title}</h3>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => handleViewContent(item.id)}
                      >
                        {language === 'en' ? 'View' : 'Ansehen'}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 ml-10">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                {language === 'en' 
                  ? 'No content available for this course yet.' 
                  : 'Noch keine Inhalte für diesen Kurs verfügbar.'}
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              {language === 'en' ? 'Your Progress' : 'Ihr Fortschritt'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">
                    {language === 'en' ? 'Overall Completion' : 'Gesamtabschluss'}
                  </span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-medium mb-2">
                  {language === 'en' ? 'Status' : 'Status'}
                </h3>
                <div className="flex items-center text-sm">
                  {enrollmentStatus === 'completed' ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>
                        {language === 'en' 
                          ? 'You have completed this course!' 
                          : 'Sie haben diesen Kurs abgeschlossen!'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Book className="h-5 w-5 text-blue-500 mr-2" />
                      <span>
                        {language === 'en' 
                          ? 'Continue learning to complete this course' 
                          : 'Lernen Sie weiter, um diesen Kurs abzuschließen'}
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-medium mb-2">
                  {language === 'en' ? 'Enrolled on' : 'Eingeschrieben am'}
                </h3>
                <div className="flex items-center text-sm">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span>
                    {enrollment && new Date(enrollment.enrollment_date).toLocaleDateString(
                      language === 'en' ? 'en-US' : 'de-DE', 
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              {language === 'en' ? 'Need Help?' : 'Brauchen Sie Hilfe?'}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {language === 'en' 
                ? 'If you have any questions about this course, please contact our support team.' 
                : 'Wenn Sie Fragen zu diesem Kurs haben, kontaktieren Sie bitte unser Support-Team.'}
            </p>
            <Button className="w-full" variant="outline">
              {language === 'en' ? 'Contact Support' : 'Support kontaktieren'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
