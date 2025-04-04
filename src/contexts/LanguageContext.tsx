
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, fallback?: string) => string;
  translations: Record<string, Record<Language, string>>;
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.home': {
    en: 'Home',
    de: 'Startseite',
  },
  'nav.courses': {
    en: 'Courses',
    de: 'Kurse',
  },
  'nav.about': {
    en: 'About us',
    de: 'Über uns',
  },
  'nav.testimonials': {
    en: 'Testimonials',
    de: 'Kundenstimmen',
  },
  'nav.contact': {
    en: 'Contact',
    de: 'Kontakt',
  },
  'nav.cart': {
    en: 'Cart',
    de: 'Warenkorb',
  },
  
  // Hero section
  'hero.subtitle': {
    en: 'World-class AI Education',
    de: 'Erstklassige KI-Ausbildung',
  },
  'hero.title': {
    en: 'Master Artificial Intelligence with Expert Guidance',
    de: 'Meistern Sie Künstliche Intelligenz mit Expertenbegleitung',
  },
  'hero.description': {
    en: 'Our comprehensive courses are designed to transform beginners into AI professionals. Learn from industry experts and gain hands-on experience with cutting-edge technologies.',
    de: 'Unsere umfassenden Kurse sind darauf ausgerichtet, Anfänger in KI-Profis zu verwandeln. Lernen Sie von Branchenexperten und sammeln Sie praktische Erfahrungen mit modernsten Technologien.',
  },
  'hero.cta.explore': {
    en: 'Explore Courses',
    de: 'Kurse entdecken',
  },
  'hero.cta.learnMore': {
    en: 'Learn More',
    de: 'Mehr erfahren',
  },
  
  // Features section
  'features.title': {
    en: 'Why Choose Our AI Institute?',
    de: 'Warum unser KI-Institut wählen?',
  },
  'features.subtitle': {
    en: 'We offer a unique learning experience designed to transform beginners into AI professionals through hands-on practice and expert guidance.',
    de: 'Wir bieten ein einzigartiges Lernerlebnis, das darauf ausgerichtet ist, Anfänger durch praktische Übungen und Expertenberatung in KI-Profis zu verwandeln.',
  },
  'features.instructors.title': {
    en: 'Industry Expert Instructors',
    de: 'Branchenexperten als Dozenten',
  },
  'features.instructors.description': {
    en: 'Learn from professionals with extensive experience at leading AI companies and research institutions.',
    de: 'Lernen Sie von Fachleuten mit umfangreicher Erfahrung bei führenden KI-Unternehmen und Forschungseinrichtungen.',
  },
  'features.projects.title': {
    en: 'Hands-on Projects',
    de: 'Praktische Projekte',
  },
  'features.projects.description': {
    en: 'Apply your knowledge through real-world projects that build your portfolio and demonstrate your skills.',
    de: 'Wenden Sie Ihr Wissen durch reale Projekte an, die Ihr Portfolio aufbauen und Ihre Fähigkeiten unter Beweis stellen.',
  },
  'features.curriculum.title': {
    en: 'Job-Ready Curriculum',
    de: 'Praxisorientierter Lehrplan',
  },
  'features.curriculum.description': {
    en: 'Our courses are designed in collaboration with industry partners to ensure you learn the most relevant skills.',
    de: 'Unsere Kurse werden in Zusammenarbeit mit Branchenpartnern entwickelt, um sicherzustellen, dass Sie die relevantesten Fähigkeiten erlernen.',
  },
  'features.flexibility.title': {
    en: 'Flexible Learning Options',
    de: 'Flexible Lernoptionen',
  },
  'features.flexibility.description': {
    en: 'Choose from online, offline, and hybrid courses to fit your schedule and learning preferences.',
    de: 'Wählen Sie aus Online-, Offline- und Hybrid-Kursen, um Ihrem Zeitplan und Ihren Lernpräferenzen gerecht zu werden.',
  },
  'features.community.title': {
    en: 'Community Support',
    de: 'Gemeinschaftsunterstützung',
  },
  'features.community.description': {
    en: 'Join a community of AI enthusiasts and professionals for networking and collaboration opportunities.',
    de: 'Werden Sie Teil einer Gemeinschaft von KI-Enthusiasten und Fachleuten für Netzwerk- und Kooperationsmöglichkeiten.',
  },
  'features.career.title': {
    en: 'Career Services',
    de: 'Karriereservice',
  },
  'features.career.description': {
    en: 'Get support in your job search with resume reviews, interview preparation, and industry connections.',
    de: 'Erhalten Sie Unterstützung bei Ihrer Jobsuche durch Lebenslaufüberprüfungen, Interviewvorbereitung und Branchenverbindungen.',
  },
  
  // Courses section
  'courses.title': {
    en: 'Featured Courses',
    de: 'Ausgewählte Kurse',
  },
  'courses.subtitle': {
    en: 'Discover our most popular AI courses designed to help you master cutting-edge technologies and advance your career.',
    de: 'Entdecken Sie unsere beliebtesten KI-Kurse, die Ihnen helfen, modernste Technologien zu beherrschen und Ihre Karriere voranzutreiben.',
  },
  'courses.viewAll': {
    en: 'View All Courses',
    de: 'Alle Kurse anzeigen',
  },
  'courses.level': {
    en: 'Level',
    de: 'Niveau',
  },
  'courses.duration': {
    en: 'Duration',
    de: 'Dauer',
  },
  'courses.startDate': {
    en: 'Start Date',
    de: 'Startdatum',
  },
  'courses.instructor': {
    en: 'by',
    de: 'von',
  },
  'courses.addToCart': {
    en: 'Add to Cart',
    de: 'In den Warenkorb',
  },
  
  // Testimonials section
  'testimonials.title': {
    en: 'What Our Students Say',
    de: 'Was unsere Studenten sagen',
  },
  'testimonials.subtitle': {
    en: 'Hear from our alumni about their experiences and how our courses helped them advance their careers in AI.',
    de: 'Hören Sie von unseren Absolventen über ihre Erfahrungen und wie unsere Kurse ihnen geholfen haben, ihre Karriere in der KI voranzutreiben.',
  },
  
  // CTA section
  'cta.title': {
    en: 'Ready to Begin Your AI Journey?',
    de: 'Bereit, Ihre KI-Reise zu beginnen?',
  },
  'cta.subtitle': {
    en: 'Join thousands of students who have transformed their careers with our expert-led AI courses.',
    de: 'Schließen Sie sich Tausenden von Studenten an, die ihre Karriere mit unseren von Experten geleiteten KI-Kursen verändert haben.',
  },
  'cta.button': {
    en: 'Explore Courses Now',
    de: 'Kurse jetzt entdecken',
  },
  
  // About page
  'about.title': {
    en: 'About us',
    de: 'Über uns',
  },
  'about.mission.title': {
    en: 'Our Mission',
    de: 'Unsere Mission',
  },
  'about.mission.description': {
    en: 'We are dedicated to democratizing AI education and making cutting-edge technology accessible to everyone. Our mission is to empower individuals and organizations with the knowledge and skills needed to harness the power of artificial intelligence responsibly and effectively.',
    de: 'Wir haben uns der Demokratisierung der KI-Bildung verschrieben und machen modernste Technologie für jeden zugänglich. Unsere Mission ist es, Einzelpersonen und Organisationen mit dem Wissen und den Fähigkeiten auszustatten, die erforderlich sind, um die Kraft der künstlichen Intelligenz verantwortungsvoll und effektiv zu nutzen.',
  },
  'about.story.title': {
    en: 'Our Story',
    de: 'Unsere Geschichte',
  },
  'about.story.description': {
    en: 'Founded in 2020 by a team of AI researchers and educators, our institute was born from the recognition that AI education needed to be more practical, accessible, and aligned with industry needs. What started as a small workshop series has grown into a comprehensive educational platform serving students worldwide.',
    de: 'Gegründet im Jahr 2020 von einem Team von KI-Forschern und Pädagogen, entstand unser Institut aus der Erkenntnis, dass KI-Bildung praktischer, zugänglicher und besser auf die Bedürfnisse der Branche abgestimmt sein musste. Was als kleine Workshop-Reihe begann, hat sich zu einer umfassenden Bildungsplattform entwickelt, die Studenten weltweit bedient.',
  },
  'about.team.title': {
    en: 'Our Team',
    de: 'Unser Team',
  },
  
  // Cart and Checkout
  'cart.title': {
    en: 'Your Cart',
    de: 'Ihr Warenkorb',
  },
  'cart.empty': {
    en: 'Your cart is empty',
    de: 'Ihr Warenkorb ist leer',
  },
  'cart.continue': {
    en: 'Continue Shopping',
    de: 'Einkauf fortsetzen',
  },
  'cart.checkout': {
    en: 'Proceed to Checkout',
    de: 'Zur Kasse gehen',
  },
  'cart.total': {
    en: 'Total',
    de: 'Gesamtsumme',
  },
  'cart.remove': {
    en: 'Remove',
    de: 'Entfernen',
  },
  
  // Legal
  'legal.imprint': {
    en: 'Imprint',
    de: 'Impressum',
  },
  'legal.privacy': {
    en: 'Privacy Policy',
    de: 'Datenschutzerklärung',
  },
  'legal.terms': {
    en: 'Terms of Service',
    de: 'Nutzungsbedingungen',
  },
  
  // Footer
  'footer.rights': {
    en: 'All rights reserved',
    de: 'Alle Rechte vorbehalten',
  },
  'footer.address': {
    en: 'Our Address',
    de: 'Unsere Adresse',
  },
  'footer.contact': {
    en: 'Contact Us',
    de: 'Kontaktieren Sie uns',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  translations,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get the language from localStorage, fallback to browser preference or default to english
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'de')) {
      return savedLanguage;
    }
    
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'de' ? 'de' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};
