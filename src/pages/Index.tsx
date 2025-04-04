import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import Hero from '@/components/Hero';
import NavBar from '@/components/NavBar';
import CourseCard from '@/components/CourseCard';
import TestimonialCard from '@/components/TestimonialCard';
import Footer from '@/components/Footer';
import { testimonials } from '@/data/testimonials';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types';

const Index = () => {
  const [isVisible, setIsVisible] = useState({
    features: false,
    courses: false,
    testimonials: false
  });

  // Fetch featured courses from Supabase
  const { data: featuredCourses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ['featuredCourses'],
    queryFn: async () => {
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
            instructor
          `)
          .limit(3)
          .order('start_date', { ascending: true });
          
        if (error) {
          console.error('Error fetching featured courses:', error);
          return [];
        }

        // Transform the database format to our app's format
        return data.map(courseData => ({
          id: courseData.id,
          title: courseData.title || { en: '', de: '' },
          shortDescription: { en: '', de: '' }, // No short description in DB yet
          description: courseData.description || { en: '', de: '' },
          duration: courseData.duration,
          level: courseData.level,
          format: courseData.format,
          price: courseData.price,
          category: courseData.category,
          startDate: courseData.start_date,
          imageUrl: courseData.image_url,
          instructor: courseData.instructor,
          interval: 'Weekly', // Default value since column doesn't exist
          maxParticipants: 30, // Default value since column doesn't exist
          targetGroup: { en: '', de: '' }, // Default empty object since column doesn't exist
          syllabus: [],  // We don't need syllabus for featured courses
          objectives: [] // We don't need objectives for featured courses
        })) as Course[];
      } catch (error) {
        console.error('Error in featured courses query:', error);
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      const features = document.getElementById('features');
      const courseSection = document.getElementById('courses');
      const testimonialSection = document.getElementById('testimonials');
      
      if (features) {
        const rect = features.getBoundingClientRect();
        setIsVisible(prev => ({ 
          ...prev, 
          features: rect.top < window.innerHeight * 0.8 
        }));
      }
      
      if (courseSection) {
        const rect = courseSection.getBoundingClientRect();
        setIsVisible(prev => ({ 
          ...prev, 
          courses: rect.top < window.innerHeight * 0.8 
        }));
      }
      
      if (testimonialSection) {
        const rect = testimonialSection.getBoundingClientRect();
        setIsVisible(prev => ({ 
          ...prev, 
          testimonials: rect.top < window.innerHeight * 0.8 
        }));
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <Hero />
      
      {/* Features Section */}
      <section 
        id="features" 
        className="py-20 bg-gradient-to-b from-white to-blue-50"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-700 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Why Choose Our AI Institute?
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-700 delay-100 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              We offer a unique learning experience designed to transform beginners into AI professionals through hands-on practice and expert guidance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Industry Expert Instructors",
                description: "Learn from professionals with extensive experience at leading AI companies and research institutions.",
                icon: "👨‍🏫",
                delay: "delay-150"
              },
              {
                title: "Hands-on Projects",
                description: "Apply your knowledge through real-world projects that build your portfolio and demonstrate your skills.",
                icon: "💻",
                delay: "delay-300"
              },
              {
                title: "Job-Ready Curriculum",
                description: "Our courses are designed in collaboration with industry partners to ensure you learn the most relevant skills.",
                icon: "📚",
                delay: "delay-450"
              },
              {
                title: "Flexible Learning Options",
                description: "Choose from online, offline, and hybrid courses to fit your schedule and learning preferences.",
                icon: "🕒",
                delay: "delay-150"
              },
              {
                title: "Community Support",
                description: "Join a community of AI enthusiasts and professionals for networking and collaboration opportunities.",
                icon: "👥",
                delay: "delay-300"
              },
              {
                title: "Career Services",
                description: "Get support in your job search with resume reviews, interview preparation, and industry connections.",
                icon: "🚀",
                delay: "delay-450"
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className={`glass rounded-xl p-6 hover-lift transition-all duration-700 ${isVisible.features ? `opacity-100 translate-y-0 ${feature.delay}` : 'opacity-0 translate-y-10'}`}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className={`text-center transition-all duration-700 delay-500 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Button 
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white text-base px-8"
            >
              <Link to="/about">
                Learn More About Us <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Courses Section */}
      <section 
        id="courses" 
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-700 ${isVisible.courses ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Featured Courses
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-700 delay-100 ${isVisible.courses ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Discover our most popular AI courses designed to help you master cutting-edge technologies and advance your career.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {isLoadingCourses ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : featuredCourses.length > 0 ? (
              featuredCourses.map((course, index) => (
                <div 
                  key={course.id}
                  className={`transition-all duration-700 ${isVisible.courses ? `opacity-100 translate-y-0 delay-${index * 150 + 150}` : 'opacity-0 translate-y-10'}`}
                >
                  <CourseCard course={course} />
                </div>
              ))
            ) : (
              // Fallback in case no courses are found
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">No courses available at the moment. Check back soon!</p>
              </div>
            )}
          </div>
          
          <div className={`text-center transition-all duration-700 delay-600 ${isVisible.courses ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Button 
              asChild
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white text-base px-8"
            >
              <Link to="/courses">
                View All Courses <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section 
        id="testimonials" 
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-700 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              What Our Students Say
            </h2>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-700 delay-100 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Hear from our alumni about their experiences and how our courses helped them advance their careers in AI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`transition-all duration-700 ${isVisible.testimonials ? `opacity-100 translate-y-0 delay-${index * 150 + 150}` : 'opacity-0 translate-y-10'}`}
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fade-in">
            Ready to Begin Your AI Journey?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 animate-fade-in">
            Join thousands of students who have transformed their careers with our expert-led AI courses.
          </p>
          <Button 
            asChild
            size="lg"
            variant="secondary"
            className="animate-scale-in text-primary font-semibold px-8 py-6 text-base"
          >
            <Link to="/courses">
              Explore Courses Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
