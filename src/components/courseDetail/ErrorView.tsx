
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const ErrorView = () => {
  const { language } = useLanguage();

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">
        {language === 'en' ? 'Course Not Found' : 'Kurs nicht gefunden'}
      </h1>
      <p className="text-gray-600 mb-6">
        {language === 'en' 
          ? 'The course you\'re looking for doesn\'t exist or has been removed.' 
          : 'Der gesuchte Kurs existiert nicht oder wurde entfernt.'}
      </p>
      <Button asChild>
        <Link to="/courses">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {language === 'en' ? 'Back to Courses' : 'Zurück zu den Kursen'}
        </Link>
      </Button>
    </div>
  );
};

export default ErrorView;
