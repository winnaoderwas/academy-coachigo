
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const PrivacyPage = () => {
  const { language } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            {language === 'en' ? 'Privacy Policy' : 'Datenschutzerklärung'}
          </h1>
          
          <div className="prose max-w-none glass p-8 rounded-xl">
            <p className="lead mb-6 font-medium">
              {language === 'en'
                ? 'This Privacy Policy describes how AI Training Institute GmbH ("we", "us", or "our") collects, uses, and discloses your personal information when you visit our website or use our services.'
                : 'Diese Datenschutzerklärung beschreibt, wie AI Training Institute GmbH ("wir", "uns" oder "unser") Ihre personenbezogenen Daten erfasst, verwendet und offenlegt, wenn Sie unsere Website besuchen oder unsere Dienste nutzen.'}
            </p>
            
            <h2>
              {language === 'en' ? 'Information We Collect' : 'Informationen, die wir sammeln'}
            </h2>
            <p>
              {language === 'en'
                ? 'We collect information that you provide directly to us, such as when you create an account, enroll in a course, participate in interactive features, fill out a form, or otherwise communicate with us.'
                : 'Wir sammeln Informationen, die Sie uns direkt zur Verfügung stellen, wie z.B. wenn Sie ein Konto erstellen, sich für einen Kurs einschreiben, an interaktiven Funktionen teilnehmen, ein Formular ausfüllen oder anderweitig mit uns kommunizieren.'}
            </p>
            
            <h3>
              {language === 'en' ? 'Personal Information' : 'Personenbezogene Daten'}
            </h3>
            <p>
              {language === 'en'
                ? 'This may include your name, email address, postal address, phone number, payment information, and any other information you choose to provide.'
                : 'Dies kann Ihren Namen, Ihre E-Mail-Adresse, Postanschrift, Telefonnummer, Zahlungsinformationen und andere Informationen umfassen, die Sie bereitstellen möchten.'}
            </p>
            
            <h3>
              {language === 'en' ? 'Automatically Collected Information' : 'Automatisch erfasste Informationen'}
            </h3>
            <p>
              {language === 'en'
                ? 'When you use our website, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.'
                : 'Wenn Sie unsere Website nutzen, erfassen wir automatisch bestimmte Informationen über Ihr Gerät, einschließlich Informationen über Ihren Webbrowser, IP-Adresse, Zeitzone und einige der Cookies, die auf Ihrem Gerät installiert sind.'}
            </p>
            
            <h2>
              {language === 'en' ? 'How We Use Your Information' : 'Wie wir Ihre Informationen verwenden'}
            </h2>
            <p>
              {language === 'en'
                ? 'We use the information we collect to provide, maintain, and improve our services, including to:'
                : 'Wir verwenden die von uns gesammelten Informationen, um unsere Dienste bereitzustellen, zu pflegen und zu verbessern, einschließlich:'}
            </p>
            
            <ul>
              <li>
                {language === 'en'
                  ? 'Process transactions and send related information including confirmations, invoices, and customer service notifications'
                  : 'Transaktionen zu verarbeiten und zugehörige Informationen zu senden, einschließlich Bestätigungen, Rechnungen und Kundenservicebenachrichtigungen'}
              </li>
              <li>
                {language === 'en'
                  ? 'Send you technical notices, updates, security alerts, and administrative messages'
                  : 'Technische Hinweise, Updates, Sicherheitswarnungen und administrative Nachrichten zu senden'}
              </li>
              <li>
                {language === 'en'
                  ? 'Respond to your comments, questions, and requests'
                  : 'Auf Ihre Kommentare, Fragen und Anfragen zu antworten'}
              </li>
              <li>
                {language === 'en'
                  ? 'Provide customer service and support'
                  : 'Kundenservice und Support zu bieten'}
              </li>
              <li>
                {language === 'en'
                  ? 'Monitor and analyze trends, usage, and activities in connection with our services'
                  : 'Trends, Nutzung und Aktivitäten in Verbindung mit unseren Diensten zu überwachen und zu analysieren'}
              </li>
            </ul>
            
            <h2>
              {language === 'en' ? 'Sharing Your Information' : 'Weitergabe Ihrer Informationen'}
            </h2>
            <p>
              {language === 'en'
                ? 'We may share your personal information in the following situations:'
                : 'Wir können Ihre personenbezogenen Daten in folgenden Situationen weitergeben:'}
            </p>
            
            <ul>
              <li>
                {language === 'en'
                  ? 'With service providers, consultants, and other third-party vendors who need access to such information to carry out work on our behalf'
                  : 'Mit Dienstleistern, Beratern und anderen Drittanbietern, die Zugang zu solchen Informationen benötigen, um Arbeiten in unserem Auftrag auszuführen'}
              </li>
              <li>
                {language === 'en'
                  ? 'In response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law or legal process'
                  : 'Als Antwort auf eine Informationsanfrage, wenn wir der Meinung sind, dass die Offenlegung in Übereinstimmung mit oder aufgrund von geltendem Recht oder rechtlichen Verfahren erforderlich ist'}
              </li>
              <li>
                {language === 'en'
                  ? 'If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of our company or others'
                  : 'Wenn wir der Meinung sind, dass Ihre Handlungen im Widerspruch zu unseren Benutzervereinbarungen oder Richtlinien stehen, oder um die Rechte, das Eigentum und die Sicherheit unseres Unternehmens oder anderer zu schützen'}
              </li>
            </ul>
            
            <h2>
              {language === 'en' ? 'Your Rights' : 'Ihre Rechte'}
            </h2>
            <p>
              {language === 'en'
                ? 'You have the right to access, correct, or delete your personal information. You may also object to or restrict the processing of your personal information or request portability of your personal information.'
                : 'Sie haben das Recht, auf Ihre personenbezogenen Daten zuzugreifen, sie zu korrigieren oder zu löschen. Sie können auch der Verarbeitung Ihrer personenbezogenen Daten widersprechen oder sie einschränken oder die Übertragbarkeit Ihrer personenbezogenen Daten beantragen.'}
            </p>
            
            <h2>
              {language === 'en' ? 'Contact Us' : 'Kontaktieren Sie uns'}
            </h2>
            <p>
              {language === 'en'
                ? 'If you have any questions about this Privacy Policy, please contact us at privacy@ai-training-institute.com.'
                : 'Wenn Sie Fragen zu dieser Datenschutzerklärung haben, kontaktieren Sie uns bitte unter privacy@ai-training-institute.com.'}
            </p>
            
            <p className="mt-8 text-sm text-gray-500">
              {language === 'en'
                ? 'Last updated: August 1, 2023'
                : 'Zuletzt aktualisiert: 1. August 2023'}
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPage;
