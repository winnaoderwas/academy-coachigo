
import { Users, School, Target, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutPage = () => {
  const { t, language } = useLanguage();
  
  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: language === 'en' ? 'Founder & CEO' : 'Gründerin & CEO',
      bio: language === 'en' 
        ? 'AI researcher with over 15 years of experience in machine learning and neural networks.' 
        : 'KI-Forscherin mit über 15 Jahren Erfahrung in maschinellem Lernen und neuronalen Netzen.',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Prof. Michael Chen',
      role: language === 'en' ? 'Chief Academic Officer' : 'Akademischer Leiter',
      bio: language === 'en'
        ? 'Former professor of Computer Science specializing in deep learning architectures.' 
        : 'Ehemaliger Professor für Informatik, spezialisiert auf Deep-Learning-Architekturen.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: language === 'en' ? 'Head of Natural Language Processing' : 'Leiterin für Natural Language Processing',
      bio: language === 'en'
        ? 'Expert in natural language processing and creator of several industry-leading NLP systems.' 
        : 'Expertin für natürliche Sprachverarbeitung und Schöpferin mehrerer branchenführender NLP-Systeme.',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Prof. David Kim',
      role: language === 'en' ? 'Head of Computer Vision' : 'Leiter für Computer Vision',
      bio: language === 'en'
        ? 'Pioneer in computer vision with contributions to object detection and image recognition.' 
        : 'Pionier im Bereich Computer Vision mit Beiträgen zu Objekterkennung und Bilderkennung.',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    }
  ];
  
  const values = [
    {
      icon: <School className="h-6 w-6 text-primary" />,
      title: language === 'en' ? 'Excellence in Education' : 'Exzellenz in der Bildung',
      description: language === 'en'
        ? 'We are committed to providing the highest quality education in artificial intelligence, constantly updating our curriculum to reflect the latest advancements in the field.'
        : 'Wir sind bestrebt, die höchste Qualität der Ausbildung in künstlicher Intelligenz zu bieten und aktualisieren unseren Lehrplan ständig, um die neuesten Fortschritte auf diesem Gebiet widerzuspiegeln.'
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: language === 'en' ? 'Inclusive Learning' : 'Inklusives Lernen',
      description: language === 'en'
        ? 'We believe that AI education should be accessible to everyone, regardless of their background. We design our courses to accommodate different learning styles and experience levels.'
        : 'Wir glauben, dass KI-Bildung für jeden zugänglich sein sollte, unabhängig von seinem Hintergrund. Wir gestalten unsere Kurse so, dass sie verschiedene Lernstile und Erfahrungsstufen berücksichtigen.'
    },
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      title: language === 'en' ? 'Practical Application' : 'Praktische Anwendung',
      description: language === 'en'
        ? 'Our teaching philosophy emphasizes hands-on learning with real-world projects. We ensure that students can apply their knowledge to solve actual problems in their careers.'
        : 'Unsere Lehrphilosophie betont praktisches Lernen mit realen Projekten. Wir stellen sicher, dass Studierende ihr Wissen anwenden können, um tatsächliche Probleme in ihrer Karriere zu lösen.'
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: language === 'en' ? 'Ethical AI Development' : 'Ethische KI-Entwicklung',
      description: language === 'en'
        ? 'We instill a strong sense of ethical responsibility in our students, teaching them to consider the broader implications of AI and to develop systems that are fair, transparent, and beneficial to society.'
        : 'Wir vermitteln unseren Studierenden ein starkes Gefühl ethischer Verantwortung und lehren sie, die breiteren Auswirkungen von KI zu berücksichtigen und Systeme zu entwickeln, die fair, transparent und für die Gesellschaft von Nutzen sind.'
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      {/* Hero Section */}  
          <div className="bg-gradient-to-b from-blue-50 to-white pt-24 pb-16 relative">
      {/* Hintergrundbild mit Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{ backgroundImage: 'url(https://assets.iderdex.com/newwork/new-work-7.jpg?auto=format&fit=crop&w=1050&q=80)' }}
          />
          <div className="absolute inset-0 bg-gray-700 opacity-50" /> {/* Graues Overlay */}
  
          <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Wir über uns</h1>
              <p className="text-xl text-gray-200 leading-relaxed">
                {language === 'en'
                  ? 'We are passionate educators and AI professionals on a mission to make artificial intelligence education accessible, practical, and transformative.'
                  : 'Wir sind leidenschaftliche Multimedia- und KI-Fachleute mit der Mission, die Ausbildung in künstlicher Intelligenz zugänglich, praktisch und transformativ zu gestalten.'}
              </p>
          </div>
          </div>
          </div>
      
   
      
      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('about.mission.title')}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('about.mission.description')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-xl hover-lift">
                <h3 className="text-xl font-bold mb-3">
                  {language === 'en' ? 'Our Vision' : 'Unsere Vision'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en'
                    ? 'To create a world where artificial intelligence is understood, developed, and applied ethically by a diverse community of well-educated practitioners, enabling AI to benefit humanity as a whole.'
                    : 'Eine Welt zu schaffen, in der künstliche Intelligenz von einer vielfältigen Gemeinschaft gut ausgebildeter Praktiker verstanden, entwickelt und ethisch angewendet wird, sodass KI der gesamten Menschheit zugute kommt.'}
                </p>
              </div>
              
              <div className="glass p-8 rounded-xl hover-lift">
                <h3 className="text-xl font-bold mb-3">
                  {language === 'en' ? 'Our Approach' : 'Unser Ansatz'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en'
                    ? 'We combine theoretical learning with hands-on projects, industry insights, and personalized mentorship to provide a comprehensive educational experience that prepares students for real-world AI challenges.'
                    : 'Wir kombinieren theoretisches Lernen mit praktischen Projekten, Brancheneinblicken und personalisiertem Mentoring, um ein umfassendes Bildungserlebnis zu bieten, das Studierende auf reale KI-Herausforderungen vorbereitet.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('about.story.title')}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('about.story.description')}
              </p>
            </div>
            
            <div className="glass p-8 rounded-xl">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <img 
                    src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=1050&q=80" 
                    alt="Team workshop" 
                    className="rounded-lg shadow-md w-full h-auto"
                  />
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-xl font-bold mb-3">
                    {language === 'en' ? 'From Workshop to Institute' : 'Vom Workshop zum Institut'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {language === 'en'
                      ? 'What began as a series of weekend workshops for tech professionals quickly grew into a comprehensive educational platform. As interest in AI surged, we expanded our offerings to serve students at all levels.'
                      : 'Was als eine Reihe von Wochenend-Workshops für Technik-Fachleute begann, entwickelte sich schnell zu einer umfassenden Bildungsplattform. Als das Interesse an KI zunahm, erweiterten wir unser Angebot, um Studenten aller Niveaus zu bedienen.'}
                  </p>
                  <p className="text-gray-600">
                    {language === 'en'
                      ? 'Today, we\'re proud to have helped thousands of students from diverse backgrounds transform their careers and make meaningful contributions to the field of artificial intelligence.'
                      : 'Heute sind wir stolz darauf, Tausenden von Studierenden mit unterschiedlichem Hintergrund geholfen zu haben, ihre Karriere zu verändern und bedeutende Beiträge auf dem Gebiet der künstlichen Intelligenz zu leisten.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {language === 'en' ? 'Our Values' : 'Unsere Werte'}
              </h2>
              <p className="text-lg text-gray-600">
                {language === 'en'
                  ? 'The principles that guide our educational approach and organizational culture.'
                  : 'Die Prinzipien, die unseren pädagogischen Ansatz und unsere Organisationskultur leiten.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="glass p-6 rounded-xl hover-lift">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('about.team.title')}</h2>
              <p className="text-lg text-gray-600">
                {language === 'en'
                  ? 'Meet the experts and educators behind our institute.'
                  : 'Lernen Sie die Experten und Pädagogen hinter unserem Institut kennen.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {team.map((member, index) => (
                <div key={index} className="glass p-6 rounded-xl hover-lift flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img 
                      src={member.imageUrl} 
                      alt={member.name} 
                      className="w-full h-full object-cover rounded-full" 
                    />
                  </div>
                  <div className="sm:flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-primary font-medium mb-2">{member.role}</p>
                    <p className="text-gray-600">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild className="gap-2">
                <Link to="/courses">
                  {language === 'en' ? 'Explore Our Courses' : 'Entdecken Sie unsere Kurse'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
