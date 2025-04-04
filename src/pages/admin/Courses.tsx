
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  price: number;
  category: string;
  level: string;
  format: string;
  instructor: string;
  created_at: string;
}

const CoursesList = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, price, category, level, format, instructor, created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: language === 'en' 
          ? 'Failed to load courses' 
          : 'Fehler beim Laden der Kurse',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id: string) => {
    if (!confirm(language === 'en' 
      ? 'Are you sure you want to delete this course? This action cannot be undone.' 
      : 'Sind Sie sicher, dass Sie diesen Kurs löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCourses(courses.filter(course => course.id !== id));
      
      toast({
        title: language === 'en' ? 'Success' : 'Erfolg',
        description: language === 'en' 
          ? 'Course deleted successfully' 
          : 'Kurs erfolgreich gelöscht',
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: language === 'en' 
          ? 'Failed to delete course' 
          : 'Fehler beim Löschen des Kurses',
        variant: 'destructive',
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'Course Management' : 'Kursverwaltung'}
        </h1>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-16" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'Course Management' : 'Kursverwaltung'}
        </h1>
        <div className="space-x-2">
          <Button onClick={fetchCourses} variant="outline">
            {language === 'en' ? 'Refresh' : 'Aktualisieren'}
          </Button>
          <Button onClick={() => navigate('/admin/courses/new')}>
            <Plus className="h-4 w-4 mr-1" />
            {language === 'en' ? 'Add Course' : 'Kurs hinzufügen'}
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{language === 'en' ? 'Title' : 'Titel'}</TableHead>
            <TableHead>{language === 'en' ? 'Price' : 'Preis'}</TableHead>
            <TableHead>{language === 'en' ? 'Category' : 'Kategorie'}</TableHead>
            <TableHead>{language === 'en' ? 'Level' : 'Stufe'}</TableHead>
            <TableHead>{language === 'en' ? 'Format' : 'Format'}</TableHead>
            <TableHead>{language === 'en' ? 'Instructor' : 'Dozent'}</TableHead>
            <TableHead className="text-right">{language === 'en' ? 'Actions' : 'Aktionen'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell>{formatPrice(course.price)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{course.category}</Badge>
                </TableCell>
                <TableCell>{course.level}</TableCell>
                <TableCell>{course.format}</TableCell>
                <TableCell>{course.instructor}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/admin/courses/edit/${course.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => deleteCourse(course.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                {language === 'en' ? 'No courses found' : 'Keine Kurse gefunden'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CoursesList;
