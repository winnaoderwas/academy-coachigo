
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import TestimonialCard from '@/components/TestimonialCard';
import { testimonials } from '@/data/testimonials';
import { useLanguage } from '@/contexts/LanguageContext';

const TestimonialsPage = () => {
  const { language } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {language === 'en' ? 'Student Testimonials' : 'Kundenstimmen'}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {language === 'en'
                ? 'Hear directly from our students about their experiences and how our courses have helped them advance their careers in AI.'
                : 'Hören Sie direkt von unseren Studenten über ihre Erfahrungen und wie unsere Kurse ihnen geholfen haben, ihre Karriere in KI voranzutreiben.'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Testimonials Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id}>
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              {language === 'en' 
                ? 'Join Our Growing Community of AI Professionals' 
                : 'Werden Sie Teil unserer wachsenden Gemeinschaft von KI-Fachleuten'}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {language === 'en'
                ? 'Start your journey to AI mastery today and become one of our success stories.'
                : 'Beginnen Sie noch heute Ihre Reise zur KI-Meisterschaft und werden Sie eine unserer Erfolgsgeschichten.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/courses" 
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                {language === 'en' ? 'Explore Courses' : 'Kurse entdecken'}
              </a>
              <a 
                href="/about" 
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                {language === 'en' ? 'Learn About Us' : 'Über uns'}
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default TestimonialsPage;
