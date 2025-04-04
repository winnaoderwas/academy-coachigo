
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type CourseFormat = 'Online' | 'In-Person' | 'Hybrid' | 'Offline';
export type CourseCategory =
  | 'Web Development'
  | 'Data Science'
  | 'Mobile Development'
  | 'Design'
  | 'Marketing'
  | 'Business'
  | 'Machine Learning'
  | 'Deep Learning'
  | 'Natural Language Processing'
  | 'Computer Vision'
  | 'Reinforcement Learning'
  | 'AI Ethics';

export type Course = {
  id: string;
  title: {
    en: string;
    de: string;
  };
  shortDescription: {
    en: string;
    de: string;
  };
  description: {
    en: string;
    de: string;
  };
  duration: string;
  level: CourseLevel;
  format: CourseFormat;
  price: number;
  category: CourseCategory;
  startDate: string;
  imageUrl: string;
  instructor: string;
  interval: 'Weekly' | 'Monthly' | 'One-time';
  maxParticipants: number;
  targetGroup: {
    en: string;
    de: string;
  };
  syllabus: {
    title: string;
    description: string;
  }[];
  objectives: {
    en: string;
    de: string;
  }[];
  course_type?: 'course' | 'bootcamp'; // Make it optional to maintain compatibility
  openinfo_video?: string | null; // Added this property
  courseinfo_video?: string | null; // Added this property
};

export type CartItem = {
  courseId: string;
  quantity: number;
};

// Update the SessionGroup type to support both kebab-case and snake_case properties
export type SessionGroup = {
  id: string;
  course_id: string;
  courseId?: string; // Alias for course_id
  name: string;
  description?: string;
  price: number;
  max_participants?: number;
  maxParticipants?: number; // Alias for max_participants
  start_date: string;
  startDate?: string; // Alias for start_date
  end_date?: string;
  endDate?: string; // Alias for end_date
  is_active: boolean;
  isActive?: boolean; // Alias for is_active
  // Additional properties used in some components
  createdAt?: string;
  updatedAt?: string;
  courseName?: string;
  bookingsCount?: number;
};

// Add any other type definitions that were used in the codebase
export type Language = 'en' | 'de';

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string | {
    en: string;
    de: string;
  };
  rating: number;
  image: string;
  imageUrl?: string; // Added for backward compatibility
};

export type Order = {
  id: string;
  user_id: string | null; // Changed to allow null for guest checkout
  order_date: string;
  total_amount: number;
  payment_status: string;
  payment_method?: string;
  invoice_id?: string;
  guest_email?: string; // Added for guest checkout
};

export type CourseType = 'course' | 'bootcamp' | 'all';

export type Address = {
  street: string;
  zipCode: string;
  city: string;
  country: string;
};
