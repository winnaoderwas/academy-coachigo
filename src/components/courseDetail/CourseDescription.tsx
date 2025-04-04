
import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { Course } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface CourseDescriptionProps {
  course: Course;
}

interface ObjectiveItem {
  id: string;
  objective: string;
  order_num: number;
}

const CourseDescription = ({ course }: CourseDescriptionProps) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [objectives, setObjectives] = useState<ObjectiveItem[]>([]);

  useEffect(() => {
    fetchObjectives();
  }, [course.id]);

  const fetchObjectives = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('course_objectives')
        .select('*')
        .eq('course_id', course.id)
        .order('order_num', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setObjectives(data);
      } else {
        // Fallback to static data from course object if no database entries
        setObjectives(course.objectives.map((objective, index) => ({
          id: `static-${index}`,
          objective: objective[language],
          order_num: index
        })));
      }
    } catch (error) {
      console.error('Error fetching objectives:', error);
      // Fallback to static data in case of error
      setObjectives(course.objectives.map((objective, index) => ({
        id: `static-${index}`,
        objective: objective[language],
        order_num: index
      })));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-xl p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">
        {language === 'en' ? 'About This Course' : 'Über diesen Kurs'}
      </h2>
      <p className="text-gray-700 leading-relaxed mb-6">{course.description[language]}</p>
      
      <h3 className="text-xl font-semibold mb-3">
        {language === 'en' ? 'What You\'ll Learn' : 'Was Sie lernen werden'}
      </h3>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start animate-pulse">
              <div className="h-5 w-5 rounded-full bg-emerald-200 mr-3 mt-0.5"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {objectives.map((objective) => (
            <div key={objective.id} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{objective.objective}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseDescription;
