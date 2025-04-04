
import { Course } from '../types';

export const courses: Course[] = [
  {
    id: '1',
    title: {
      en: 'Introduction to Machine Learning',
      de: 'Einführung in Machine Learning'
    },
    shortDescription: {
      en: 'Learn the fundamentals of machine learning with practical applications.',
      de: 'Erlernen Sie die Grundlagen des maschinellen Lernens mit praktischen Anwendungen.'
    },
    description: {
      en: 'A comprehensive introduction to the principles and applications of machine learning. Learn about supervised and unsupervised learning, model evaluation, and practical implementation using Python and popular ML libraries.',
      de: 'Eine umfassende Einführung in die Prinzipien und Anwendungen des maschinellen Lernens. Lernen Sie über überwachtes und unüberwachtes Lernen, Modellbewertung und praktische Implementierung mit Python und populären ML-Bibliotheken.'
    },
    duration: '8 weeks',
    level: 'Beginner',
    format: 'Online',
    price: 799,
    category: 'Machine Learning',
    startDate: '2023-09-15',
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80',
    instructor: 'Dr. Sarah Johnson',
    interval: 'Weekly',
    maxParticipants: 30,
    targetGroup: {
      en: 'Beginners interested in AI and data science',
      de: 'Anfänger, die sich für KI und Data Science interessieren'
    },
    syllabus: [
      {
        title: {
          en: 'Introduction to ML Concepts',
          de: 'Einführung in ML-Konzepte'
        },
        description: {
          en: 'Overview of machine learning, types of learning, and common applications.',
          de: 'Überblick über maschinelles Lernen, Lerntypen und gängige Anwendungen.'
        }
      },
      {
        title: {
          en: 'Data Preprocessing',
          de: 'Datenvorverarbeitung'
        },
        description: {
          en: 'Techniques for cleaning, transforming, and preparing data for ML models.',
          de: 'Techniken zur Bereinigung, Transformation und Vorbereitung von Daten für ML-Modelle.'
        }
      },
      {
        title: {
          en: 'Supervised Learning Algorithms',
          de: 'Algorithmen für überwachtes Lernen'
        },
        description: {
          en: 'Linear regression, logistic regression, decision trees, and random forests.',
          de: 'Lineare Regression, logistische Regression, Entscheidungsbäume und Random Forests.'
        }
      },
      {
        title: {
          en: 'Unsupervised Learning',
          de: 'Unüberwachtes Lernen'
        },
        description: {
          en: 'Clustering, dimensionality reduction, and anomaly detection.',
          de: 'Clustering, Dimensionalitätsreduktion und Anomalieerkennung.'
        }
      },
      {
        title: {
          en: 'Model Evaluation',
          de: 'Modellbewertung'
        },
        description: {
          en: 'Metrics and techniques to assess model performance and generalization.',
          de: 'Metriken und Techniken zur Bewertung der Modellleistung und Generalisierung.'
        }
      },
      {
        title: {
          en: 'Feature Engineering',
          de: 'Feature-Engineering'
        },
        description: {
          en: 'Creating and selecting features to improve model performance.',
          de: 'Erstellen und Auswählen von Features zur Verbesserung der Modellleistung.'
        }
      },
      {
        title: {
          en: 'ML in Production',
          de: 'ML in der Produktion'
        },
        description: {
          en: 'Deploying and monitoring machine learning models in real-world applications.',
          de: 'Bereitstellung und Überwachung von Machine-Learning-Modellen in realen Anwendungen.'
        }
      },
      {
        title: {
          en: 'ML Ethics and Bias',
          de: 'ML-Ethik und Voreingenommenheit'
        },
        description: {
          en: 'Understanding ethical considerations and addressing bias in machine learning.',
          de: 'Verständnis ethischer Überlegungen und Behandlung von Voreingenommenheit im maschinellen Lernen.'
        }
      },
    ],
    objectives: [
      {
        en: 'Understand fundamental ML concepts and algorithms',
        de: 'Verstehen grundlegender ML-Konzepte und Algorithmen'
      },
      {
        en: 'Implement and evaluate ML models using Python libraries like scikit-learn',
        de: 'Implementieren und evaluieren Sie ML-Modelle mit Python-Bibliotheken wie scikit-learn'
      },
      {
        en: 'Preprocess and transform data for ML applications',
        de: 'Vorverarbeiten und transformieren Sie Daten für ML-Anwendungen'
      },
      {
        en: 'Select appropriate ML algorithms for specific problems',
        de: 'Wählen Sie geeignete ML-Algorithmen für spezifische Probleme'
      },
      {
        en: 'Apply best practices for model evaluation and validation',
        de: 'Wenden Sie Best Practices für Modellbewertung und -validierung an'
      }
    ]
  },
  {
    id: '2',
    title: {
      en: 'Deep Learning Fundamentals',
      de: 'Grundlagen des Deep Learning'
    },
    shortDescription: {
      en: 'Master neural networks and deep learning architectures.',
      de: 'Beherrschen Sie neuronale Netzwerke und Deep-Learning-Architekturen.'
    },
    description: {
      en: 'Explore the foundations of neural networks and deep learning architectures. This course covers feedforward networks, CNNs, RNNs, and hands-on implementation using TensorFlow and PyTorch.',
      de: 'Erkunden Sie die Grundlagen von neuronalen Netzwerken und Deep-Learning-Architekturen. Dieser Kurs behandelt Feedforward-Netzwerke, CNNs, RNNs und praktische Implementierung mit TensorFlow und PyTorch.'
    },
    duration: '10 weeks',
    level: 'Intermediate',
    format: 'Hybrid',
    price: 1299,
    category: 'Deep Learning',
    startDate: '2023-10-01',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80',
    instructor: 'Prof. Michael Chen',
    interval: 'Weekly',
    maxParticipants: 25,
    targetGroup: {
      en: 'Intermediate programmers with basic ML knowledge',
      de: 'Fortgeschrittene Programmierer mit grundlegenden ML-Kenntnissen'
    },
    syllabus: [
      {
        title: {
          en: 'Neural Network Foundations',
          de: 'Grundlagen neuronaler Netzwerke'
        },
        description: {
          en: 'Building blocks of neural networks, activation functions, and backpropagation.',
          de: 'Bausteine neuronaler Netzwerke, Aktivierungsfunktionen und Backpropagation.'
        }
      },
      {
        title: {
          en: 'Deep Learning Frameworks',
          de: 'Deep-Learning-Frameworks'
        },
        description: {
          en: 'Introduction to TensorFlow and PyTorch for implementing deep learning models.',
          de: 'Einführung in TensorFlow und PyTorch zur Implementierung von Deep-Learning-Modellen.'
        }
      },
      {
        title: {
          en: 'Convolutional Neural Networks',
          de: 'Faltungsneuronale Netzwerke'
        },
        description: {
          en: 'Architectures and applications for computer vision tasks.',
          de: 'Architekturen und Anwendungen für Computer-Vision-Aufgaben.'
        }
      },
      {
        title: {
          en: 'Recurrent Neural Networks',
          de: 'Rekurrente neuronale Netzwerke'
        },
        description: {
          en: 'Sequential data modeling and applications in NLP and time series.',
          de: 'Sequentielle Datenmodellierung und Anwendungen in NLP und Zeitreihen.'
        }
      },
      {
        title: {
          en: 'Generative Models',
          de: 'Generative Modelle'
        },
        description: {
          en: 'VAEs, GANs, and other generative architectures.',
          de: 'VAEs, GANs und andere generative Architekturen.'
        }
      },
      {
        title: {
          en: 'Transfer Learning',
          de: 'Transfer-Learning'
        },
        description: {
          en: 'Leveraging pre-trained models for new tasks with limited data.',
          de: 'Nutzung vortrainierter Modelle für neue Aufgaben mit begrenzten Daten.'
        }
      },
      {
        title: {
          en: 'Model Optimization',
          de: 'Modelloptimierung'
        },
        description: {
          en: 'Techniques for improving training efficiency and model performance.',
          de: 'Techniken zur Verbesserung der Trainingseffizienz und Modellleistung.'
        }
      },
      {
        title: {
          en: 'Deep Learning Projects',
          de: 'Deep-Learning-Projekte'
        },
        description: {
          en: 'End-to-end implementation of real-world deep learning applications.',
          de: 'End-to-End-Implementierung von Deep-Learning-Anwendungen aus der Praxis.'
        }
      },
    ],
    objectives: [
      {
        en: 'Build and train neural networks using modern frameworks',
        de: 'Erstellen und trainieren Sie neuronale Netzwerke mit modernen Frameworks'
      },
      {
        en: 'Understand and implement various deep learning architectures',
        de: 'Verstehen und implementieren Sie verschiedene Deep-Learning-Architekturen'
      },
      {
        en: 'Apply deep learning to computer vision and NLP tasks',
        de: 'Wenden Sie Deep Learning auf Computer Vision und NLP-Aufgaben an'
      },
      {
        en: 'Optimize deep learning models for better performance',
        de: 'Optimieren Sie Deep-Learning-Modelle für bessere Leistung'
      },
      {
        en: 'Develop end-to-end deep learning applications',
        de: 'Entwickeln Sie End-to-End-Deep-Learning-Anwendungen'
      }
    ]
  },
  {
    id: '3',
    title: {
      en: 'Natural Language Processing Mastery',
      de: 'Meisterschaft in der Verarbeitung natürlicher Sprache'
    },
    shortDescription: {
      en: 'Advanced techniques for language understanding and generation.',
      de: 'Fortgeschrittene Techniken für Sprachverständnis und -generierung.'
    },
    description: {
      en: 'Master the techniques for processing and understanding human language data. Learn about tokenization, embeddings, language models, and transformer architectures like BERT and GPT.',
      de: 'Beherrschen Sie die Techniken zur Verarbeitung und zum Verständnis menschlicher Sprachdaten. Lernen Sie über Tokenisierung, Embeddings, Sprachmodelle und Transformer-Architekturen wie BERT und GPT.'
    },
    duration: '12 weeks',
    level: 'Advanced',
    format: 'Online',
    price: 1499,
    category: 'Natural Language Processing',
    startDate: '2023-09-20',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
    instructor: 'Dr. Emily Rodriguez',
    interval: 'Weekly',
    maxParticipants: 20,
    targetGroup: {
      en: 'Advanced programmers interested in language AI',
      de: 'Fortgeschrittene Programmierer, die sich für Sprach-KI interessieren'
    },
    syllabus: [
      {
        title: {
          en: 'NLP Foundations',
          de: 'NLP-Grundlagen'
        },
        description: {
          en: 'Text processing, tokenization, and basic linguistic concepts.',
          de: 'Textverarbeitung, Tokenisierung und grundlegende linguistische Konzepte.'
        }
      },
      {
        title: {
          en: 'Word Embeddings',
          de: 'Wort-Embeddings'
        },
        description: {
          en: 'Word2Vec, GloVe, and contextual embeddings.',
          de: 'Word2Vec, GloVe und kontextbezogene Embeddings.'
        }
      },
      {
        title: {
          en: 'Text Classification',
          de: 'Textklassifikation'
        },
        description: {
          en: 'Sentiment analysis, topic classification, and document categorization.',
          de: 'Stimmungsanalyse, Themenklassifikation und Dokumentenkategorisierung.'
        }
      },
      {
        title: {
          en: 'Language Modeling',
          de: 'Sprachmodellierung'
        },
        description: {
          en: 'N-gram models, neural language models, and their applications.',
          de: 'N-Gramm-Modelle, neuronale Sprachmodelle und ihre Anwendungen.'
        }
      },
      {
        title: {
          en: 'Sequence-to-Sequence Models',
          de: 'Sequence-to-Sequence-Modelle'
        },
        description: {
          en: 'Machine translation, summarization, and question answering.',
          de: 'Maschinelle Übersetzung, Zusammenfassung und Fragebeantwortung.'
        }
      },
      {
        title: {
          en: 'Transformer Architectures',
          de: 'Transformer-Architekturen'
        },
        description: {
          en: 'BERT, GPT, T5, and other transformer-based models.',
          de: 'BERT, GPT, T5 und andere transformerbasierte Modelle.'
        }
      },
      {
        title: {
          en: 'NLP in Production',
          de: 'NLP in der Produktion'
        },
        description: {
          en: 'Deploying and scaling NLP systems for real-world applications.',
          de: 'Bereitstellung und Skalierung von NLP-Systemen für reale Anwendungen.'
        }
      },
      {
        title: {
          en: 'Advanced NLP Topics',
          de: 'Fortgeschrittene NLP-Themen'
        },
        description: {
          en: 'Multi-modal learning, zero-shot learning, and prompt engineering.',
          de: 'Multimodales Lernen, Zero-Shot-Lernen und Prompt-Engineering.'
        }
      },
    ],
    objectives: [
      {
        en: 'Process and analyze text data for various NLP tasks',
        de: 'Verarbeiten und analysieren Sie Textdaten für verschiedene NLP-Aufgaben'
      },
      {
        en: 'Implement and fine-tune state-of-the-art language models',
        de: 'Implementieren und optimieren Sie modernste Sprachmodelle'
      },
      {
        en: 'Build applications for text classification, translation, and generation',
        de: 'Erstellen Sie Anwendungen für Textklassifikation, Übersetzung und Generierung'
      },
      {
        en: 'Understand and apply transformer architectures',
        de: 'Verstehen und wenden Sie Transformer-Architekturen an'
      },
      {
        en: 'Deploy scalable NLP systems for practical applications',
        de: 'Stellen Sie skalierbare NLP-Systeme für praktische Anwendungen bereit'
      }
    ]
  },
  {
    id: '4',
    title: {
      en: 'Computer Vision with Deep Learning',
      de: 'Computer Vision mit Deep Learning'
    },
    shortDescription: {
      en: 'Advanced techniques for image and video analysis using neural networks.',
      de: 'Fortgeschrittene Techniken zur Bild- und Videoanalyse mit neuronalen Netzwerken.'
    },
    description: {
      en: 'Learn advanced techniques in computer vision using deep learning. This course covers object detection, segmentation, face recognition, and generative models for image synthesis.',
      de: 'Lernen Sie fortgeschrittene Techniken im Bereich Computer Vision mit Deep Learning. Dieser Kurs behandelt Objekterkennung, Segmentierung, Gesichtserkennung und generative Modelle für die Bildsynthese.'
    },
    duration: '10 weeks',
    level: 'Advanced',
    format: 'Hybrid',
    price: 1399,
    category: 'Computer Vision',
    startDate: '2023-10-15',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    instructor: 'Prof. David Kim',
    interval: 'Weekly',
    maxParticipants: 25,
    targetGroup: {
      en: 'ML practitioners interested in visual data processing',
      de: 'ML-Praktiker, die sich für die Verarbeitung visueller Daten interessieren'
    },
    syllabus: [
      {
        title: {
          en: 'Computer Vision Fundamentals',
          de: 'Grundlagen der Computer Vision'
        },
        description: {
          en: 'Image processing, feature extraction, and traditional CV techniques.',
          de: 'Bildverarbeitung, Feature-Extraktion und traditionelle CV-Techniken.'
        }
      },
      {
        title: {
          en: 'CNNs for Image Classification',
          de: 'CNNs für Bildklassifikation'
        },
        description: {
          en: 'Architecture design, training, and evaluation for image classification tasks.',
          de: 'Architekturdesign, Training und Evaluierung für Bildklassifikationsaufgaben.'
        }
      },
      {
        title: {
          en: 'Object Detection',
          de: 'Objekterkennung'
        },
        description: {
          en: 'R-CNN family, YOLO, SSD, and other modern detection architectures.',
          de: 'R-CNN-Familie, YOLO, SSD und andere moderne Erkennungsarchitekturen.'
        }
      },
      {
        title: {
          en: 'Semantic Segmentation',
          de: 'Semantische Segmentierung'
        },
        description: {
          en: 'FCN, U-Net, DeepLab, and other segmentation approaches.',
          de: 'FCN, U-Net, DeepLab und andere Segmentierungsansätze.'
        }
      },
      {
        title: {
          en: 'Face Recognition',
          de: 'Gesichtserkennung'
        },
        description: {
          en: 'Face detection, alignment, and recognition using deep learning.',
          de: 'Gesichtserkennung, -ausrichtung und -identifikation mit Deep Learning.'
        }
      },
      {
        title: {
          en: 'Generative Models for Vision',
          de: 'Generative Modelle für Vision'
        },
        description: {
          en: 'GANs, diffusion models, and other approaches for image generation.',
          de: 'GANs, Diffusionsmodelle und andere Ansätze zur Bilderzeugung.'
        }
      },
      {
        title: {
          en: 'Video Analysis',
          de: 'Videoanalyse'
        },
        description: {
          en: 'Action recognition, tracking, and video understanding.',
          de: 'Aktionserkennung, Tracking und Videoanalyse.'
        }
      },
      {
        title: {
          en: 'Vision Transformers',
          de: 'Vision Transformers'
        },
        description: {
          en: 'ViT, DETR, and other transformer-based vision models.',
          de: 'ViT, DETR und andere transformerbasierte Vision-Modelle.'
        }
      },
    ],
    objectives: [
      {
        en: 'Implement state-of-the-art computer vision algorithms',
        de: 'Implementieren Sie modernste Computer-Vision-Algorithmen'
      },
      {
        en: 'Build systems for object detection and image segmentation',
        de: 'Erstellen Sie Systeme für Objekterkennung und Bildsegmentierung'
      },
      {
        en: 'Develop face recognition and biometric applications',
        de: 'Entwickeln Sie Anwendungen zur Gesichtserkennung und biometrische Anwendungen'
      },
      {
        en: 'Create models for image generation and manipulation',
        de: 'Erstellen Sie Modelle für Bilderzeugung und -manipulation'
      },
      {
        en: 'Apply computer vision techniques to real-world problems',
        de: 'Wenden Sie Computer-Vision-Techniken auf reale Probleme an'
      }
    ]
  },
  {
    id: '5',
    title: {
      en: 'Reinforcement Learning Fundamentals',
      de: 'Grundlagen des Reinforcement Learning'
    },
    shortDescription: {
      en: 'Master the techniques for training agents through rewards and environment interaction.',
      de: 'Beherrschen Sie die Techniken zum Training von Agenten durch Belohnungen und Umgebungsinteraktion.'
    },
    description: {
      en: 'Understand the principles of reinforcement learning and its applications. Learn about value-based methods, policy gradients, and deep reinforcement learning approaches.',
      de: 'Verstehen Sie die Prinzipien des Reinforcement Learning und seine Anwendungen. Lernen Sie über wertbasierte Methoden, Policy Gradients und Deep-Reinforcement-Learning-Ansätze.'
    },
    duration: '8 weeks',
    level: 'Intermediate',
    format: 'Online',
    price: 999,
    category: 'Reinforcement Learning',
    startDate: '2023-11-01',
    imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80',
    instructor: 'Dr. Robert Taylor',
    interval: 'Weekly',
    maxParticipants: 30,
    targetGroup: {
      en: 'ML practitioners interested in agent-based learning',
      de: 'ML-Praktiker, die sich für agentenbasiertes Lernen interessieren'
    },
    syllabus: [
      {
        title: {
          en: 'RL Foundations',
          de: 'RL-Grundlagen'
        },
        description: {
          en: 'Markov decision processes, rewards, states, and actions.',
          de: 'Markov-Entscheidungsprozesse, Belohnungen, Zustände und Aktionen.'
        }
      },
      {
        title: {
          en: 'Value-Based Methods',
          de: 'Wertbasierte Methoden'
        },
        description: {
          en: 'Q-learning, DQN, and extensions for value estimation.',
          de: 'Q-Learning, DQN und Erweiterungen zur Wertschätzung.'
        }
      },
      {
        title: {
          en: 'Policy Gradient Methods',
          de: 'Policy-Gradient-Methoden'
        },
        description: {
          en: 'REINFORCE, actor-critic, and trust region methods.',
          de: 'REINFORCE, Actor-Critic und Trust-Region-Methoden.'
        }
      },
      {
        title: {
          en: 'Deep Reinforcement Learning',
          de: 'Deep Reinforcement Learning'
        },
        description: {
          en: 'Combining deep learning with RL for complex problems.',
          de: 'Kombination von Deep Learning mit RL für komplexe Probleme.'
        }
      },
      {
        title: {
          en: 'Exploration vs. Exploitation',
          de: 'Exploration vs. Exploitation'
        },
        description: {
          en: 'Strategies for balancing exploration and exploitation in RL.',
          de: 'Strategien zur Balance zwischen Exploration und Exploitation in RL.'
        }
      },
      {
        title: {
          en: 'Multi-Agent RL',
          de: 'Multi-Agent RL'
        },
        description: {
          en: 'Approaches for systems with multiple learning agents.',
          de: 'Ansätze für Systeme mit mehreren lernenden Agenten.'
        }
      },
      {
        title: {
          en: 'RL for Robotics',
          de: 'RL für Robotik'
        },
        description: {
          en: 'Applications of RL in robotic control and manipulation.',
          de: 'Anwendungen von RL in der Robotersteuerung und -manipulation.'
        }
      },
      {
        title: {
          en: 'Advanced RL Topics',
          de: 'Fortgeschrittene RL-Themen'
        },
        description: {
          en: 'Hierarchical RL, meta-learning, and imitation learning.',
          de: 'Hierarchisches RL, Meta-Learning und Imitationslernen.'
        }
      },
    ],
    objectives: [
      {
        en: 'Understand fundamental RL concepts and algorithms',
        de: 'Verstehen grundlegender RL-Konzepte und Algorithmen'
      },
      {
        en: 'Implement value-based and policy-based methods',
        de: 'Implementieren wertbasierter und policy-basierter Methoden'
      },
      {
        en: 'Apply deep reinforcement learning to complex problems',
        de: 'Anwenden von Deep Reinforcement Learning auf komplexe Probleme'
      },
      {
        en: 'Design reward functions and environment interactions',
        de: 'Gestalten von Belohnungsfunktionen und Umgebungsinteraktionen'
      },
      {
        en: 'Develop RL applications for games, robotics, and other domains',
        de: 'Entwickeln von RL-Anwendungen für Spiele, Robotik und andere Bereiche'
      }
    ]
  },
  {
    id: '6',
    title: {
      en: 'AI Ethics and Responsible Development',
      de: 'KI-Ethik und verantwortungsvolle Entwicklung'
    },
    shortDescription: {
      en: 'Understand ethical considerations and governance in AI development.',
      de: 'Verstehen Sie ethische Überlegungen und Governance bei der KI-Entwicklung.'
    },
    description: {
      en: 'Explore the ethical considerations in AI development and deployment. This course covers bias, fairness, transparency, privacy, and governance frameworks for responsible AI.',
      de: 'Erforschen Sie die ethischen Überlegungen bei der Entwicklung und dem Einsatz von KI. Dieser Kurs behandelt Voreingenommenheit, Fairness, Transparenz, Datenschutz und Governance-Frameworks für verantwortungsvolle KI.'
    },
    duration: '6 weeks',
    level: 'Beginner',
    format: 'Online',
    price: 699,
    category: 'AI Ethics',
    startDate: '2023-09-10',
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80',
    instructor: 'Prof. Lisa Martinez',
    interval: 'Weekly',
    maxParticipants: 35,
    targetGroup: {
      en: 'AI practitioners, policymakers, and anyone interested in responsible AI',
      de: 'KI-Praktiker, politische Entscheidungsträger und alle, die an verantwortungsvoller KI interessiert sind'
    },
    syllabus: [
      {
        title: {
          en: 'Introduction to AI Ethics',
          de: 'Einführung in die KI-Ethik'
        },
        description: {
          en: 'Ethical frameworks, principles, and key considerations in AI.',
          de: 'Ethische Rahmenbedingungen, Prinzipien und wichtige Überlegungen in der KI.'
        }
      },
      {
        title: {
          en: 'Bias and Fairness',
          de: 'Voreingenommenheit und Fairness'
        },
        description: {
          en: 'Sources of bias, measuring fairness, and mitigation strategies.',
          de: 'Quellen von Voreingenommenheit, Messung von Fairness und Minderungsstrategien.'
        }
      },
      {
        title: {
          en: 'Transparency and Explainability',
          de: 'Transparenz und Erklärbarkeit'
        },
        description: {
          en: 'Methods for understanding and explaining AI decisions.',
          de: 'Methoden zum Verständnis und zur Erklärung von KI-Entscheidungen.'
        }
      },
      {
        title: {
          en: 'Privacy and Data Protection',
          de: 'Datenschutz und Datensicherheit'
        },
        description: {
          en: 'Privacy considerations, regulations, and privacy-preserving techniques.',
          de: 'Datenschutzüberlegungen, Vorschriften und datenschutzfördernde Techniken.'
        }
      },
      {
        title: {
          en: 'AI Governance',
          de: 'KI-Governance'
        },
        description: {
          en: 'Policies, standards, and frameworks for responsible AI development.',
          de: 'Richtlinien, Standards und Rahmenbedingungen für verantwortungsvolle KI-Entwicklung.'
        }
      },
      {
        title: {
          en: 'Case Studies in AI Ethics',
          de: 'Fallstudien zur KI-Ethik'
        },
        description: {
          en: 'Real-world examples of ethical challenges and approaches.',
          de: 'Reale Beispiele für ethische Herausforderungen und Lösungsansätze.'
        }
      },
    ],
    objectives: [
      {
        en: 'Identify ethical considerations in AI development and deployment',
        de: 'Identifizieren ethischer Überlegungen bei der KI-Entwicklung und -Bereitstellung'
      },
      {
        en: 'Apply frameworks for addressing bias and ensuring fairness',
        de: 'Anwenden von Frameworks zur Bekämpfung von Voreingenommenheit und zur Gewährleistung von Fairness'
      },
      {
        en: 'Implement approaches for transparent and explainable AI',
        de: 'Implementieren von Ansätzen für transparente und erklärbare KI'
      },
      {
        en: 'Design privacy-preserving AI systems',
        de: 'Entwerfen von datenschutzfördernden KI-Systemen'
      },
      {
        en: 'Develop governance strategies for responsible AI',
        de: 'Entwickeln von Governance-Strategien für verantwortungsvolle KI'
      }
    ]
  }
];
