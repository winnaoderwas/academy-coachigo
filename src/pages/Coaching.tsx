
import { Book, Calendar, MessageSquare, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import BookingForm from '@/components/BookingForm';

const CoachingPage = () => {
  const { language } = useLanguage();
  
  const coachingTypes = [
    {
      icon: <Video className="h-6 w-6 text-primary" />,
      title: language === 'en' ? 'AI Implementation Coaching' : 'KI-Implementierungs-Coaching',
      description: language === 'en'
        ? 'One-on-one guidance on how to implement AI into your business processes, products, or services. Get personalized advice from AI experts.'
        : 'Individuelle Beratung zur Integration von KI in Ihre Geschäftsprozesse, Produkte oder Dienstleistungen. Erhalten Sie persönliche Beratung von KI-Experten.'
    },
    {
      icon: <Book className="h-6 w-6 text-primary" />,
      title: language === 'en' ? 'Technical Skill Development' : 'Technische Kompetenzentwicklung',
      description: language === 'en'
        ? 'Focused sessions to improve your technical skills in AI programming, prompt engineering, or multimedia production. Bridge specific knowledge gaps.'
        : 'Gezielte Sitzungen zur Verbesserung Ihrer technischen Fähigkeiten in KI-Programmierung, Prompt-Engineering oder Multimedia-Produktion. Schließen Sie spezifische Wissenslücken.'
    },
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: language === 'en' ? 'Project Support' : 'Projektunterstützung',
      description: language === 'en'
        ? 'Get expert help with your AI or multimedia projects. We provide guidance on project planning, implementation, troubleshooting, and optimization.'
        : 'Erhalten Sie professionelle Hilfe bei Ihren KI- oder Multimedia-Projekten. Wir bieten Unterstützung bei Projektplanung, Implementierung, Fehlerbehebung und Optimierung.'
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: language === 'en' ? 'Career Mentoring' : 'Karriere-Mentoring',
      description: language === 'en'
        ? 'Guidance for professionals looking to advance in AI and multimedia fields. Get advice on skill development, job seeking, and career advancement.'
        : 'Beratung für Fachleute, die in den Bereichen KI und Multimedia vorankommen möchten. Erhalten Sie Ratschläge zur Kompetenzentwicklung, Jobsuche und Karriereförderung.'
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <div>
        {/* Hero Section */}  
        <div className="bg-gradient-to-b from-blue-50 to-white pt-24 pb-16 relative">
          {/* Background image with overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{ backgroundImage: 'url(https://assets.iderdex.com/newwork/new-work-7.jpg?auto=format&fit=crop&w=1050&q=80)' }}
          />
          <div className="absolute inset-0 bg-gray-700 opacity-50" /> {/* Gray overlay */}
    
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Coaching</h1>
              <p className="text-xl text-gray-200 leading-relaxed">
                {language === 'en'
                  ? 'Accelerate your learning and project success with personalized 1:1 coaching sessions tailored to your specific needs in AI and multimedia production.'
                  : 'Beschleunigen Sie Ihr Lernen und Ihren Projekterfolg mit personalisierten 1:1-Coaching-Sitzungen, die auf Ihre spezifischen Bedürfnisse in den Bereichen KI und Multimedia-Produktion zugeschnitten sind.'}
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  {language === 'en' ? 'Why Choose 1:1 Coaching?' : 'Warum 1:1-Coaching wählen?'}
                </h2>
                <p className="text-lg text-gray-600">
                  {language === 'en'
                    ? 'Our personalized coaching offers distinct advantages for students and professionals looking to excel in AI and multimedia.'
                    : 'Unser personalisiertes Coaching bietet eindeutige Vorteile für Studenten und Fachleute, die in den Bereichen KI und Multimedia herausragen möchten.'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-xl hover-lift">
                  <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=500&q=80" 
                      alt="Personalized learning" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3">
                    {language === 'en' ? 'Personalized Learning Path' : 'Personalisierter Lernpfad'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en'
                      ? 'Unlike group courses, our 1:1 coaching is completely tailored to your skill level, learning pace, and specific goals in AI and multimedia.'
                      : 'Im Gegensatz zu Gruppenkursen ist unser 1:1-Coaching vollständig auf Ihr Kompetenzlevel, Ihr Lerntempo und Ihre spezifischen Ziele in den Bereichen KI und Multimedia zugeschnitten.'}
                  </p>
                </div>
                
                <div className="glass p-8 rounded-xl hover-lift">
                  <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=500&q=80" 
                      alt="Direct feedback" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3">
                    {language === 'en' ? 'Direct Expert Feedback' : 'Direktes Experten-Feedback'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en'
                      ? 'Receive immediate, constructive feedback on your projects, code, or creative work from experienced AI and multimedia professionals.'
                      : 'Erhalten Sie sofortiges, konstruktives Feedback zu Ihren Projekten, Code oder kreativen Arbeiten von erfahrenen KI- und Multimedia-Experten.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Types of Coaching */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  {language === 'en' ? 'Our Coaching Services' : 'Unsere Coaching-Dienste'}
                </h2>
                <p className="text-lg text-gray-600">
                  {language === 'en'
                    ? 'Discover the different types of coaching we offer to support your journey in AI and multimedia.'
                    : 'Entdecken Sie die verschiedenen Arten von Coaching, die wir anbieten, um Ihre Reise in den Bereichen KI und Multimedia zu unterstützen.'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {coachingTypes.map((type, index) => (
                  <div key={index} className="glass p-6 rounded-xl hover-lift">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      {type.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                    <p className="text-gray-600">{type.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <div className="glass p-8 rounded-xl mb-8">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="md:w-1/2">
                      <img 
                        src="https://assets.iderdex.com/newwork/new-work-6.jpg?auto=format&fit=crop&w=500&q=80" 
                        alt="Coaching session" 
                        className="rounded-lg shadow-md w-full h-auto"
                      />
                    </div>
                    <div className="md:w-1/2 text-left">
                      <h3 className="text-xl font-bold mb-3">
                        {language === 'en' ? 'Flexible Coaching Options' : 'Flexible Coaching-Optionen'}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {language === 'en'
                          ? 'Whether you need a single session to solve a specific problem or regular meetings for ongoing support, our coaching packages can be customized to fit your schedule and budget.'
                          : 'Ob Sie eine einzelne Sitzung benötigen, um ein bestimmtes Problem zu lösen, oder regelmäßige Treffen für kontinuierliche Unterstützung - unsere Coaching-Pakete können an Ihren Zeitplan und Ihr Budget angepasst werden.'}
                      </p>
                      <Button asChild>
                        <Link to="#booking-form">
                          {language === 'en' ? 'Book Your Free Consultation' : 'Buchen Sie Ihr kostenloses Erstgespräch'}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Booking Form Section */}
        <section id="booking-form" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  {language === 'en' ? 'Book Your 1:1 Coaching Session' : 'Buchen Sie Ihre 1:1-Coaching-Sitzung'}
                </h2>
                <p className="text-lg text-gray-600">
                  {language === 'en'
                    ? 'Start with a free consultation to discuss your needs and goals. We will create a personalized coaching plan just for you.'
                    : 'Beginnen Sie mit einer kostenlosen Beratung, um Ihre Bedürfnisse und Ziele zu besprechen. Wir erstellen einen personalisierten Coaching-Plan speziell für Sie.'}
                </p>
              </div>
              
              <BookingForm requestType="coaching" />
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </div>
  );
};

export default CoachingPage;
