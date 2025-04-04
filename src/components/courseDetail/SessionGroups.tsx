
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, RefreshCw, Loader2, CheckCircle2, ExternalLink, Users } from 'lucide-react';
import { useSessionGroups } from '@/hooks/useSessionGroups';

interface SessionGroups_Props {
  courseId: string;
  isEnrolled: boolean;
}

const SessionGroups = ({ courseId, isEnrolled }: SessionGroups_Props) => {
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
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (isEnrolled) {
      checkAuth();
      fetchSessionGroups(courseId);
    }
  }, [courseId, isEnrolled]);

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
      return format(new Date(dateString), 'PPP');
    } catch (e) {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP p');
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
      
      // Find a valid timetable_id for this session group
      const { data: timetableData, error: timetableError } = await supabase
        .from('course_timetable')
        .select('id')
        .eq('session_group_id', selectedGroup.id)
        .limit(1);
        
      if (timetableError) throw timetableError;
      
      // Insert booking for the session group
      const { error } = await supabase
        .from('session_bookings')
        .insert({
          user_id: userId,
          session_group_id: selectedGroup.id,
          status: 'Confirmed',
          // We still need to provide a timetable_id as it's required by the database schema
          // In the future, consider making this field nullable or optional
          timetable_id: timetableData && timetableData.length > 0 
            ? timetableData[0].id 
            : '00000000-0000-0000-0000-000000000000'
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

  if (!isEnrolled) {
    return null;
  }

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap justify-between items-start">
            <div>
              <CardTitle>
                {language === 'en' ? 'Session Groups' : 'Sitzungsgruppen'}
              </CardTitle>
              <CardDescription className="mt-1">
                {language === 'en' 
                  ? 'Exclusive live sessions for enrolled students' 
                  : 'Exklusive Live-Sitzungen für eingeschriebene Studenten'}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing || loading}
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1" />
              )}
              {language === 'en' ? 'Refresh' : 'Aktualisieren'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sessionGroups.length === 0 ? (
            <div className="text-center py-8 border rounded-md">
              <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">
                {language === 'en' ? 'No session groups available' : 'Keine Sitzungsgruppen verfügbar'}
              </h3>
              <p className="text-muted-foreground mt-1">
                {language === 'en' 
                  ? 'Check back later for upcoming sessions' 
                  : 'Schauen Sie später für kommende Sitzungen vorbei'}
              </p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {sessionGroups.map((group, index) => (
                <AccordionItem key={group.id} value={`item-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex flex-col md:flex-row md:justify-between w-full text-left pr-4">
                      <div className="font-medium">
                        {group.name}
                        {userBookings[group.id] && (
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
                          <CalendarDays className="h-4 w-4 mr-1 text-primary" />
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
                        <div className="flex items-center">
                          <span className="font-medium text-primary">
                            {formatPrice(group.price)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          onClick={() => handleViewSessions(group)}
                          variant={userBookings[group.id] ? "outline" : "default"}
                        >
                          {userBookings[group.id] ? (
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
              ))}
            </Accordion>
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
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{language === 'en' ? 'Date & Time' : 'Datum & Uhrzeit'}</TableHead>
                            <TableHead>{language === 'en' ? 'Session' : 'Sitzung'}</TableHead>
                            <TableHead>{language === 'en' ? 'Module' : 'Modul'}</TableHead>
                            {userBookings[selectedGroup.id] && (
                              <TableHead>{language === 'en' ? 'Links' : 'Links'}</TableHead>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sessions.map((session) => (
                            <TableRow key={session.id}>
                              <TableCell>
                                <div className="font-medium">
                                  {formatDateTime(session.session_date)}
                                </div>
                                {session.session_end_date && (
                                  <div className="text-sm text-muted-foreground">
                                    {language === 'en' ? 'to ' : 'bis '}
                                    {formatDateTime(session.session_end_date)}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div>{session.title}</div>
                                {session.description && (
                                  <div className="text-sm text-muted-foreground">{session.description}</div>
                                )}
                              </TableCell>
                              <TableCell>
                                {session.course_syllabus ? (
                                  <span>
                                    {language === 'en' ? 'Module ' : 'Modul '}
                                    {session.course_syllabus.order_num + 1}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                              {userBookings[selectedGroup.id] && (
                                <TableCell>
                                  <div className="flex gap-2">
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
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionGroups;
