
import { Quote } from 'lucide-react';
import { Testimonial } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  const { language } = useLanguage();
  
  // Handle content that might be localized or a simple string
  const getContent = () => {
    if (typeof testimonial.content === 'object' && testimonial.content !== null) {
      return testimonial.content[language as keyof typeof testimonial.content] || 
             testimonial.content.en || 
             '';
    }
    return testimonial.content || '';
  };
  
  return (
    <div className="glass rounded-xl p-6 hover-lift h-full flex flex-col">
      <div className="mb-6">
        <Quote className="h-8 w-8 text-primary/40" />
      </div>
      
      <p className="text-gray-700 mb-6 flex-grow">
        "{getContent()}"
      </p>
      
      <div className="flex items-center mt-auto">
        <div className="mr-4">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="h-12 w-12 rounded-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
          <p className="text-sm text-gray-500">
            {testimonial.role} at {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
