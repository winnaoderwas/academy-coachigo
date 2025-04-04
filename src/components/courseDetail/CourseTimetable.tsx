
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Users, Calendar, Loader2, CheckCircle2, ExternalLink } from 'lucide-react';
import { useSessionGroups } from '@/hooks/useSessionGroups';

interface CourseTimetableProps {
  courseId: string;
  isEnrolled: boolean;
}

const CourseTimetable = ({ courseId, isEnrolled }: CourseTimetableProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { 
    sessionGroups, 
    loading, 
    refreshing, 
    fetchSessionGroups, 
    fetchSessionGroupSessions,
    setRefreshing 
  } = useSessionGroups();
  const [userBookings, setUserBookings] = useState<Record<string, boolean>>({});
  const [bookedGroups, setBookedGroups] = useState<any[]>([]);
  const [bookableGroups, setBookableGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    fetchSessionGroups(courseId);
  }, [courseId]);

  useEffect(() => {
    // Split session groups into booked and bookable
    if (sessionGroups.length > 0 && Object.keys(userBookings).length > 0) {
      const booked = sessionGroups.filter(group => userBookings[group.id]);
      const bookable = sessionGroups.filter(group => !userBookings[group.id]);
      
      setBookedGroups(booked);
      setBookableGroups(bookable);
    } else {
      setBookedGroups([]);
      setBookableGroups(sessionGroups);
    }
  }, [sessionGroups, userBookings]);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setUserId(data.session.user.id);
      fetchUserBookings(data.session.user.id);
    }
  };

  const fetchUserBookings = async (uid: string) => {
    try {
      // Get all bookings for this user
      const { data, error } = await supabase
        .from('session_bookings')
        .select('session_group_id')
        .eq('user_id', uid)
        .not('session_group_id', 'is', null);
        
      if (error) throw error;
      
      // Create a mapping of group IDs to booking status
      const bookings: Record<string, boolean> = {};
      (data || []).forEach((booking: any) => {
        if (booking.session_group_id) {
          bookings[booking.session_group_id] = true;
        }
      });
      
      setUserBookings(bookings);
    } catch (error: any) {
      console.error('Error fetching user bookings:', error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSessionGroups(courseId);
    if (userId) {
      fetchUserBookings(userId);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(
        new Date(dateString),
        'PPP',
        { locale: language === 'de' ? de : undefined }
      );
    } catch (e) {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(
        new Date(dateString),
        'PPP p',
        { locale: language === 'de' ? de : undefined }
      );
    } catch (e) {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const handleViewSessions = async (group: any) => {
    setSelectedGroup(group);
    
    try {
      const data = await fetchSessionGroupSessions(group.id);
      setSessions(data);
      setIsBookDialogOpen(true);
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleBookSessionGroup = async () => {
    if (!selectedGroup || !userId) return;
    
    try {
      setIsSubmitting(true);
      
      // Check if user already booked this session group
      if (userBookings[selectedGroup.id]) {
        toast({
          title: language === 'en' ? 'Already Booked' : 'Bereits gebucht',
          description: language === 'en' 
            ? 'You have already booked this session group' 
            : 'Sie haben diese Sitzungsgruppe bereits gebucht',
        });
        setIsSubmitting(false);
        return;
      }
      
      // Insert booking for the session group
      const { error } = await supabase
        .from('session_bookings')
        .insert({
          user_id: userId,
          session_group_id: selectedGroup.id,
          status: 'Confirmed',
          // We need to provide a timetable_id as it's required, but it will be ignored
          timetable_id: '00000000-0000-0000-0000-000000000000'
        });
        
      if (error) throw error;
      
      toast({
        title: language === 'en' ? 'Booking Successful' : 'Buchung erfolgreich',
        description: language === 'en' 
          ? 'You have successfully booked the session group' 
          : 'Sie haben die Sitzungsgruppe erfolgreich gebucht',
      });
      
      // Update local state
      setUserBookings({
        ...userBookings,
        [selectedGroup.id]: true
      });
      
      // Move the group from bookable to booked
      setBookedGroups([...bookedGroups, selectedGroup]);
      setBookableGroups(bookableGroups.filter(g => g.id !== selectedGroup.id));
      
      setIsBookDialogOpen(false);
    } catch (error: any) {
      console.error('Error booking session group:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSessionGroupAccordion = (group: any, isBooked: boolean) => {
    return (
      <AccordionItem key={group.id} value={group.id}>
        <AccordionTrigger className="hover:no-underline">
          <div className="flex flex-col md:flex-row md:justify-between w-full text-left pr-4">
            <div className="font-medium">
              {group.name}
              {isBooked && (
                <Badge variant="success" className="ml-2">
                  {language === 'en' ? 'Booked' : 'Gebucht'}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-1 md:mt-0">
              {formatDate(group.startDate)}
              {group.endDate && ` - ${formatDate(group.endDate)}`}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="pt-2 pb-4">
            {group.description && (
              <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
            )}
            
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-primary" />
                <span className="text-sm">
                  {language === 'en' ? 'Starts' : 'Beginnt'}: {formatDate(group.startDate)}
                </span>
              </div>
              {group.maxParticipants && (
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-primary" />
                  <span className="text-sm">
                    {language === 'en' ? 'Max' : 'Max'}: {group.maxParticipants} {language === 'en' ? 'participants' : 'Teilnehmer'}
                  </span>
                </div>
              )}
              {!isBooked && (
                <div className="flex items-center">
                  <span className="font-medium text-primary">
                    {formatPrice(group.price)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={() => handleViewSessions(group)}
                variant={isBooked ? "outline" : "default"}
              >
                {isBooked ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    {language === 'en' ? 'View Sessions' : 'Sitzungen anzeigen'}
                  </>
                ) : (
                  <>
                    {language === 'en' ? 'Book Group' : 'Gruppe buchen'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  if (!isEnrolled) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          {language === 'en' ? 'Enroll to View Schedule' : 'Einschreiben, um Zeitplan anzuzeigen'}
        </h3>
        <p className="text-gray-500 mb-4">
          {language === 'en' 
            ? 'Complete enrollment to access the course schedule.' 
            : 'Schließen Sie die Anmeldung ab, um auf den Kursplan zuzugreifen.'}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  if (sessionGroups.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          {language === 'en' ? 'No Sessions Available' : 'Keine Sitzungen verfügbar'}
        </h3>
        <p className="text-gray-500 mb-4">
          {language === 'en' 
            ? 'There are currently no sessions scheduled for this course.' 
            : 'Für diesen Kurs sind derzeit keine Sitzungen geplant.'}
        </p>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          {language === 'en' ? 'Refresh' : 'Aktualisieren'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          {language === 'en' ? 'Refresh' : 'Aktualisieren'}
        </Button>
      </div>

      {/* Booked Sessions Section */}
      {bookedGroups.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {language === 'en' ? 'Your Booked Sessions' : 'Deine gebuchten Sessions'}
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {bookedGroups.map(group => renderSessionGroupAccordion(group, true))}
          </Accordion>
        </div>
      )}

      {/* Bookable Sessions Section */}
      {bookableGroups.length > 0 && (
        <div className={bookedGroups.length > 0 ? "mt-8" : ""}>
          <h2 className="text-xl font-semibold mb-4">
            {language === 'en' ? 'Available Sessions' : 'Buchbare Sessions'}
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {bookableGroups.map(group => renderSessionGroupAccordion(group, false))}
          </Accordion>
        </div>
      )}

      {selectedGroup && (
        <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedGroup.name}
              </DialogTitle>
              <DialogDescription>
                {userBookings[selectedGroup.id] 
                  ? (language === 'en' ? 'You are enrolled in these sessions' : 'Sie sind für diese Sitzungen angemeldet') 
                  : (language === 'en' ? 'Book this session group for ' : 'Buchen Sie diese Sitzungsgruppe für ') + formatPrice(selectedGroup.price)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="my-4">
              <h3 className="text-lg font-medium mb-2">
                {language === 'en' ? 'Session Schedule' : 'Sitzungszeitplan'}
              </h3>
              
              {sessions.length === 0 ? (
                <div className="text-center py-6 border rounded-md">
                  <p className="text-muted-foreground">
                    {language === 'en' ? 'No sessions found' : 'Keine Sitzungen gefunden'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <div>
                          <h4 className="font-medium">{session.title}</h4>
                          <div className="text-sm text-muted-foreground mt-1">
                            {formatDateTime(session.session_date)}
                            {session.session_end_date && (
                              <span> - {format(new Date(session.session_end_date), 'p', 
                                { locale: language === 'de' ? de : undefined })}
                              </span>
                            )}
                          </div>
                          {session.description && (
                            <p className="text-sm mt-2">{session.description}</p>
                          )}
                          {session.course_syllabus && (
                            <div className="text-sm text-primary mt-1">
                              {language === 'en' ? 'Module ' : 'Modul '}
                              {session.course_syllabus.order_num + 1}: {session.course_syllabus.title}
                            </div>
                          )}
                        </div>
                        
                        {userBookings[selectedGroup.id] && (
                          <div className="flex gap-2 mt-3 md:mt-0">
                            {session.zoom_link && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-blue-600"
                                asChild
                              >
                                <a href={session.zoom_link} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  Zoom
                                </a>
                              </Button>
                            )}
                            {session.chatgroup_link && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-green-600"
                                asChild
                              >
                                <a href={session.chatgroup_link} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  Chat
                                </a>
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsBookDialogOpen(false)}
              >
                {language === 'en' ? 'Close' : 'Schließen'}
              </Button>
              
              {!userBookings[selectedGroup.id] && (
                <Button 
                  onClick={handleBookSessionGroup}
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {language === 'en' ? 'Book Group for ' : 'Gruppe buchen für '}{formatPrice(selectedGroup.price)}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CourseTimetable;
