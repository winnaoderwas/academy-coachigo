
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import CourseForm from '@/components/admin/CourseForm';
import SyllabusManager from '@/components/admin/SyllabusManager';
import ObjectivesManager from '@/components/admin/ObjectivesManager';
import SyllabusDetailsManager from '@/components/admin/SyllabusDetailsManager';
import TimetableManager from '@/components/admin/TimetableManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syllabusList, setSyllabusList] = useState<any[]>([]);
  const [selectedSyllabus, setSelectedSyllabus] = useState<string | null>(null);
  const [selectedSyllabusTitle, setSelectedSyllabusTitle] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchCourse();
      fetchSyllabusList();
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
        setCourse(data);
      } else {
        toast({
          title: language === 'en' ? 'Error' : 'Fehler',
          description: language === 'en' ? 'Course not found' : 'Kurs nicht gefunden',
          variant: 'destructive',
        });
        navigate('/admin/courses');
      }
    } catch (error: any) {
      console.error('Error fetching course:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
      navigate('/admin/courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchSyllabusList = async () => {
    try {
      const { data, error } = await supabase
        .from('course_syllabus')
        .select('*')
        .eq('course_id', id)
        .order('order_num', { ascending: true });
      
      if (error) throw error;
      
      setSyllabusList(data || []);
      
      // Set the first syllabus as selected by default if available
      if (data && data.length > 0) {
        setSelectedSyllabus(data[0].id);
        setSelectedSyllabusTitle(data[0].title);
      }
    } catch (error) {
      console.error('Error fetching syllabus list:', error);
    }
  };

  const handleSyllabusChange = (syllabusId: string) => {
    const selectedItem = syllabusList.find(item => item.id === syllabusId);
    setSelectedSyllabus(syllabusId);
    setSelectedSyllabusTitle(selectedItem ? selectedItem.title : '');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/courses')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {language === 'en' ? 'Back to Courses' : 'Zurück zu Kursen'}
        </Button>
        <h1 className="text-2xl font-bold">
          {language === 'en' ? 'Edit Course' : 'Kurs bearbeiten'}
        </h1>
      </div>

      <Tabs defaultValue="general" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="general">
            {language === 'en' ? 'General Information' : 'Allgemeine Informationen'}
          </TabsTrigger>
          <TabsTrigger value="syllabus">
            {language === 'en' ? 'Syllabus' : 'Kursplan'}
          </TabsTrigger>
          <TabsTrigger value="objectives">
            {language === 'en' ? 'Objectives' : 'Lernziele'}
          </TabsTrigger>
          <TabsTrigger value="materials">
            {language === 'en' ? 'Course Materials' : 'Kursmaterialien'}
          </TabsTrigger>
          <TabsTrigger value="timetable">
            {language === 'en' ? 'Sessions' : 'Sitzungen'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <CourseForm courseId={id} isEdit={true} initialCourse={course} />
        </TabsContent>
        
        <TabsContent value="syllabus">
          {id && <SyllabusManager courseId={id} />}
        </TabsContent>
        
        <TabsContent value="objectives">
          {id && <ObjectivesManager courseId={id} />}
        </TabsContent>
        
        <TabsContent value="materials">
          {id && syllabusList.length > 0 ? (
            <div className="space-y-6">
              <div className="mb-4">
                <label htmlFor="syllabusSelect" className="block text-sm font-medium mb-2">
                  {language === 'en' ? 'Select Module' : 'Modul auswählen'}
                </label>
                <select 
                  id="syllabusSelect"
                  className="w-full p-2 border rounded-md"
                  value={selectedSyllabus || ''}
                  onChange={(e) => handleSyllabusChange(e.target.value)}
                >
                  {syllabusList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {language === 'en' ? `Module ${item.order_num + 1}: ` : `Modul ${item.order_num + 1}: `}
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>

              {selectedSyllabus && (
                <SyllabusDetailsManager 
                  courseId={id} 
                  syllabusId={selectedSyllabus}
                  syllabusTitle={selectedSyllabusTitle}
                />
              )}
            </div>
          ) : (
            <div className="text-center p-6 border border-dashed rounded-lg">
              <p className="text-gray-500 mb-4">
                {language === 'en' 
                  ? 'No modules available. Please create modules in the Syllabus tab first.' 
                  : 'Keine Module verfügbar. Bitte erstellen Sie zuerst Module im Kursplan-Tab.'}
              </p>
              <Button 
                variant="outline" 
                onClick={() => document.querySelector('[data-value="syllabus"]')?.dispatchEvent(new Event('click', { bubbles: true }))}
              >
                {language === 'en' ? 'Go to Syllabus Tab' : 'Zum Kursplan-Tab gehen'}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="timetable">
          {id && <TimetableManager courseId={id} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditCourse;
