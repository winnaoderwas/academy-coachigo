
import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { Course } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from '@/integrations/supabase/client';

interface CourseSyllabusProps {
  course: Course;
}

interface SyllabusItem {
  id: string;
  title: string;
  description: string;
  order_num: number;
}

const CourseSyllabus = ({ course }: CourseSyllabusProps) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [syllabus, setSyllabus] = useState<SyllabusItem[]>([]);

  useEffect(() => {
    fetchSyllabus();
  }, [course.id]);

  const fetchSyllabus = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('course_syllabus')
        .select('*')
        .eq('course_id', course.id)
        .order('order_num', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setSyllabus(data);
      } else {
        // Fallback to static data from course object if no database entries
        setSyllabus(course.syllabus.map((item, index) => ({
          id: `static-${index}`,
          title: item.title[language],
          description: item.description[language],
          order_num: index
        })));
      }
    } catch (error) {
      console.error('Error fetching syllabus:', error);
      // Fallback to static data in case of error
      setSyllabus(course.syllabus.map((item, index) => ({
        id: `static-${index}`,
        title: item.title[language],
        description: item.description[language],
        order_num: index
      })));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-primary" />
          {language === 'en' ? 'Course Syllabus' : 'Kursplan'}
        </h2>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <BookOpen className="h-5 w-5 mr-2 text-primary" />
        {language === 'en' ? 'Course Syllabus' : 'Kursplan'}
      </h2>
      
      <Accordion type="single" collapsible className="w-full">
        {syllabus.map((item, index) => (
          <AccordionItem key={item.id} value={`item-${index}`}>
            <AccordionTrigger className="text-lg font-medium hover:text-primary">
              {`${language === 'en' ? 'Module' : 'Modul'} ${index + 1}: ${item.title}`}
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 pl-4">
              {item.description}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CourseSyllabus;
