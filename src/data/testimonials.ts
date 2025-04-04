
import { Testimonial } from '../types';

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Marcus Chen',
    role: 'Data Scientist',
    company: 'TechCorp',
    content: {
      en: 'The Machine Learning course provided an excellent foundation for my career in AI. The instructors were knowledgeable and the hands-on projects gave me practical experience that I use daily in my job.',
      de: 'Der Machine-Learning-Kurs bot eine hervorragende Grundlage für meine Karriere in der KI. Die Dozenten waren sachkundig und die praktischen Projekte gaben mir praktische Erfahrungen, die ich täglich in meinem Job nutze.'
    },
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: '2',
    name: 'Sophia Rodriguez',
    role: 'AI Research Engineer',
    company: 'InnovateAI',
    content: {
      en: 'The Deep Learning course was transformative. The curriculum was cutting-edge and the instructors provided invaluable insights from their industry experience. This institute truly delivers world-class AI education.',
      de: 'Der Deep-Learning-Kurs war transformativ. Der Lehrplan war hochmodern und die Dozenten lieferten unschätzbare Einblicke aus ihrer Branchenerfahrung. Dieses Institut bietet wirklich erstklassige KI-Ausbildung.'
    },
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: '3',
    name: 'James Wilson',
    role: 'NLP Specialist',
    company: 'LanguageTech',
    content: {
      en: 'The NLP Mastery course equipped me with the skills to work on advanced language models. The combination of theoretical knowledge and practical implementation made this program stand out from other offerings.',
      de: 'Der NLP-Mastery-Kurs hat mich mit den Fähigkeiten ausgestattet, an fortschrittlichen Sprachmodellen zu arbeiten. Die Kombination aus theoretischem Wissen und praktischer Umsetzung ließ dieses Programm aus anderen Angeboten herausstechen.'
    },
    rating: 4,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: '4',
    name: 'Emma Johnson',
    role: 'Computer Vision Engineer',
    company: 'VisionAI',
    content: {
      en: 'I came in with some programming knowledge but little AI experience. After completing the Computer Vision course, I landed my dream job. The curriculum was comprehensive and the community support was outstanding.',
      de: 'Ich kam mit einigen Programmierkenntnissen, aber wenig KI-Erfahrung. Nach Abschluss des Computer-Vision-Kurses habe ich meinen Traumjob bekommen. Der Lehrplan war umfassend und die Community-Unterstützung war hervorragend.'
    },
    rating: 5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  }
];
