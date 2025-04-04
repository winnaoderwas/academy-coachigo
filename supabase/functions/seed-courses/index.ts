import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

interface Course {
  title: { en: string; de: string };
  short_description: { en: string; de: string };
  description: { en: string; de: string };
  duration: string;
  level: string;
  format: string;
  price: number;
  category: string;
  course_type: string;
  start_date: string;
  image_url: string;
  instructor: string;
  interval: string;
  max_participants: number;
  target_group: { en: string; de: string };
}

interface CourseWithSyllabusAndObjectives extends Course {
  id: string;
  syllabus: {
    order_num: number;
    title: { en: string; de: string };
    description: { en: string; de: string };
  }[];
  objectives: {
    order_num: number;
    objective: { en: string; de: string };
  }[];
}

// We're using known category values from the type definition
const sampleCourses: CourseWithSyllabusAndObjectives[] = [
  {
    id: crypto.randomUUID(),
    title: {
      en: "Introduction to AI for Beginners",
      de: "Einführung in KI für Anfänger"
    },
    short_description: {
      en: "Learn the fundamentals of artificial intelligence and start your journey in the world of AI.",
      de: "Lernen Sie die Grundlagen der künstlichen Intelligenz und beginnen Sie Ihre Reise in die Welt der KI."
    },
    description: {
      en: "This comprehensive course introduces you to the exciting world of artificial intelligence. You'll learn key concepts, understand different types of AI, and get hands-on experience with practical applications. Perfect for beginners with no prior experience in AI or programming.",
      de: "Dieser umfassende Kurs führt Sie in die spannende Welt der künstlichen Intelligenz ein. Sie lernen Schlüsselkonzepte kennen, verstehen verschiedene Arten von KI und sammeln praktische Erfahrungen mit praktischen Anwendungen. Perfekt für Anfänger ohne Vorkenntnisse in KI oder Programmierung."
    },
    duration: "8 weeks",
    level: "Beginner",
    format: "Online",
    price: 499,
    category: "AI Beginners", // Using valid category
    start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    image_url: "https://images.unsplash.com/photo-1593376893114-ff5645259ab4?auto=format&fit=crop&w=800&q=80",
    instructor: "Dr. Sarah Johnson",
    interval: "Weekly",
    max_participants: 30,
    target_group: {
      en: "Beginners interested in AI, no technical background required",
      de: "Anfänger, die sich für KI interessieren, keine technischen Vorkenntnisse erforderlich"
    },
    syllabus: [
      {
        order_num: 1,
        title: { en: "Introduction to AI", de: "Einführung in KI" },
        description: {
          en: "Overview of AI, its history, and impact on society. Basic concepts and terminology.",
          de: "Überblick über KI, ihre Geschichte und Auswirkungen auf die Gesellschaft. Grundlegende Konzepte und Terminologie."
        }
      },
      {
        order_num: 2,
        title: { en: "Types of AI", de: "Arten von KI" },
        description: {
          en: "Understanding different categories of AI: narrow vs. general, weak vs. strong.",
          de: "Verständnis verschiedener KI-Kategorien: eng vs. allgemein, schwach vs. stark."
        }
      },
      {
        order_num: 3,
        title: { en: "Machine Learning Basics", de: "Grundlagen des maschinellen Lernens" },
        description: {
          en: "Introduction to machine learning concepts and how algorithms learn from data.",
          de: "Einführung in Konzepte des maschinellen Lernens und wie Algorithmen aus Daten lernen."
        }
      },
      {
        order_num: 4,
        title: { en: "Neural Networks", de: "Neuronale Netze" },
        description: {
          en: "Understanding the building blocks of deep learning and how neural networks function.",
          de: "Verständnis der Bausteine des Deep Learning und wie neuronale Netze funktionieren."
        }
      }
    ],
    objectives: [
      {
        order_num: 1,
        objective: {
          en: "Understand key AI concepts and terminology",
          de: "Verstehen Sie wichtige KI-Konzepte und Terminologie"
        }
      },
      {
        order_num: 2,
        objective: {
          en: "Recognize different types of AI systems and their applications",
          de: "Erkennen Sie verschiedene Arten von KI-Systemen und ihre Anwendungen"
        }
      },
      {
        order_num: 3,
        objective: {
          en: "Learn how machine learning algorithms work at a conceptual level",
          de: "Lernen Sie, wie Algorithmen des maschinellen Lernens auf konzeptioneller Ebene funktionieren"
        }
      },
      {
        order_num: 4,
        objective: {
          en: "Explore practical AI applications in different industries",
          de: "Erkunden Sie praktische KI-Anwendungen in verschiedenen Branchen"
        }
      }
    ]
  },
  {
    id: crypto.randomUUID(),
    title: {
      en: "AI for Graphic Design",
      de: "KI für Grafikdesign"
    },
    short_description: {
      en: "Leverage AI tools to enhance your graphic design workflow and create stunning visuals.",
      de: "Nutzen Sie KI-Tools, um Ihren Grafikdesign-Workflow zu verbessern und beeindruckende Visuals zu erstellen."
    },
    description: {
      en: "This practical course helps designers integrate AI tools into their creative workflow. Learn to use AI-powered applications for generating images, enhancing photos, creating unique designs, and automating repetitive tasks. Ideal for graphic designers looking to stay ahead in the rapidly evolving digital design landscape.",
      de: "Dieser praktische Kurs hilft Designern, KI-Tools in ihren kreativen Workflow zu integrieren. Lernen Sie, KI-gestützte Anwendungen zur Generierung von Bildern, Verbesserung von Fotos, Erstellung einzigartiger Designs und Automatisierung sich wiederholender Aufgaben zu verwenden. Ideal für Grafikdesigner, die in der sich schnell entwickelnden digitalen Designlandschaft einen Schritt voraus sein möchten."
    },
    duration: "6 weeks",
    level: "Intermediate",
    format: "Hybrid",
    price: 699,
    category: "AI Graphics", // Using valid category
    start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month from now
    image_url: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?auto=format&fit=crop&w=800&q=80",
    instructor: "Prof. Michael Chen",
    interval: "Weekly",
    max_participants: 25,
    target_group: {
      en: "Graphic designers, digital artists, and creative professionals",
      de: "Grafikdesigner, digitale Künstler und Kreativprofis"
    },
    syllabus: [
      {
        order_num: 1,
        title: { en: "AI in Design: An Overview", de: "KI im Design: Ein Überblick" },
        description: {
          en: "Introduction to AI tools and applications in graphic design and visual arts.",
          de: "Einführung in KI-Tools und -Anwendungen im Grafikdesign und in der visuellen Kunst."
        }
      },
      {
        order_num: 2,
        title: { en: "Image Generation with AI", de: "Bilderzeugung mit KI" },
        description: {
          en: "Using text-to-image models like DALL-E, Midjourney, and Stable Diffusion.",
          de: "Verwendung von Text-zu-Bild-Modellen wie DALL-E, Midjourney und Stable Diffusion."
        }
      },
      {
        order_num: 3,
        title: { en: "AI Photo Enhancement", de: "KI-Fotoverbesserung" },
        description: {
          en: "Tools and techniques for automatic photo improvement, restoration, and manipulation.",
          de: "Tools und Techniken zur automatischen Fotoverbesserung, -wiederherstellung und -manipulation."
        }
      },
      {
        order_num: 4,
        title: { en: "AI for Design Automation", de: "KI für Design-Automatisierung" },
        description: {
          en: "Streamlining workflow with AI assistants and automating repetitive design tasks.",
          de: "Optimierung des Workflows mit KI-Assistenten und Automatisierung sich wiederholender Designaufgaben."
        }
      }
    ],
    objectives: [
      {
        order_num: 1,
        objective: {
          en: "Master using AI image generation tools for creative projects",
          de: "Beherrschen Sie die Verwendung von KI-Bildgenerierungstools für kreative Projekte"
        }
      },
      {
        order_num: 2,
        objective: {
          en: "Apply AI-powered photo enhancement techniques to your work",
          de: "Wenden Sie KI-gestützte Fotoverbesserungstechniken auf Ihre Arbeit an"
        }
      },
      {
        order_num: 3,
        objective: {
          en: "Develop efficient workflows combining traditional design tools with AI",
          de: "Entwickeln Sie effiziente Workflows, die traditionelle Designtools mit KI kombinieren"
        }
      },
      {
        order_num: 4,
        objective: {
          en: "Create unique visual styles leveraging AI capabilities",
          de: "Schaffen Sie einzigartige visuelle Stile, die KI-Fähigkeiten nutzen"
        }
      }
    ]
  },
  {
    id: crypto.randomUUID(),
    title: {
      en: "AI Text Generation Mastery",
      de: "Meisterschaft in KI-Texterstellung"
    },
    short_description: {
      en: "Learn to effectively use and customize AI text generation tools for content creation.",
      de: "Lernen Sie, KI-Textgenerierungstools effektiv zu nutzen und anzupassen für die Erstellung von Inhalten."
    },
    description: {
      en: "This specialized course teaches you how to harness the power of AI language models for content creation, editing, and enhancement. From basic prompting techniques to advanced customization, you'll learn to create high-quality text content efficiently. Suitable for content creators, marketers, and writers looking to integrate AI into their writing process.",
      de: "Dieser spezialisierte Kurs lehrt Sie, wie Sie die Kraft von KI-Sprachmodellen für die Erstellung, Bearbeitung und Verbesserung von Inhalten nutzen können. Von grundlegenden Prompting-Techniken bis hin zu fortgeschrittener Anpassung lernen Sie, effizient hochwertige Textinhalte zu erstellen. Geeignet für Content-Ersteller, Vermarkter und Autoren, die KI in ihren Schreibprozess integrieren möchten."
    },
    duration: "4 weeks",
    level: "Beginner",
    format: "Online",
    price: 399,
    category: "AI Text", // Using valid category
    start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    image_url: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=800&q=80",
    instructor: "Dr. Emily Rodriguez",
    interval: "Weekly",
    max_participants: 40,
    target_group: {
      en: "Content creators, writers, marketers, and professionals who work with text",
      de: "Content-Ersteller, Autoren, Vermarkter und Fachleute, die mit Text arbeiten"
    },
    syllabus: [
      {
        order_num: 1,
        title: { en: "Introduction to AI Text Generation", de: "Einführung in die KI-Texterstellung" },
        description: {
          en: "Understanding language models, capabilities, limitations, and ethical considerations.",
          de: "Verständnis von Sprachmodellen, Fähigkeiten, Einschränkungen und ethischen Überlegungen."
        }
      },
      {
        order_num: 2,
        title: { en: "Effective Prompting Techniques", de: "Effektive Prompting-Techniken" },
        description: {
          en: "Crafting clear, specific prompts to get the best results from AI language models.",
          de: "Erstellung klarer, spezifischer Prompts, um die besten Ergebnisse von KI-Sprachmodellen zu erhalten."
        }
      },
      {
        order_num: 3,
        title: { en: "Content Editing and Enhancement", de: "Inhaltsbearbeitung und -verbesserung" },
        description: {
          en: "Using AI to improve existing text, fix grammar, enhance clarity, and adapt tone.",
          de: "Verwendung von KI zur Verbesserung vorhandener Texte, Korrektur von Grammatik, Verbesserung der Klarheit und Anpassung des Tons."
        }
      },
      {
        order_num: 4,
        title: { en: "Specialized Text Applications", de: "Spezialisierte Textanwendungen" },
        description: {
          en: "Creating different types of content: marketing copy, creative writing, technical documentation.",
          de: "Erstellung verschiedener Arten von Inhalten: Marketingtexte, kreatives Schreiben, technische Dokumentation."
        }
      }
    ],
    objectives: [
      {
        order_num: 1,
        objective: {
          en: "Understand how AI language models work and their practical applications",
          de: "Verstehen Sie, wie KI-Sprachmodelle funktionieren und ihre praktischen Anwendungen"
        }
      },
      {
        order_num: 2,
        objective: {
          en: "Develop prompt engineering skills to get optimal results from AI tools",
          de: "Entwickeln Sie Prompt-Engineering-Fähigkeiten, um optimale Ergebnisse von KI-Tools zu erhalten"
        }
      },
      {
        order_num: 3,
        objective: {
          en: "Create various types of professional content using AI assistance",
          de: "Erstellen Sie verschiedene Arten von professionellen Inhalten mit KI-Unterstützung"
        }
      },
      {
        order_num: 4,
        objective: {
          en: "Build efficient AI-powered workflows for different content creation needs",
          de: "Erstellen Sie effiziente KI-gestützte Workflows für verschiedene Anforderungen bei der Inhaltserstellung"
        }
      }
    ]
  },
  {
    id: crypto.randomUUID(),
    title: {
      en: "AI for Digital Marketing",
      de: "KI für digitales Marketing"
    },
    short_description: {
      en: "Transform your marketing strategy with AI-powered tools and techniques.",
      de: "Transformieren Sie Ihre Marketingstrategie mit KI-gestützten Tools und Techniken."
    },
    description: {
      en: "This practical course shows marketers how to leverage AI to enhance their digital marketing efforts. From automated customer segmentation to personalized content generation, you'll learn to implement AI solutions that drive engagement and conversion. Designed for marketing professionals seeking to stay competitive in the AI-driven landscape.",
      de: "Dieser praktische Kurs zeigt Marketingfachleuten, wie sie KI nutzen können, um ihre Digital-Marketing-Bemühungen zu verbessern. Von der automatisierten Kundensegmentierung bis zur personalisierten Inhaltserstellung lernen Sie, KI-Lösungen zu implementieren, die Engagement und Konversion fördern. Konzipiert für Marketing-Fachleute, die in der KI-gesteuerten Landschaft wettbewerbsfähig bleiben möchten."
    },
    duration: "8 weeks",
    level: "Intermediate",
    format: "Online",
    price: 799,
    category: "AI Marketing", // Using valid category
    start_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks from now
    image_url: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80",
    instructor: "Prof. David Kim",
    interval: "Weekly",
    max_participants: 30,
    target_group: {
      en: "Marketing professionals, digital marketers, and business owners",
      de: "Marketing-Fachleute, Digital-Marketer und Unternehmensinhaber"
    },
    syllabus: [
      {
        order_num: 1,
        title: { en: "AI Marketing Landscape", de: "KI-Marketing-Landschaft" },
        description: {
          en: "Overview of AI applications in marketing and their impact on the industry.",
          de: "Überblick über KI-Anwendungen im Marketing und ihre Auswirkungen auf die Branche."
        }
      },
      {
        order_num: 2,
        title: { en: "Customer Segmentation & Targeting", de: "Kundensegmentierung & Targeting" },
        description: {
          en: "Using AI for data analysis, audience segmentation, and predictive targeting.",
          de: "Verwendung von KI für Datenanalyse, Zielgruppensegmentierung und prädiktives Targeting."
        }
      },
      {
        order_num: 3,
        title: { en: "AI Content Marketing", de: "KI-Content-Marketing" },
        description: {
          en: "Generating and optimizing marketing content, emails, and social media posts with AI.",
          de: "Generierung und Optimierung von Marketing-Inhalten, E-Mails und Social-Media-Beiträgen mit KI."
        }
      },
      {
        order_num: 4,
        title: { en: "Conversion Optimization", de: "Konversionsoptimierung" },
        description: {
          en: "Implementing AI for A/B testing, personalization, and conversion rate improvement.",
          de: "Implementierung von KI für A/B-Tests, Personalisierung und Verbesserung der Konversionsrate."
        }
      }
    ],
    objectives: [
      {
        order_num: 1,
        objective: {
          en: "Implement AI-powered customer segmentation and targeting strategies",
          de: "Implementieren Sie KI-gestützte Kundensegmentierung und Targeting-Strategien"
        }
      },
      {
        order_num: 2,
        objective: {
          en: "Create personalized marketing content at scale using AI tools",
          de: "Erstellen Sie personalisierte Marketing-Inhalte im großen Maßstab mit KI-Tools"
        }
      },
      {
        order_num: 3,
        objective: {
          en: "Optimize marketing campaigns with AI-driven insights and testing",
          de: "Optimieren Sie Marketingkampagnen mit KI-gestützten Erkenntnissen und Tests"
        }
      },
      {
        order_num: 4,
        objective: {
          en: "Develop an AI transformation roadmap for your marketing operations",
          de: "Entwickeln Sie einen KI-Transformationsfahrplan für Ihre Marketingaktivitäten"
        }
      }
    ]
  }
];

serve(async (req) => {
  try {
    // Create a Supabase client with the admin key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("Starting to seed courses");

    // Insert courses
    for (const course of sampleCourses) {
      // Extract syllabus and objectives from the sample data
      const { syllabus, objectives, id, ...courseData } = course;

      console.log(`Inserting course: ${course.title.en}`);

      // Insert the course first
      const { data: insertedCourse, error: courseError } = await supabaseAdmin
        .from('courses')
        .insert({
          id,
          ...courseData,
        })
        .select()
        .single();

      if (courseError) {
        console.error(`Error inserting course ${course.title.en}:`, courseError);
        continue;
      }

      console.log(`Successfully inserted course: ${insertedCourse.id}`);

      // Insert syllabus items
      for (const item of syllabus) {
        console.log(`Inserting syllabus item ${item.order_num} for course ${insertedCourse.id}`);
        
        const { error: syllabusError } = await supabaseAdmin
          .from('course_syllabus')
          .insert({
            course_id: insertedCourse.id,
            order_num: item.order_num,
            title: item.title,
            description: item.description
          });

        if (syllabusError) {
          console.error(`Error inserting syllabus item ${item.order_num}:`, syllabusError);
        }
      }

      // Insert objectives
      for (const item of objectives) {
        console.log(`Inserting objective ${item.order_num} for course ${insertedCourse.id}`);
        
        const { error: objectiveError } = await supabaseAdmin
          .from('course_objectives')
          .insert({
            course_id: insertedCourse.id,
            order_num: item.order_num,
            objective: item.objective
          });

        if (objectiveError) {
          console.error(`Error inserting objective ${item.order_num}:`, objectiveError);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Sample courses added successfully" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
