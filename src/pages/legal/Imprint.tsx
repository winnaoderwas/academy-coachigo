
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const ImprintPage = () => {
  const { language } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            {language === 'en' ? 'Legal Notice (Imprint)' : 'Impressum'}
          </h1>
          
          <div className="glass p-8 rounded-xl mb-8">
            <h2 className="text-xl font-bold mb-4">
              {language === 'en' ? 'Information according to § 5 TMG' : 'Angaben gemäß § 5 TMG'}
            </h2>
            
            <div className="mb-6">
              <p className="font-medium">AI Training Institute GmbH</p>
              <p>Technologiepark 10</p>
              <p>10115 Berlin</p>
              <p>Germany</p>
            </div>
            
            <div className="mb-6">
              <p className="font-medium">
                {language === 'en' ? 'Commercial Register' : 'Handelsregister'}:
              </p>
              <p>
                {language === 'en' 
                  ? 'Registered at District Court Berlin' 
                  : 'Eingetragen beim Amtsgericht Berlin'}
              </p>
              <p>
                {language === 'en' ? 'Registration Number' : 'Registernummer'}: HRB 123456
              </p>
            </div>
            
            <div className="mb-6">
              <p className="font-medium">
                {language === 'en' ? 'VAT Identification Number' : 'Umsatzsteuer-ID'}:
              </p>
              <p>DE123456789</p>
            </div>
            
            <div className="mb-6">
              <p className="font-medium">
                {language === 'en' ? 'Represented by' : 'Vertreten durch'}:
              </p>
              <p>Dr. Sarah Johnson, CEO</p>
            </div>
          </div>
          
          <div className="glass p-8 rounded-xl mb-8">
            <h2 className="text-xl font-bold mb-4">
              {language === 'en' ? 'Contact' : 'Kontakt'}
            </h2>
            
            <div className="mb-6">
              <p className="font-medium">
                {language === 'en' ? 'Phone' : 'Telefon'}:
              </p>
              <p>+49 30 1234567</p>
            </div>
            
            <div className="mb-6">
              <p className="font-medium">
                {language === 'en' ? 'Email' : 'E-Mail'}:
              </p>
              <p>info@ai-training-institute.com</p>
            </div>
          </div>
          
          <div className="glass p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4">
              {language === 'en' ? 'Responsible for Content' : 'Verantwortlich für den Inhalt'}
            </h2>
            
            <div className="mb-6">
              <p className="font-medium">Dr. Sarah Johnson</p>
              <p>AI Training Institute GmbH</p>
              <p>Technologiepark 10</p>
              <p>10115 Berlin</p>
              <p>Germany</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ImprintPage;
