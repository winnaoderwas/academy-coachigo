
import { Calendar, Target, Award, Book, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import BookingForm from '@/components/BookingForm';

const BootcampPage = () => {
  const { t, language } = useLanguage();
  
  const bootcampFeatures = [
    {
      icon: <Video className="h-6 w-6 text-primary" />,
      title: language === 'en' ? 'Intensive Learning Experience' : 'Intensive Lernerfahrung',
      description: language === 'en'
        ? 'Our bootcamps provide concentrated, hands-on learning over a short period (typically a weekend) to rapidly develop your skills in AI and multimedia.'
        : 'Unsere Bootcamps bieten konzentriertes, praktisches Lernen über einen kurzen Zeitraum (typischerweise ein Wochenende), um Ihre Fähigkeiten in KI und Multimedia schnell zu entwickeln.'
    },
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      title: language === 'en' ? 'Small Group Format' : 'Kleingruppen-Format',
      description: language === 'en'
        ? 'With a limited number of participants (8-15 people), our bootcamps ensure personalized attention while fostering valuable peer collaboration and networking.'
        : 'Mit einer begrenzten Teilnehmerzahl (8-15 Personen) gewährleisten unsere Bootcamps individuelle Betreuung und fördern gleichzeitig wertvolle Zusammenarbeit und Networking zwischen den Teilnehmern.'
    },
    {
      icon: <Book className="h-6 w-6 text-primary" />,
      title: language === 'en' ? 'Focused Topics' : 'Fokussierte Themen',
      description: language === 'en'
        ? 'We dive deep into specific AI and multimedia topics like business AI implementation, content creation, camera presence, and virtual meeting mastery.'
        : 'Wir tauchen tief in spezifische KI- und Multimedia-Themen ein, wie KI-Implementierung für Unternehmen, Content-Erstellung, Kamera-Präsenz und virtuelle Meeting-Beherrschung.'
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: language === 'en' ? 'Professional Development' : 'Berufliche Entwicklung',
      description: language === 'en'
        ? 'Designed for entrepreneurs, self-employed professionals, coaches, and trainers who want to quickly develop practical AI and multimedia skills for their business.'
        : 'Für Unternehmer, Selbständige, Coaches und Trainer konzipiert, die schnell praktische KI- und Multimedia-Fähigkeiten für ihr Geschäft entwickeln möchten.'
    }
  ];
  
  const bootcampTypes = [
    {
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=500&q=80",
      title: language === 'en' ? 'AI for Business' : 'KI für Unternehmen',
      description: language === 'en'
        ? 'Learn how to implement AI tools and workflows in your business to increase efficiency, improve customer service, and drive innovation.'
        : 'Lernen Sie, wie Sie KI-Tools und Workflows in Ihrem Unternehmen implementieren können, um die Effizienz zu steigern, den Kundenservice zu verbessern und Innovation zu fördern.'
    },
    {
      image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=500&q=80",
      title: language === 'en' ? 'Content Creation Mastery' : 'Content-Erstellung',
      description: language === 'en'
        ? 'Master the art of creating high-quality multimedia content using AI tools for graphics, video, audio, and text generation.'
        : 'Meistern Sie die Kunst, hochwertige Multimedia-Inhalte mit KI-Tools für Grafik, Video, Audio und Texterstellung zu erstellen.'
    },
    {
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=500&q=80",
      title: language === 'en' ? 'On-Camera Performance' : 'Performance vor der Kamera',
      description: language === 'en'
        ? 'Develop confidence and skill in presenting yourself professionally on camera for videos, webinars, and online presentations.'
        : 'Entwickeln Sie Selbstvertrauen und Fähigkeiten, um sich professionell vor der Kamera für Videos, Webinare und Online-Präsentationen zu präsentieren.'
    },
    {
      image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=500&q=80",
      title: language === 'en' ? 'Virtual Meeting Excellence' : 'Virtuelle Meeting-Exzellenz',
      description: language === 'en'
        ? 'Learn how to design, facilitate, and lead engaging virtual meetings that boost participation and achieve desired outcomes.'
        : 'Lernen Sie, wie Sie ansprechende virtuelle Meetings gestalten, moderieren und leiten, die die Teilnahme fördern und gewünschte Ergebnisse erzielen.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white pt-24 pb-16 relative">
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(https://assets.iderdex.com/newwork/new-work-5.jpg?auto=format&fit=crop&w=1050&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-500/30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              {language === 'en' ? 'Intensive AI & Multimedia Bootcamps' : 'Intensive KI & Multimedia Bootcamps'}
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              {language === 'en'
                ? 'Fast-track your skills with our immersive weekend bootcamps designed for entrepreneurs, professionals, and creators wanting to master AI and multimedia production.'
                : 'Beschleunigen Sie Ihre Fähigkeiten mit unseren intensiven Bootcamps, die für Unternehmer, Fachleute und Kreative konzipiert sind, die KI und Multimedia-Produktion beherrschen möchten.'}
            </p>
          </div>
        </div>
      </div>

      {/* What Makes Our Bootcamps Special */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {language === 'en' ? 'What Makes Our Bootcamps Special' : 'Was unsere Bootcamps besonders macht'}
              </h2>
              <p className="text-lg text-gray-600">
                {language === 'en'
                  ? 'Our bootcamps offer a unique approach to learning that differs from traditional courses or self-study.'
                  : 'Unsere Bootcamps bieten einen einzigartigen Lernansatz, der sich von traditionellen Kursen oder Selbststudium unterscheidet.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-xl hover-lift">
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=80" 
                    alt="Intensive bootcamp" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  {language === 'en' ? 'Accelerated Learning' : 'Schnelleres Lernen'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en'
                    ? 'Accomplish in a weekend what might take months of traditional learning. Our focused, immersive format helps you rapidly develop practical skills you can immediately apply.'
                    : 'Erreichen Sie an einem Wochenende, was bei traditionellem Lernen Monate dauern könnte. Unser fokussiertes, immersives Format hilft Ihnen, schnell praktische Fähigkeiten zu entwickeln, die Sie sofort anwenden können.'}
                </p>
              </div>
              
              <div className="glass p-8 rounded-xl hover-lift">
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80" 
                    alt="Collaborative learning" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  {language === 'en' ? 'Collaborative Environment' : 'Kollaborative Umgebung'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en'
                    ? 'Learn alongside like-minded professionals, share insights, and build valuable connections. The small group format ensures you receive personalized attention while benefiting from diverse perspectives.'
                    : 'Lernen Sie gemeinsam mit Gleichgesinnten, teilen Sie Erkenntnisse und knüpfen Sie wertvolle Verbindungen. Das Kleingruppen-Format stellt sicher, dass Sie persönliche Aufmerksamkeit erhalten und gleichzeitig von verschiedenen Perspektiven profitieren.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bootcamp Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {language === 'en' ? 'Our Bootcamp Features' : 'Unsere Bootcamp-Merkmale'}
              </h2>
              <p className="text-lg text-gray-600">
                {language === 'en'
                  ? 'Discover what makes our bootcamps an effective way to develop your AI and multimedia skills.'
                  : 'Entdecken Sie, was unsere Bootcamps zu einer effektiven Methode macht, um Ihre KI- und Multimedia-Fähigkeiten zu entwickeln.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {bootcampFeatures.map((feature, index) => (
                <div key={index} className="glass p-6 rounded-xl hover-lift">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Bootcamp Types */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {language === 'en' ? 'Our Bootcamp Offerings' : 'Unsere aktuellen Bootcamps'}
              </h2>
              <p className="text-lg text-gray-600">
                {language === 'en'
                  ? 'Choose from our specialized bootcamps designed to address specific needs and skill areas.'
                  : 'Wählen Sie aus unseren spezialisierten Bootcamps, die entwickelt wurden, um spezifische Bedürfnisse und Fähigkeitsbereiche anzusprechen.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {bootcampTypes.map((type, index) => (
                <div key={index} className="glass p-6 rounded-xl hover-lift">
                  <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                    <img 
                      src={type.image} 
                      alt={type.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/bootcampview">
                      {language === 'en' ? 'Learn More' : 'Mehr erfahren'}
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <div className="glass p-8 rounded-xl mb-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/2">
                    <img 
                      src="https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=500&q=80" 
                      alt="Bootcamp session" 
                      className="rounded-lg shadow-md w-full h-auto"
                    />
                  </div>
                  <div className="md:w-1/2 text-left">
                    <h3 className="text-xl font-bold mb-3">
                      {language === 'en' ? 'Ready to Transform Your Skills?' : 'Bereit, Ihre Fähigkeiten zu transformieren?'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {language === 'en'
                        ? 'Our bootcamps are designed to provide maximum value in minimum time. Join us for a weekend that will significantly enhance your capabilities in AI and multimedia.'
                        : 'Unsere Bootcamps sind darauf ausgelegt, in minimaler Zeit maximalen Wert zu bieten. Nehmen Sie an einem Wochenende teil, das Ihre Fähigkeiten in KI und Multimedia erheblich verbessern wird.'}
                    </p>
                    <Button asChild>
                      <Link to="#inquiry-form">
                        {language === 'en' ? 'Inquire About Upcoming Bootcamps' : 'Informieren Sie sich über kommende Bootcamps'}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Inquiry Form Section */}
      <section id="inquiry-form" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {language === 'en' ? 'Request Bootcamp Information' : 'Bootcamp-Informationen anfordern'}
              </h2>
              <p className="text-lg text-gray-600">
                {language === 'en'
                  ? 'Interested in one of our bootcamps? Schedule a call to learn more about upcoming dates, pricing, and specific curriculum details.'
                  : 'Interessiert an einem unserer Bootcamps? Vereinbaren Sie einen Anruf, um mehr über bevorstehende Termine, Preise und spezifische Lehrplaninhalte zu erfahren.'}
              </p>
            </div>
            
            <BookingForm />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default BootcampPage;
