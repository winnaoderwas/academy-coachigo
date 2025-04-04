
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, BarChart } from 'lucide-react';
import { Course } from '@/types';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface CourseHeaderProps {
  course: Course;
  levelColors: Record<string, string>;
}

const CourseHeader = ({ course, levelColors }: CourseHeaderProps) => {
  const { language } = useLanguage();

  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge 
          className={cn(
            'text-white border-0',
            levelColors[course.level] || 'bg-gray-500'
          )}
        >
          {course.level}
        </Badge>
        <Badge variant="outline" className="bg-blue-50">
          {course.category}
        </Badge>
        <Badge variant="outline" className="bg-gray-50">
          {course.format}
        </Badge>
      </div>
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
        {course.title[language]}
      </h1>
      
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600">
        <div className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-gray-400" />
          <span>{course.duration}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-gray-400" />
          <span>
            {language === 'en' ? 'Starts ' : 'Beginnt am '}
            {new Date(course.startDate).toLocaleDateString(
              language === 'en' ? 'en-US' : 'de-DE', 
              { month: 'long', day: 'numeric', year: 'numeric' }
            )}
          </span>
        </div>
        <div className="flex items-center">
          <BarChart className="h-5 w-5 mr-2 text-gray-400" />
          <span>
            {language === 'en' ? 'Instructor: ' : 'Kursleiter: '}
            {course.instructor}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
