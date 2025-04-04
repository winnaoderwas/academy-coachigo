
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/CourseCard';
import { Course } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface RelatedCoursesProps {
  courses: Course[];
}

const RelatedCourses = ({ courses }: RelatedCoursesProps) => {
  const { language } = useLanguage();

  if (!courses.length) return null;

  return (
    <div className="mt-20 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">
        {language === 'en' ? 'You May Also Like' : 'Das könnte Ihnen auch gefallen'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Button 
          asChild
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white text-base px-8"
        >
          <Link to="/courses">
            {language === 'en' ? 'View All Courses' : 'Alle Kurse anzeigen'} 
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RelatedCourses;
