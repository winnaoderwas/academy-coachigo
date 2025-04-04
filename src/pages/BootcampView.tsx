
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import BootcampCard from '@/components/BootcampCard';
import FilterBar from '@/components/FilterBar';
import { supabase } from '@/integrations/supabase/client';
import { Course, CourseLevel, CourseFormat, CourseCategory, CourseType } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

type SortOption = 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc';

const BootcampView = () => {
  const { language } = useLanguage();
  const [activeFilters, setActiveFilters] = useState({
    level: 'all' as CourseLevel | 'all',
    format: 'all' as CourseFormat | 'all',
    category: 'all' as CourseCategory | 'all'
  });
  
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('date-asc');

  // Fetch courses from Supabase
  const { data: courses = [], isLoading, isError } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      console.log('Fetching all courses');
      
      try {
        const { data, error } = await supabase
          .from('courses')
          .select(`
            id,
            title,
            description,
            duration,
            level,
            format,
            price,
            category,
            start_date,
            image_url,
            instructor,
            course_syllabus (
              id,
              order_num,
              title,
              description
            ),
            course_objectives (
              id,
              order_num,
              objective
            )
          `)
          .eq('course_type', 'bootcamp')
          .order('start_date', { ascending: true });
          
        if (error) {
          console.error('Error fetching courses:', error);
          throw error;
        }

        console.log('Fetched courses data:', data);

        // Transform the database format to our app's format
        return data.map(courseData => ({
          id: courseData.id,
          title: typeof courseData.title === 'object' ? courseData.title : { en: courseData.title || '', de: courseData.title || '' },
          shortDescription: { en: '', de: '' }, // We don't have short_description in the database yet
          description: typeof courseData.description === 'object' ? courseData.description : { en: courseData.description || '', de: courseData.description || '' },
          duration: courseData.duration,
          level: courseData.level as CourseLevel,
          format: courseData.format as CourseFormat,
          price: courseData.price,
          category: courseData.category as CourseCategory,
          startDate: courseData.start_date,
          imageUrl: courseData.image_url,
          instructor: courseData.instructor,
          interval: 'Weekly', // Default value since column doesn't exist
          maxParticipants: 30, // Default value since column doesn't exist
          targetGroup: { en: '', de: '' }, // Default empty object since column doesn't exist
          syllabus: (courseData.course_syllabus || [])
            .sort((a, b) => a.order_num - b.order_num)
            .map(item => ({
              title: typeof item.title === 'object' ? item.title : { en: item.title || '', de: item.title || '' },
              description: typeof item.description === 'object' ? item.description : { en: item.description || '', de: item.description || '' }
            })),
          objectives: (courseData.course_objectives || [])
            .sort((a, b) => a.order_num - b.order_num)
            .map(item => typeof item.objective === 'object' ? item.objective : { en: item.objective || '', de: item.objective || '' })
        })) as Course[];
      } catch (error) {
        console.error('Error in bootcamp query:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  // Sort and filter courses when activeFilters, sortOption, or courses change
  useEffect(() => {
    if (!courses) return;
    
    // First apply filters
    let filtered = courses.filter(course => {
      const levelMatch = activeFilters.level === 'all' || course.level === activeFilters.level;
      const formatMatch = activeFilters.format === 'all' || course.format === activeFilters.format;
      const categoryMatch = activeFilters.category === 'all' || course.category === activeFilters.category;
      
      return levelMatch && formatMatch && categoryMatch;
    });
    
    // Then apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'date-asc':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'date-desc':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });
    
    setFilteredCourses(filtered);
  }, [activeFilters, sortOption, courses]);

  const handleLevelChange = (level: CourseLevel | 'all') => {
    setActiveFilters(prev => ({ ...prev, level }));
  };

  const handleFormatChange = (format: CourseFormat | 'all') => {
    setActiveFilters(prev => ({ ...prev, format }));
  };

  const handleCategoryChange = (category: CourseCategory | 'all') => {
    setActiveFilters(prev => ({ ...prev, category }));
  };

  const handleClearFilters = () => {
    setActiveFilters({
      level: 'all',
      format: 'all',
      category: 'all'
    });
    setSortOption('date-asc');
  };

  const getSortLabel = () => {
    switch (sortOption) {
      case 'date-asc':
        return language === 'en' ? 'Date (Ascending)' : 'Datum (Aufsteigend)';
      case 'date-desc':
        return language === 'en' ? 'Date (Descending)' : 'Datum (Absteigend)';
      case 'price-asc':
        return language === 'en' ? 'Price (Low to High)' : 'Preis (Niedrig zu Hoch)';
      case 'price-desc':
        return language === 'en' ? 'Price (High to Low)' : 'Preis (Hoch zu Niedrig)';
      default:
        return language === 'en' ? 'Sort by' : 'Sortieren nach';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 animate-fade-in">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-4">
              {language === 'en' ? 'Browse Our Bootcamps' : 'Unsere Bootcamps durchsuchen'}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {language === 'en' ? 'Bootcamps for Every Level' : 'Bootcamps für jedes Thema'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              {language === 'en'
                ? 'Explore our comprehensive range of AI courses designed to take you from beginner to expert. Filter by level, format, and category to find the perfect match for your learning journey.'
                : 'Entdecken Sie unser umfassendes Angebot an Bootcamps, die darauf ausgelegt sind, Sie vom Anfänger zum Experten zu führen. Filtern Sie nach Niveau, Format und Kategorie, um den perfekten Kurs für Ihren Lernweg zu finden.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <FilterBar
                onLevelChange={handleLevelChange}
                onFormatChange={handleFormatChange}
                onCategoryChange={handleCategoryChange}
                onClearFilters={handleClearFilters}
                activeFilters={activeFilters}
              />
            </div>
            
            <div className="lg:col-span-3">
              {/* Sorting Dropdown */}
              <div className="flex justify-end mb-6">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 bg-white text-sm font-medium">
                    {language === 'en' ? 'Sort by: ' : 'Sortieren nach: '}
                    <span className="font-semibold">{getSortLabel()}</span>
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortOption('date-asc')}>
                      {language === 'en' ? 'Date (Ascending)' : 'Datum (Aufsteigend)'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption('date-desc')}>
                      {language === 'en' ? 'Date (Descending)' : 'Datum (Absteigend)'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption('price-asc')}>
                      {language === 'en' ? 'Price (Low to High)' : 'Preis (Niedrig zu Hoch)'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption('price-desc')}>
                      {language === 'en' ? 'Price (High to Low)' : 'Preis (Hoch zu Niedrig)'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, index) => (
                    <div 
                      key={index} 
                      className="rounded-xl bg-gray-100 animate-pulse h-96"
                    />
                  ))}
                </div>
              ) : isError ? (
                <div className="text-center py-12 glass rounded-xl animate-fade-in">
                  <h3 className="text-xl font-semibold mb-2">
                    {language === 'en' ? 'Error loading bootcamps' : 'Fehler beim Laden der Bootcamps'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {language === 'en'
                      ? 'We encountered an error while loading the courses. Please try again later.'
                      : 'Beim Laden der Bootcamps ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.'}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    {language === 'en' ? 'Refresh page' : 'Seite aktualisieren'}
                  </button>
                </div>
              ) : filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredCourses.map((course, index) => (
                    <div 
                      key={course.id} 
                      className={`animate-fade-in`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <BootcampCard course={course} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 glass rounded-xl animate-fade-in">
                  <h3 className="text-xl font-semibold mb-2">
                    {language === 'en' ? 'No bootcamps found' : 'Keine Bootcamps gefunden'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {language === 'en'
                      ? 'We couldn\'t find any bootcamps matching your filters.'
                      : 'Wir konnten keine Bootcamps finden, die Ihren Filtern entsprechen.'}
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    {language === 'en' ? 'Clear all filters' : 'Alle Filter zurücksetzen'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BootcampView;
