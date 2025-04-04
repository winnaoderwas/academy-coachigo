
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { SessionGroup } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Clock, Trash2, Plus, Loader2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SessionsManagerProps {
  isOpen: boolean;
  onClose: () => void;
  sessionGroup: SessionGroup;
}

type SyllabusModule = {
  id: string;
  title: string;
  order_num: number;
};

type SessionData = {
  id: string;
  title: string;
  description: string | null;
  session_date: string;
  session_end_date: string | null;
  zoom_link: string | null;
  chatgroup_link: string | null;
  max_participants: number | null;
  course_syllabus_id: string | null;
  bookings_count: number;
  course_syllabus?: {
    title: string;
    order_num: number;
  } | null;
};

type FormData = {
  title: string;
  description: string;
  session_date: Date;
  session_time: string;
  session_end_date: Date | null;
  session_end_time: string;
  zoom_link: string;
  chatgroup_link: string;
  max_participants: string;
  course_syllabus_id: string;
};

const SessionsManager = ({ isOpen, onClose, sessionGroup }: SessionsManagerProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [syllabusModules, setSyllabusModules] = useState<SyllabusModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    session_date: new Date(),
    session_time: '10:00',
    session_end_date: null,
    session_end_time: '12:00',
    zoom_link: '',
    chatgroup_link: '',
    max_participants: '',
    course_syllabus_id: '',
  });
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  useEffect(() => {
    fetchSyllabusModules();
    fetchSessions();
  }, [sessionGroup.id]);

  const fetchSyllabusModules = async () => {
    try {
      const { data, error } = await supabase
        .from('course_syllabus')
        .select('id, title, order_num')
        .eq('course_id', sessionGroup.courseId)
        .order('order_num', { ascending: true });
        
      if (error) throw error;
      
      setSyllabusModules(data || []);
    } catch (error: any) {
      console.error('Error fetching syllabus modules:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('course_timetable')
        .select(`
          id,
          title,
          description,
          session_date,
          session_end_date,
          zoom_link,
          chatgroup_link,
          max_participants,
          course_syllabus_id,
          course_syllabus (
            title,
            order_num
          )
        `)
        .eq('session_group_id', sessionGroup.id)
        .order('session_date', { ascending: true });
        
      if (error) throw error;

      // Fetch booking counts for each session
      const sessionData = await Promise.all((data || []).map(async (session) => {
        const { count, error: countError } = await supabase
          .from('session_bookings')
          .select('*', { count: 'exact', head: true })
          .eq('timetable_id', session.id);
          
        if (countError) {
          console.error('Error fetching booking count:', countError);
        }
        
        return {
          ...session,
          bookings_count: count || 0
        };
      }));
      
      setSessions(sessionData);
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSessions();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined, field: 'session_date' | 'session_end_date') => {
    if (date) {
      setFormData(prev => ({ ...prev, [field]: date }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      session_date: new Date(),
      session_time: '10:00',
      session_end_date: null,
      session_end_time: '12:00',
      zoom_link: '',
      chatgroup_link: '',
      max_participants: '',
      course_syllabus_id: '',
    });
    setSelectedSession(null);
  };

  const handleEditSession = (session: SessionData) => {
    const sessionDate = new Date(session.session_date);
    const sessionTime = format(sessionDate, 'HH:mm');
    
    let sessionEndDate = null;
    let sessionEndTime = '';
    
    if (session.session_end_date) {
      sessionEndDate = new Date(session.session_end_date);
      sessionEndTime = format(sessionEndDate, 'HH:mm');
    }
    
    setFormData({
      title: session.title,
      description: session.description || '',
      session_date: sessionDate,
      session_time: sessionTime,
      session_end_date: sessionEndDate,
      session_end_time: sessionEndTime || '12:00',
      zoom_link: session.zoom_link || '',
      chatgroup_link: session.chatgroup_link || '',
      max_participants: session.max_participants ? session.max_participants.toString() : '',
      course_syllabus_id: session.course_syllabus_id || '',
    });
    
    setSelectedSession(session.id);
    setIsSessionDialogOpen(true);
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPP p');
    } catch (e) {
      return dateString;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const [sessionHours, sessionMinutes] = formData.session_time.split(':').map(Number);
      const sessionDate = new Date(formData.session_date);
      sessionDate.setHours(sessionHours, sessionMinutes, 0, 0);

      let sessionEndDate = null;
      if (formData.session_end_date && formData.session_end_time) {
        const [endHours, endMinutes] = formData.session_end_time.split(':').map(Number);
        sessionEndDate = new Date(formData.session_end_date);
        sessionEndDate.setHours(endHours, endMinutes, 0, 0);
      }

      const sessionData = {
        session_group_id: sessionGroup.id,
        course_id: sessionGroup.courseId,
        title: formData.title,
        description: formData.description || null,
        session_date: sessionDate.toISOString(),
        session_end_date: sessionEndDate ? sessionEndDate.toISOString() : null,
        zoom_link: formData.zoom_link || null,
        chatgroup_link: formData.chatgroup_link || null,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        course_syllabus_id: formData.course_syllabus_id || null,
      };

      let error;
      
      if (selectedSession) {
        // Update existing session
        const { error: updateError } = await supabase
          .from('course_timetable')
          .update(sessionData)
          .eq('id', selectedSession);
          
        error = updateError;
        
        if (!updateError) {
          toast({
            title: language === 'en' ? 'Session Updated' : 'Sitzung aktualisiert',
            description: language === 'en' 
              ? 'The session has been updated successfully' 
              : 'Die Sitzung wurde erfolgreich aktualisiert',
          });
        }
      } else {
        // Create new session
        const { error: insertError } = await supabase
          .from('course_timetable')
          .insert(sessionData);
          
        error = insertError;
        
        if (!insertError) {
          toast({
            title: language === 'en' ? 'Session Created' : 'Sitzung erstellt',
            description: language === 'en' 
              ? 'A new session has been created' 
              : 'Eine neue Sitzung wurde erstellt',
          });
        }
      }
      
      if (error) {
        throw error;
      }
      
      resetForm();
      fetchSessions();
      setIsSessionDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving session:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('course_timetable')
        .delete()
        .eq('id', sessionId);
        
      if (error) throw error;
      
      toast({
        title: language === 'en' ? 'Session Deleted' : 'Sitzung gelöscht',
        description: language === 'en' 
          ? 'The session has been deleted' 
          : 'Die Sitzung wurde gelöscht',
      });
      
      fetchSessions();
    } catch (error: any) {
      console.error('Error deleting session:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>
              {language === 'en' ? 'Manage Sessions' : 'Sitzungen verwalten'}: {sessionGroup.name}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? 'Create and manage individual sessions for this session group'
              : 'Erstellen und verwalten Sie einzelne Sitzungen für diese Sitzungsgruppe'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">
              {language === 'en' ? 'Session Schedule' : 'Sitzungszeitplan'}
            </h3>
            
            <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => { resetForm(); setIsSessionDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-1" />
                  {language === 'en' ? 'Add Session' : 'Sitzung hinzufügen'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {selectedSession 
                      ? (language === 'en' ? 'Edit Session' : 'Sitzung bearbeiten')
                      : (language === 'en' ? 'Add New Session' : 'Neue Sitzung hinzufügen')}
                  </DialogTitle>
                  <DialogDescription>
                    {language === 'en' 
                      ? 'Create or update a session for this course'
                      : 'Erstellen oder aktualisieren Sie eine Sitzung für diesen Kurs'}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">{language === 'en' ? 'Title' : 'Titel'} *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">{language === 'en' ? 'Description' : 'Beschreibung'}</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{language === 'en' ? 'Session Date' : 'Sitzungsdatum'} *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.session_date ? format(formData.session_date, 'PPP') : (
                              <span className="text-muted-foreground">
                                {language === 'en' ? 'Pick a date' : 'Datum auswählen'}
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.session_date}
                            onSelect={(date) => handleDateChange(date, 'session_date')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="session_time">{language === 'en' ? 'Start Time' : 'Startzeit'} *</Label>
                      <Input
                        id="session_time"
                        name="session_time"
                        type="time"
                        value={formData.session_time}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{language === 'en' ? 'End Date' : 'Enddatum'}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.session_end_date ? format(formData.session_end_date, 'PPP') : (
                              <span className="text-muted-foreground">
                                {language === 'en' ? 'Pick a date' : 'Datum auswählen'}
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.session_end_date || undefined}
                            onSelect={(date) => handleDateChange(date, 'session_end_date')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="session_end_time">{language === 'en' ? 'End Time' : 'Endzeit'}</Label>
                      <Input
                        id="session_end_time"
                        name="session_end_time"
                        type="time"
                        value={formData.session_end_time}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="course_syllabus_id">{language === 'en' ? 'Related Module' : 'Zugehöriges Modul'}</Label>
                    <Select 
                      value={formData.course_syllabus_id} 
                      onValueChange={(value) => handleSelectChange('course_syllabus_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'en' ? 'Select module' : 'Modul auswählen'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">
                          {language === 'en' ? '-- No specific module --' : '-- Kein spezifisches Modul --'}
                        </SelectItem>
                        {syllabusModules.map((module) => (
                          <SelectItem key={module.id} value={module.id}>
                            {language === 'en' ? 'Module ' : 'Modul '} 
                            {module.order_num + 1}: {module.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zoom_link">{language === 'en' ? 'Zoom Link' : 'Zoom-Link'}</Label>
                      <Input
                        id="zoom_link"
                        name="zoom_link"
                        type="url"
                        value={formData.zoom_link}
                        onChange={handleInputChange}
                        placeholder="https://zoom.us/j/..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="chatgroup_link">{language === 'en' ? 'Chat Group Link' : 'Chat-Gruppen-Link'}</Label>
                      <Input
                        id="chatgroup_link"
                        name="chatgroup_link"
                        type="url"
                        value={formData.chatgroup_link}
                        onChange={handleInputChange}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max_participants">{language === 'en' ? 'Max Participants' : 'Max. Teilnehmer'}</Label>
                    <Input
                      id="max_participants"
                      name="max_participants"
                      type="number"
                      min="1"
                      value={formData.max_participants}
                      onChange={handleInputChange}
                      placeholder={language === 'en' ? 'Leave empty for unlimited' : 'Leer lassen für unbegrenzt'}
                    />
                  </div>
                  
                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        {language === 'en' ? 'Cancel' : 'Abbrechen'}
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {selectedSession 
                        ? (language === 'en' ? 'Update Session' : 'Sitzung aktualisieren')
                        : (language === 'en' ? 'Create Session' : 'Sitzung erstellen')}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 border rounded-md bg-muted/20">
              <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">
                {language === 'en' ? 'No sessions scheduled' : 'Keine Sitzungen geplant'}
              </h3>
              <p className="text-muted-foreground mt-1 mb-4">
                {language === 'en' 
                  ? 'Start by adding new sessions for this group'
                  : 'Fügen Sie neue Sitzungen für diese Gruppe hinzu'}
              </p>
              <Button
                onClick={() => { resetForm(); setIsSessionDialogOpen(true); }}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-1" />
                {language === 'en' ? 'Add First Session' : 'Erste Sitzung hinzufügen'}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'en' ? 'Date & Time' : 'Datum & Uhrzeit'}</TableHead>
                    <TableHead>{language === 'en' ? 'Session' : 'Sitzung'}</TableHead>
                    <TableHead>{language === 'en' ? 'Module' : 'Modul'}</TableHead>
                    <TableHead className="text-center">{language === 'en' ? 'Bookings' : 'Buchungen'}</TableHead>
                    <TableHead className="text-right">{language === 'en' ? 'Actions' : 'Aktionen'}</TableHead>
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
                        <div className="text-sm text-muted-foreground">
                          {session.description}
                        </div>
                        <div className="flex gap-2 mt-1">
                          {session.zoom_link && (
                            <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                              Zoom
                            </span>
                          )}
                          {session.chatgroup_link && (
                            <span className="text-xs bg-green-100 text-green-800 rounded-full px-2 py-0.5">
                              Chat
                            </span>
                          )}
                        </div>
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
                      <TableCell className="text-center">
                        <span className="font-medium">
                          {session.bookings_count}
                          {session.max_participants && ` / ${session.max_participants}`}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditSession(session)}
                          >
                            {language === 'en' ? 'Edit' : 'Bearbeiten'}
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                {language === 'en' ? 'Delete' : 'Löschen'}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {language === 'en' ? 'Are you sure?' : 'Sind Sie sicher?'}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {language === 'en' 
                                    ? 'This will permanently delete this session and all associated bookings.'
                                    : 'Diese Aktion löscht die Sitzung und alle zugehörigen Buchungen dauerhaft.'}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  {language === 'en' ? 'Cancel' : 'Abbrechen'}
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => handleDeleteSession(session.id)}
                                >
                                  {language === 'en' ? 'Delete' : 'Löschen'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>
            {language === 'en' ? 'Close' : 'Schließen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionsManager;
