
import { Calendar, Clock, BarChart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Course } from '@/types';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';

interface CourseCardProps {
  course: Course;
  featured?: boolean;
}

const CourseCard = ({ course, featured = false }: CourseCardProps) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  
  const levelColors = {
    'Beginner': 'bg-emerald-500',
    'Intermediate': 'bg-blue-500',
    'Advanced': 'bg-purple-500',
    'Expert': 'bg-orange-500'
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'de-DE', {
      style: 'currency',
      currency: language === 'en' ? 'USD' : 'EUR',
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    addToCart(course.id);
  };

  return (
    <Link 
      to={`/courses/${course.id}`}
      className={cn(
        'group block overflow-hidden transition-all hover-lift',
        featured 
          ? 'rounded-2xl' 
          : 'rounded-xl'
      )}
    >
      <div className={cn(
        'glass flex flex-col h-full border border-gray-200',
        featured 
          ? 'rounded-2xl' 
          : 'rounded-xl'
      )}>
        <div className="relative">
          <div className="aspect-[16/9] w-full overflow-hidden">
            <img
              src={course.imageUrl}
              alt={course.title[language]}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          
          <div className="absolute top-3 right-3">
            <Badge 
              className={cn(
                'text-white border-0',
                levelColors[course.level] || 'bg-gray-500'
              )}
            >
              {course.level}
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-col flex-grow p-5">
          <div className="flex-grow">
            <div className="flex gap-2 mb-3">
              <Badge variant="outline" className="bg-blue-50">
                {course.category}
              </Badge>
              <Badge variant="outline" className="bg-gray-50">
                {course.format}
              </Badge>
            </div>
            
            <h3 className={cn(
              'font-bold text-gray-900 group-hover:text-primary transition-colors',
              featured ? 'text-xl mb-3' : 'text-lg mb-2'
            )}>
              {course.title[language]}
            </h3>
            
            <p className={cn(
              'text-gray-600 line-clamp-2',
              featured ? 'mb-4' : 'mb-3'
            )}>
              {course.shortDescription[language]}
            </p>
          </div>
          
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{new Date(course.startDate).toLocaleDateString(language === 'en' ? 'en-US' : 'de-DE', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-primary font-bold">
                {formatPrice(course.price)}
              </div>
              <div className="flex items-center gap-1">
                <BarChart className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-gray-600">{t('courses.instructor')} {course.instructor}</span>
              </div>
            </div>
            
            <Button 
              onClick={handleAddToCart} 
              className="w-full mt-4 gap-2 bg-[#007bff] hover:bg-[#0069d9] text-white"
            >
              <ShoppingCart className="h-4 w-4" />
              {t('courses.addToCart')}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
