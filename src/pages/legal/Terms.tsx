
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const TermsPage = () => {
  const { language } = useLanguage();

  const termsContent = {
    en: {
      title: 'Terms and Conditions',
      lastUpdated: 'Last Updated: October 25, 2023',
      intro: 'Please read these terms and conditions carefully before using our services.',
      sections: [
        {
          title: '1. Acceptance of Terms',
          content: 'By accessing or using our services, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.'
        },
        {
          title: '2. Use License',
          content: 'Permission is granted to temporarily access the materials on our website for personal, non-commercial use only. This is the grant of a license, not a transfer of title.'
        },
        {
          title: '3. Course Enrollment',
          content: 'By enrolling in our courses, you agree to attend scheduled sessions, complete assignments, and adhere to academic integrity standards. Course materials are for personal use only and may not be redistributed.'
        },
        {
          title: '4. Payment Terms',
          content: 'All payments are processed securely. Course fees must be paid in full before access is granted unless a payment plan has been arranged. Refunds are available within 14 days of purchase if no course content has been accessed.'
        },
        {
          title: '5. Intellectual Property',
          content: 'All content, including but not limited to text, graphics, logos, images, audio, video, and software, is the property of our institute and is protected by copyright laws.'
        },
        {
          title: '6. User Content',
          content: 'Any content submitted by users remains their intellectual property. However, by submitting content, users grant us a non-exclusive license to use, reproduce, and distribute such content in connection with our services.'
        },
        {
          title: '7. Limitation of Liability',
          content: 'Our institute shall not be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with the use of our services or courses.'
        },
        {
          title: '8. Governing Law',
          content: 'These terms shall be governed by and construed in accordance with the laws of Germany, without regard to its conflict of law provisions.'
        }
      ],
      conclusion: 'If you have any questions about these Terms and Conditions, please contact us.'
    },
    de: {
      title: 'Allgemeine Geschäftsbedingungen',
      lastUpdated: 'Zuletzt aktualisiert: 25. Oktober 2023',
      intro: 'Bitte lesen Sie diese Allgemeinen Geschäftsbedingungen sorgfältig durch, bevor Sie unsere Dienste nutzen.',
      sections: [
        {
          title: '1. Annahme der Bedingungen',
          content: 'Durch den Zugriff auf oder die Nutzung unserer Dienste erklären Sie sich damit einverstanden, an diese Allgemeinen Geschäftsbedingungen und alle geltenden Gesetze und Vorschriften gebunden zu sein. Wenn Sie mit diesen Bedingungen nicht einverstanden sind, ist Ihnen die Nutzung oder der Zugriff auf unsere Dienste untersagt.'
        },
        {
          title: '2. Nutzungslizenz',
          content: 'Es wird die Erlaubnis erteilt, vorübergehend auf die Materialien auf unserer Website für den persönlichen, nicht-kommerziellen Gebrauch zuzugreifen. Dies ist die Erteilung einer Lizenz, nicht die Übertragung eines Eigentumstitels.'
        },
        {
          title: '3. Kursanmeldung',
          content: 'Mit der Anmeldung zu unseren Kursen erklären Sie sich damit einverstanden, an geplanten Sitzungen teilzunehmen, Aufgaben zu erledigen und die Standards der akademischen Integrität einzuhalten. Kursmaterialien sind nur für den persönlichen Gebrauch bestimmt und dürfen nicht weiterverbreitet werden.'
        },
        {
          title: '4. Zahlungsbedingungen',
          content: 'Alle Zahlungen werden sicher verarbeitet. Kursgebühren müssen vollständig bezahlt werden, bevor der Zugang gewährt wird, es sei denn, es wurde ein Zahlungsplan vereinbart. Rückerstattungen sind innerhalb von 14 Tagen nach dem Kauf möglich, wenn auf keine Kursinhalte zugegriffen wurde.'
        },
        {
          title: '5. Geistiges Eigentum',
          content: 'Alle Inhalte, einschließlich, aber nicht beschränkt auf Text, Grafiken, Logos, Bilder, Audio, Video und Software, sind Eigentum unseres Instituts und durch Urheberrechtsgesetze geschützt.'
        },
        {
          title: '6. Benutzerinhalte',
          content: 'Alle von Benutzern eingereichten Inhalte bleiben deren geistiges Eigentum. Durch das Einreichen von Inhalten gewähren Benutzer uns jedoch eine nicht-exklusive Lizenz zur Nutzung, Reproduktion und Verbreitung solcher Inhalte in Verbindung mit unseren Diensten.'
        },
        {
          title: '7. Haftungsbeschränkung',
          content: 'Unser Institut haftet nicht für direkte, indirekte, zufällige, Folge- oder besondere Schäden, die aus oder in irgendeiner Weise mit der Nutzung unserer Dienste oder Kurse verbunden sind.'
        },
        {
          title: '8. Geltendes Recht',
          content: 'Diese Bedingungen unterliegen dem Recht Deutschlands und werden in Übereinstimmung mit diesem ausgelegt, ohne Berücksichtigung seiner Kollisionsnormen.'
        }
      ],
      conclusion: 'Wenn Sie Fragen zu diesen Allgemeinen Geschäftsbedingungen haben, kontaktieren Sie uns bitte.'
    }
  };

  const content = termsContent[language];

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{content.lastUpdated}</p>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <p className="mb-4">{content.intro}</p>
        </CardContent>
      </Card>
      
      {content.sections.map((section, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
          <p className="text-gray-700 mb-4">{section.content}</p>
          {index < content.sections.length - 1 && <Separator className="my-4" />}
        </div>
      ))}
      
      <Card className="mt-8">
        <CardContent className="pt-6">
          <p>{content.conclusion}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsPage;
