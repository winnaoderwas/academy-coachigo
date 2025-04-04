
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Video } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const bookingFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  topic: z.string({
    required_error: "Please select a topic for your coaching session.",
  }),
  date: z.date({
    required_error: "Please select a date for your coaching session.",
  }),
  time: z.string({
    required_error: "Please select a preferred time.",
  }),
  message: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  requestType?: string;
}

const BookingForm = ({ requestType = 'coaching' }: BookingFormProps) => {
  const { language } = useLanguage();
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  // Define topic options based on requestType
  const getTopicOptions = () => {
    if (requestType === 'bootcamp') {
      return [
        { value: "ai-bootcamp", label: "AI Weekend Bootcamp" },
        { value: "prompt-engineering", label: "Prompt Engineering Intensive" },
        { value: "multimedia-production", label: "Multimedia Production Crash Course" },
        { value: "data-science", label: "Data Science Weekend" },
        { value: "other", label: "Other" },
      ];
    }
    
    // Default coaching topics
    return [
      { value: "ai-basics", label: "AI Fundamentals" },
      { value: "deep-learning", label: "Deep Learning" },
      { value: "nlp", label: "Natural Language Processing" },
      { value: "computer-vision", label: "Computer Vision" },
      { value: "multimedia", label: "Multimedia Production" },
      { value: "other", label: "Other" },
    ];
  };

  const topics = getTopicOptions();

  const timeSlots = [
    { value: "morning", label: "Morning (9:00 - 12:00)" },
    { value: "afternoon", label: "Afternoon (13:00 - 17:00)" },
    { value: "evening", label: "Evening (18:00 - 20:00)" },
  ];

  async function onSubmit(data: BookingFormValues) {
    console.log(data);
    
    try {
      // Insert data into the contact_messages table
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: data.name,
          email: data.email,
          subject: `${requestType.charAt(0).toUpperCase() + requestType.slice(1)} Request: ${data.topic}`,
          message: data.message || '',
          request_type: requestType,
          preferred_date: data.date.toISOString(),
          preferred_time: data.time,
          topic: data.topic
        });
      
      if (error) throw error;
      
      toast.success(
        language === "en"
          ? `${requestType.charAt(0).toUpperCase() + requestType.slice(1)} request sent! We'll contact you soon to confirm your session.`
          : `${requestType === 'coaching' ? 'Coaching' : 'Bootcamp'}-Anfrage gesendet! Wir werden Sie bald kontaktieren, um Ihre Sitzung zu bestätigen.`
      );
      form.reset();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(
        language === "en"
          ? `Failed to send ${requestType} request. Please try again later.`
          : `Fehler beim Senden der ${requestType === 'coaching' ? 'Coaching' : 'Bootcamp'}-Anfrage. Bitte versuchen Sie es später noch einmal.`
      );
    }
  }

  const topicsTranslated = topics.map(topic => ({
    value: topic.value,
    label: language === "en" ? topic.label : translateTopic(topic.value, requestType)
  }));

  const timeSlotsTranslated = timeSlots.map(slot => ({
    value: slot.value,
    label: language === "en" ? slot.label : translateTimeSlot(slot.value)
  }));

  function translateTopic(value: string, type: string): string {
    if (type === 'bootcamp') {
      switch (value) {
        case "ai-bootcamp": return "KI-Wochenend-Bootcamp";
        case "prompt-engineering": return "Prompt-Engineering Intensiv";
        case "multimedia-production": return "Multimedia-Produktion Crashkurs";
        case "data-science": return "Data Science Wochenende";
        case "other": return "Andere";
        default: return value;
      }
    }
    
    // Default coaching translations
    switch (value) {
      case "ai-basics": return "KI-Grundlagen";
      case "deep-learning": return "Deep Learning";
      case "nlp": return "Natürliche Sprachverarbeitung";
      case "computer-vision": return "Computer Vision";
      case "multimedia": return "Multimedia-Produktion";
      case "other": return "Andere";
      default: return value;
    }
  }

  function translateTimeSlot(value: string): string {
    switch (value) {
      case "morning": return "Vormittag (9:00 - 12:00)";
      case "afternoon": return "Nachmittag (13:00 - 17:00)";
      case "evening": return "Abend (18:00 - 20:00)";
      default: return value;
    }
  }

  const getFormTitle = () => {
    if (requestType === 'bootcamp') {
      return language === "en" 
        ? "Register for a Bootcamp" 
        : "Melden Sie sich für ein Bootcamp an";
    }
    return language === "en" 
      ? "Book Your Free Initial Consultation" 
      : "Buchen Sie Ihr kostenloses Erstgespräch";
  };

  const getButtonText = () => {
    if (requestType === 'bootcamp') {
      return language === "en" 
        ? "Register for Bootcamp" 
        : "Für Bootcamp anmelden";
    }
    return language === "en" 
      ? "Book Your Free Consultation" 
      : "Buchen Sie Ihr kostenloses Erstgespräch";
  };

  return (
    <div className="glass p-8 rounded-xl">
      <div className="flex items-center gap-2 mb-6">
        <Video className="h-6 w-6 text-primary" />
        <h3 className="text-2xl font-bold">
          {getFormTitle()}
        </h3>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === "en" ? "Name" : "Name"}</FormLabel>
                  <FormControl>
                    <Input placeholder={language === "en" ? "Your full name" : "Ihr vollständiger Name"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === "en" ? "Email" : "E-Mail"}</FormLabel>
                  <FormControl>
                    <Input placeholder={language === "en" ? "Your email address" : "Ihre E-Mail-Adresse"} type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === "en" ? "Phone (optional)" : "Telefon (optional)"}</FormLabel>
                  <FormControl>
                    <Input placeholder={language === "en" ? "Your phone number" : "Ihre Telefonnummer"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === "en" ? "Topic" : "Thema"}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={language === "en" ? "Select a topic" : "Wählen Sie ein Thema"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {topicsTranslated.map((topic) => (
                        <SelectItem key={topic.value} value={topic.value}>
                          {topic.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{language === "en" ? "Date" : "Datum"}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: language === 'en' ? undefined : de })
                          ) : (
                            <span>{language === "en" ? "Pick a date" : "Wählen Sie ein Datum"}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === "en" ? "Preferred Time" : "Bevorzugte Zeit"}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={language === "en" ? "Select a time" : "Wählen Sie eine Zeit"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlotsTranslated.map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{language === "en" ? "Message (optional)" : "Nachricht (optional)"}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={language === "en" 
                      ? `Tell us more about what you want to achieve with this ${requestType}...` 
                      : `Erzählen Sie uns mehr darüber, was Sie mit diesem ${requestType === 'coaching' ? 'Coaching' : 'Bootcamp'} erreichen möchten...`} 
                    className="resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  {language === "en" 
                    ? "Any specific questions or areas you'd like to focus on?" 
                    : "Haben Sie spezifische Fragen oder Bereiche, auf die Sie sich konzentrieren möchten?"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full">
            {getButtonText()}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BookingForm;
