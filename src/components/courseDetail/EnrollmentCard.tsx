
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Course } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Clock, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EnrollmentCardProps {
  course: Course;
  formatPrice: (price: number) => string;
}

const EnrollmentCard = ({ course, formatPrice }: EnrollmentCardProps) => {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(course.id);
  };

  return (
    <div className="glass rounded-xl p-6 sticky top-32">
      <div className="text-3xl font-bold text-gray-900 mb-4">
        {formatPrice(course.price)}
      </div>
      
      {/* Course details (duration, start date, format) */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
          <div>
            <p className="font-medium">
              {language === 'en' ? 'Duration' : 'Dauer'}
            </p>
            <p className="text-gray-600 text-sm">{course.duration}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
          <div>
            <p className="font-medium">
              {language === 'en' ? 'Start Date' : 'Verfügbar ab:'}
            </p>
            <p className="text-gray-600 text-sm">
              {new Date(course.startDate).toLocaleDateString(
                language === 'en' ? 'en-US' : 'de-DE', 
                { month: 'long', day: 'numeric', year: 'numeric' }
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <Users className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
          <div>
            <p className="font-medium">
              {language === 'en' ? 'Format' : 'Format'}
            </p>
            <p className="text-gray-600 text-sm">{course.format}</p>
          </div>
        </div>
      </div>
      
      {/* Single enrollment button */}
      <Button 
        size="lg"
        className="w-full bg-[#007bff] hover:bg-[#0069d9] text-white py-6 text-base font-normal"
        onClick={() => {
          handleAddToCart();
          navigate('/cart');
        }}
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        {language === 'en' ? 'Add to Cart' : 'In den Warenkorb'}
      </Button>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        {language === 'en' 
          ? '30-day money-back guarantee' 
          : '30-Tage-Geld-zurück-Garantie'}
      </div>
    </div>
  );
};

export default EnrollmentCard;
