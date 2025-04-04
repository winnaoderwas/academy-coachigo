
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

export interface CourseFormProps {
  courseId?: string;
  isEdit: boolean;
  initialCourse?: any;
}

const CourseForm = ({ courseId, isEdit, initialCourse }: CourseFormProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialCourse?.start_date ? new Date(initialCourse.start_date) : undefined
  );

  const form = useForm({
    defaultValues: {
      title: initialCourse?.title || '',
      course_type: initialCourse?.course_type || 'course',
      description: initialCourse?.description || '',
      price: initialCourse?.price || '',
      duration: initialCourse?.duration || '',
      level: initialCourse?.level || 'Beginner',
      format: initialCourse?.format || 'Online',
      category: initialCourse?.category || 'Technology',
      instructor: initialCourse?.instructor || '',
      target_group: initialCourse?.target_group || '',
      image_url: initialCourse?.image_url || 'https://source.unsplash.com/random/800x600/?education',
      openinfo_video: initialCourse?.openinfo_video || '',
      courseinfo_video: initialCourse?.courseinfo_video || '',
    }
  });

  const onSubmit = async (data: any) => {
    if (!startDate) {
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: language === 'en' 
          ? 'Please select a start date' 
          : 'Bitte wählen Sie ein Startdatum',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      const courseData = {
        ...data,
        start_date: startDate.toISOString(),
      };
      
      if (isEdit && courseId) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', courseId);
        
        if (error) throw error;
        
        toast({
          title: language === 'en' ? 'Success' : 'Erfolg',
          description: language === 'en' 
            ? 'Course updated successfully' 
            : 'Kurs erfolgreich aktualisiert',
        });
      } else {
        // Create new course
        const { data: newCourse, error } = await supabase
          .from('courses')
          .insert(courseData)
          .select('id')
          .single();
        
        if (error) throw error;
        
        toast({
          title: language === 'en' ? 'Success' : 'Erfolg',
          description: language === 'en' 
            ? 'Course created successfully' 
            : 'Kurs erfolgreich erstellt',
        });
        
        // Navigate to the edit page for the new course
        navigate(`/admin/courses/edit/${newCourse.id}`);
        return;
      }
      
      // For edits, stay on the same page
      if (!isEdit) {
        navigate('/admin/courses');
      }
    } catch (error: any) {
      console.error('Error saving course:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Title' : 'Titel'}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={language === 'en' ? 'Course title' : 'Kurstitel'} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Description' : 'Beschreibung'}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={language === 'en' ? 'Course description' : 'Kursbeschreibung'} 
                      rows={6}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'en' ? 'Price (€)' : 'Preis (€)'}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="99.99" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'en' ? 'Duration' : 'Dauer'}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={language === 'en' ? 'e.g. 8 weeks' : 'z.B. 8 Wochen'} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormLabel htmlFor="start_date">
                {language === 'en' ? 'Start Date' : 'Startdatum'}
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, 'PPP', { locale: language === 'de' ? de : undefined })
                    ) : (
                      <span className="text-muted-foreground">
                        {language === 'en' ? 'Select date' : 'Datum auswählen'}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
            <FormField
              control={form.control}
              name="course_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Type' : 'Type'}</FormLabel>
                  <FormControl>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      {...field}
                    >
                      <option value="course">{language === 'en' ? 'Course' : 'Kurs'}</option>
                      <option value="bootcamp">{language === 'en' ? 'Bootcamp' : 'Bootcamp'}</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
            
          </div>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Level' : 'Niveau'}</FormLabel>
                  <FormControl>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      {...field}
                    >
                      <option value="Beginner">{language === 'en' ? 'Beginner' : 'Anfänger'}</option>
                      <option value="Intermediate">{language === 'en' ? 'Intermediate' : 'Mittelstufe'}</option>
                      <option value="Advanced">{language === 'en' ? 'Advanced' : 'Fortgeschritten'}</option>
                      <option value="Expert">{language === 'en' ? 'Expert' : 'Experte'}</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Format' : 'Format'}</FormLabel>
                  <FormControl>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      {...field}
                    >
                      <option value="Online">Online</option>
                      <option value="In-Person">{language === 'en' ? 'In-Person' : 'Vor Ort'}</option>
                      <option value="Hybrid">{language === 'en' ? 'Hybrid' : 'Hybrid'}</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Category' : 'Kategorie'}</FormLabel>
                  <FormControl>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      {...field}
                    >
                      <option value="Technology">{language === 'en' ? 'Technology' : 'Technologie'}</option>
                      <option value="Business">{language === 'en' ? 'Business' : 'Wirtschaft'}</option>
                      <option value="Design">{language === 'en' ? 'Design' : 'Design'}</option>
                      <option value="Marketing">{language === 'en' ? 'Marketing' : 'Marketing'}</option>
                      <option value="Personal Development">{language === 'en' ? 'Personal Development' : 'Persönliche Entwicklung'}</option>
                      <option value="Health">{language === 'en' ? 'Health' : 'Gesundheit'}</option>
                      <option value="Other">{language === 'en' ? 'Other' : 'Sonstiges'}</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="instructor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Instructor' : 'Dozent'}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={language === 'en' ? 'Instructor name' : 'Name des Dozenten'} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="target_group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Target Group' : 'Zielgruppe'}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={language === 'en' ? 'Who is this course for?' : 'Für wen ist dieser Kurs?'} 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Image URL' : 'Bild-URL'}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={language === 'en' ? 'Course image URL' : 'Kurs-Bild-URL'} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New video fields */}
            <FormField
              control={form.control}
              name="openinfo_video"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Open Info Video URL' : 'Offenes Info-Video URL'}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={language === 'en' ? 'Public information video URL' : 'Öffentliches Informationsvideo URL'} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseinfo_video"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Course Info Video URL' : 'Kurs-Info-Video URL'}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={language === 'en' ? 'Course information video URL' : 'Kursinformationsvideo URL'} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/courses')}
            disabled={loading}
          >
            {language === 'en' ? 'Cancel' : 'Abbrechen'}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {isEdit 
              ? (language === 'en' ? 'Update Course' : 'Kurs aktualisieren') 
              : (language === 'en' ? 'Create Course' : 'Kurs erstellen')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CourseForm;
