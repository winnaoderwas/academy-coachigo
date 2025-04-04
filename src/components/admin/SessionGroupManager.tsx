
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { SessionGroup } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, Loader2, PlusCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SessionsManager from '@/components/admin/SessionsManager';
import { useSessionGroups } from '@/hooks/useSessionGroups';
import { supabase } from '@/integrations/supabase/client';

interface SessionGroupManagerProps {
  isOpen: boolean;
  onClose: (refreshNeeded?: boolean) => void;
  sessionGroup: SessionGroup | null;
  courses: { id: string; title: string | any }[];
}

interface ModuleSession {
  moduleId: string;
  moduleTitle: string;
  moduleNumber: number;
  sessionDate: Date | null;
  sessionTime: string;
}

const SessionGroupManager = ({ isOpen, onClose, sessionGroup, courses }: SessionGroupManagerProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { createSessionGroup, updateSessionGroup } = useSessionGroups();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSessionManager, setShowSessionManager] = useState(false);
  const [modules, setModules] = useState<{ id: string; title: string; order_num: number }[]>([]);
  const [moduleSessions, setModuleSessions] = useState<ModuleSession[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    courseId: '',
    price: '0',
    maxParticipants: '',
    startDate: new Date(),
    endDate: null as Date | null,
    isActive: true
  });

  useEffect(() => {
    if (sessionGroup) {
      setFormData({
        name: sessionGroup.name,
        description: sessionGroup.description || '',
        courseId: sessionGroup.courseId,
        price: sessionGroup.price.toString(),
        maxParticipants: sessionGroup.maxParticipants ? sessionGroup.maxParticipants.toString() : '',
        startDate: new Date(sessionGroup.startDate),
        endDate: sessionGroup.endDate ? new Date(sessionGroup.endDate) : null,
        isActive: sessionGroup.isActive
      });
      
      // If editing a session group, fetch the course modules
      fetchCourseModules(sessionGroup.courseId);
      
      // If editing, also fetch the existing sessions
      if (sessionGroup.id) {
        fetchSessionSchedule(sessionGroup.id);
      }
    } else {
      // Reset form for new session group
      setFormData({
        name: '',
        description: '',
        courseId: courses.length > 0 ? courses[0].id : '',
        price: '0',
        maxParticipants: '',
        startDate: new Date(),
        endDate: null,
        isActive: true
      });
      
      // If courses available, fetch modules for the first course
      if (courses.length > 0) {
        fetchCourseModules(courses[0].id);
      } else {
        setModules([]);
        setModuleSessions([]);
      }
    }
  }, [sessionGroup, courses]);

  const fetchCourseModules = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_syllabus')
        .select('id, title, order_num')
        .eq('course_id', courseId)
        .order('order_num', { ascending: true });
        
      if (error) throw error;
      
      setModules(data || []);
      
      // Initialize module sessions with the fetched modules
      const newModuleSessions: ModuleSession[] = (data || []).map(module => ({
        moduleId: module.id,
        moduleTitle: module.title,
        moduleNumber: module.order_num,
        sessionDate: null,
        sessionTime: '10:00'
      }));
      
      setModuleSessions(newModuleSessions);
    } catch (error: any) {
      console.error('Error fetching course modules:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const fetchSessionSchedule = async (sessionGroupId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_timetable')
        .select(`
          id,
          course_syllabus_id,
          session_date,
          title
        `)
        .eq('session_group_id', sessionGroupId);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Map existing sessions to modules
        const existingSessions = data.reduce((acc: Record<string, any>, session) => {
          if (session.course_syllabus_id) {
            acc[session.course_syllabus_id] = {
              date: new Date(session.session_date),
              time: format(new Date(session.session_date), 'HH:mm')
            };
          }
          return acc;
        }, {});
        
        // Update module sessions with existing data
        setModuleSessions(prev => 
          prev.map(moduleSession => {
            const existingSession = existingSessions[moduleSession.moduleId];
            if (existingSession) {
              return {
                ...moduleSession,
                sessionDate: existingSession.date,
                sessionTime: existingSession.time
              };
            }
            return moduleSession;
          })
        );
      }
    } catch (error: any) {
      console.error('Error fetching session schedule:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'courseId' && value !== formData.courseId) {
      // When course changes, fetch the new course's modules
      fetchCourseModules(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined, field: 'startDate' | 'endDate') => {
    if (date || field === 'endDate') {
      setFormData(prev => ({ ...prev, [field]: date || null }));
    }
  };

  const handleModuleSessionDateChange = (date: Date | undefined, moduleId: string) => {
    if (!date) return;
    
    setModuleSessions(prev => 
      prev.map(session => 
        session.moduleId === moduleId 
          ? { ...session, sessionDate: date } 
          : session
      )
    );
  };

  const handleModuleSessionTimeChange = (e: React.ChangeEvent<HTMLInputElement>, moduleId: string) => {
    const { value } = e.target;
    
    setModuleSessions(prev => 
      prev.map(session => 
        session.moduleId === moduleId 
          ? { ...session, sessionTime: value } 
          : session
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const sessionGroupData = {
        courseId: formData.courseId,
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate ? formData.endDate.toISOString() : null,
        isActive: formData.isActive
      };

      let result = null;
      let sessionGroupId = sessionGroup?.id;
      
      if (sessionGroup) {
        // Update existing session group
        result = await updateSessionGroup(sessionGroup.id, sessionGroupData);
          
        if (result) {
          toast({
            title: language === 'en' ? 'Session Group Updated' : 'Sitzungsgruppe aktualisiert',
            description: language === 'en' 
              ? 'The session group has been updated successfully' 
              : 'Die Sitzungsgruppe wurde erfolgreich aktualisiert',
          });
        }
      } else {
        // Create new session group
        result = await createSessionGroup(sessionGroupData);
          
        if (result) {
          sessionGroupId = result.id;
          
          toast({
            title: language === 'en' ? 'Session Group Created' : 'Sitzungsgruppe erstellt',
            description: language === 'en' 
              ? 'A new session group has been created' 
              : 'Eine neue Sitzungsgruppe wurde erstellt',
          });
        }
      }
      
      if (!result) {
        throw new Error(language === 'en' ? 'Failed to save session group' : 'Fehler beim Speichern der Sitzungsgruppe');
      }
      
      // Process module sessions if we have a sessionGroupId
      if (sessionGroupId) {
        // First, create or update the timetable entries for each module session
        const timetablePromises = moduleSessions.map(async (moduleSession) => {
          if (!moduleSession.sessionDate) return null;
          
          // Combine date and time
          const sessionDateTime = new Date(moduleSession.sessionDate);
          const [hours, minutes] = moduleSession.sessionTime.split(':').map(Number);
          sessionDateTime.setHours(hours, minutes, 0, 0);
          
          // Find if there's an existing timetable entry for this module and session group
          const { data: existingData, error: existingError } = await supabase
            .from('course_timetable')
            .select('id')
            .eq('session_group_id', sessionGroupId)
            .eq('course_syllabus_id', moduleSession.moduleId)
            .maybeSingle();
            
          if (existingError) throw existingError;
          
          if (existingData) {
            // Update existing entry
            const { error: updateError } = await supabase
              .from('course_timetable')
              .update({
                session_date: sessionDateTime.toISOString(),
                title: `${language === 'en' ? 'Session' : 'Sitzung'} ${moduleSession.moduleNumber + 1}: ${moduleSession.moduleTitle}`
              })
              .eq('id', existingData.id);
              
            if (updateError) throw updateError;
            
            return existingData.id;
          } else {
            // Create new entry
            const { data: newData, error: insertError } = await supabase
              .from('course_timetable')
              .insert({
                session_group_id: sessionGroupId,
                course_id: formData.courseId,
                course_syllabus_id: moduleSession.moduleId,
                session_date: sessionDateTime.toISOString(),
                title: `${language === 'en' ? 'Session' : 'Sitzung'} ${moduleSession.moduleNumber + 1}: ${moduleSession.moduleTitle}`
              })
              .select('id')
              .single();
              
            if (insertError) throw insertError;
            
            return newData?.id;
          }
        });
        
        await Promise.all(timetablePromises);
      }
      
      // After successfully saving everything, show the session manager if we're editing
      if (sessionGroupId && (sessionGroup || moduleSessions.some(s => s.sessionDate))) {
        // Create a minimal SessionGroup object with just the ID for the sessions manager
        const minimalSessionGroup: SessionGroup = {
          id: sessionGroupId,
          courseId: formData.courseId,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
          startDate: formData.startDate.toISOString(),
          endDate: formData.endDate ? formData.endDate.toISOString() : null,
          isActive: formData.isActive,
          createdAt: '',
          updatedAt: ''
        };
        
        sessionGroup = minimalSessionGroup;
        setShowSessionManager(true);
        return;
      }
      
      // Close the modal if everything was successful and no session manager is shown
      onClose(true);
    } catch (error: any) {
      console.error('Error saving session group:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSessionManagerClose = () => {
    setShowSessionManager(false);
    onClose(true);
  };

  if (showSessionManager && sessionGroup) {
    return (
      <SessionsManager
        isOpen={showSessionManager}
        onClose={handleSessionManagerClose}
        sessionGroup={sessionGroup}
      />
    );
  }

  const getCourseTitle = (course: { id: string; title: any }) => {
    if (!course || !course.title) return 'Unknown';
    
    if (typeof course.title === 'object') {
      return course.title[language as keyof typeof course.title] || course.title.en || 'Unknown';
    }
    
    return course.title;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {sessionGroup 
              ? (language === 'en' ? 'Edit Session Group' : 'Sitzungsgruppe bearbeiten')
              : (language === 'en' ? 'Add New Session Group' : 'Neue Sitzungsgruppe hinzufügen')}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? 'Manage course session groups to allow students to book multiple dates'
              : 'Verwalten Sie Kurssitzungsgruppen, damit Studenten mehrere Termine buchen können'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{language === 'en' ? 'Name' : 'Name'} *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder={language === 'en' ? 'e.g. April Session Group' : 'z.B. April-Sitzungsgruppe'}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">{language === 'en' ? 'Description' : 'Beschreibung'}</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={2}
              placeholder={language === 'en' ? 'Brief description of this session group' : 'Kurze Beschreibung dieser Sitzungsgruppe'}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="courseId">{language === 'en' ? 'Course' : 'Kurs'} *</Label>
            <Select 
              value={formData.courseId} 
              onValueChange={(value) => handleSelectChange('courseId', value)}
              disabled={!!sessionGroup}
            >
              <SelectTrigger>
                <SelectValue placeholder={language === 'en' ? 'Select course' : 'Kurs auswählen'} />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {getCourseTitle(course)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">{language === 'en' ? 'Price (€)' : 'Preis (€)'} *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">{language === 'en' ? 'Max Participants' : 'Max. Teilnehmer'}</Label>
              <Input
                id="maxParticipants"
                name="maxParticipants"
                type="number"
                min="1"
                value={formData.maxParticipants}
                onChange={handleInputChange}
                placeholder={language === 'en' ? 'Leave empty for unlimited' : 'Leer lassen für unbegrenzt'}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{language === 'en' ? 'Start Date' : 'Startdatum'} *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, 'PPP') : (
                      <span className="text-muted-foreground">
                        {language === 'en' ? 'Pick a date' : 'Datum auswählen'}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => handleDateChange(date, 'startDate')}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>{language === 'en' ? 'End Date' : 'Enddatum'}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, 'PPP') : (
                      <span className="text-muted-foreground">
                        {language === 'en' ? 'Pick a date' : 'Datum auswählen'}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate || undefined}
                    onSelect={(date) => handleDateChange(date, 'endDate')}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="isActive" 
              checked={formData.isActive}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="isActive">
              {language === 'en' ? 'Active' : 'Aktiv'}
            </Label>
            <p className="text-sm text-muted-foreground ml-2">
              {language === 'en' 
                ? 'Only active session groups can be booked' 
                : 'Nur aktive Sitzungsgruppen können gebucht werden'}
            </p>
          </div>
          
          {modules.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'en' ? 'Schedule Sessions' : 'Sitzungen planen'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {moduleSessions.map((moduleSession, index) => (
                  <div key={moduleSession.moduleId} className="p-4 border rounded-md space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">
                        {language === 'en' ? 'Module ' : 'Modul '} 
                        {moduleSession.moduleNumber + 1}: {moduleSession.moduleTitle}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{language === 'en' ? 'Session Date' : 'Sitzungsdatum'}</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                              type="button"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {moduleSession.sessionDate ? format(moduleSession.sessionDate, 'PPP') : (
                                <span className="text-muted-foreground">
                                  {language === 'en' ? 'Pick a date' : 'Datum auswählen'}
                                </span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={moduleSession.sessionDate || undefined}
                              onSelect={(date) => handleModuleSessionDateChange(date, moduleSession.moduleId)}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label>{language === 'en' ? 'Session Time' : 'Sitzungszeit'}</Label>
                        <Input
                          type="time"
                          value={moduleSession.sessionTime}
                          onChange={(e) => handleModuleSessionTimeChange(e, moduleSession.moduleId)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onClose()}>
              {language === 'en' ? 'Cancel' : 'Abbrechen'}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {sessionGroup 
                ? (language === 'en' ? 'Update Group' : 'Gruppe aktualisieren')
                : (language === 'en' ? 'Create Group' : 'Gruppe erstellen')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SessionGroupManager;
