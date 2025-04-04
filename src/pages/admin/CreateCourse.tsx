
import { useLanguage } from '@/contexts/LanguageContext';
import CourseForm from '@/components/admin/CourseForm';

const CreateCourse = () => {
  const { language } = useLanguage();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        {language === 'en' ? 'Create New Course' : 'Neuen Kurs erstellen'}
      </h1>
      <CourseForm isEdit={false} />
    </div>
  );
};

export default CreateCourse;
