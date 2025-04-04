
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, Calendar, Users, RefreshCw, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import SessionGroupManager from '@/components/admin/SessionGroupManager';
import { useSessionGroups } from '@/hooks/useSessionGroups';

const AdminSessions = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { sessionGroups, loading, refreshing, fetchSessionGroups, deleteSessionGroup, setRefreshing } = useSessionGroups();
  const [courses, setCourses] = useState<{ id: string, title: any }[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editSessionGroup, setEditSessionGroup] = useState<any>(null);

  useEffect(() => {
    fetchCourses();
    fetchSessionGroups();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchSessionGroups(selectedCourseId);
    } else {
      fetchSessionGroups();
    }
  }, [selectedCourseId]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .order('title', { ascending: true });
      
      if (error) throw error;
      
      setCourses(data || []);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSessionGroups(selectedCourseId || undefined);
  };

  const handleCourseFilter = (courseId: string) => {
    setSelectedCourseId(courseId === 'all' ? null : courseId);
  };

  const handleEditSessionGroup = (sessionGroup: any) => {
    setEditSessionGroup(sessionGroup);
    setIsCreateModalOpen(true);
  };

  const handleDeleteSessionGroup = async (id: string) => {
    if (!confirm(language === 'en' 
      ? 'Are you sure you want to delete this session group? This will also delete all related sessions and bookings.' 
      : 'Sind Sie sicher, dass Sie diese Sitzungsgruppe löschen möchten? Dies löscht auch alle zugehörigen Sitzungen und Buchungen.')) {
      return;
    }
    
    const success = await deleteSessionGroup(id);
    
    if (success) {
      toast({
        title: language === 'en' ? 'Success' : 'Erfolg',
        description: language === 'en' 
          ? 'Session group deleted successfully' 
          : 'Sitzungsgruppe erfolgreich gelöscht',
      });
      
      // Refresh the list
      fetchSessionGroups(selectedCourseId || undefined);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
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

  const handleModalClose = (refreshNeeded: boolean = false) => {
    setIsCreateModalOpen(false);
    setEditSessionGroup(null);
    
    if (refreshNeeded) {
      fetchSessionGroups(selectedCourseId || undefined);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {language === 'en' ? 'Session Groups' : 'Sitzungsgruppen'}
          </h1>
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-16" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'Session Groups' : 'Sitzungsgruppen'}
        </h1>
        <div className="space-x-2">
          <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {language === 'en' ? 'Refresh' : 'Aktualisieren'}
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            {language === 'en' ? 'Add Group' : 'Gruppe hinzufügen'}
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{language === 'en' ? 'Filter Session Groups' : 'Sitzungsgruppen filtern'}</CardTitle>
          <CardDescription>
            {language === 'en' ? 'Select a course to view its session groups' : 'Wählen Sie einen Kurs, um dessen Sitzungsgruppen anzuzeigen'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={selectedCourseId === null ? "default" : "outline"}
              onClick={() => handleCourseFilter('all')}
              className="mb-2"
            >
              {language === 'en' ? 'All Courses' : 'Alle Kurse'}
            </Button>
            
            {courses.map((course) => (
              <Button 
                key={course.id}
                variant={selectedCourseId === course.id ? "default" : "outline"}
                onClick={() => handleCourseFilter(course.id)}
                className="mb-2"
              >
                {typeof course.title === 'object' 
                  ? (course.title[language as keyof typeof course.title] || course.title.en) 
                  : course.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <SessionGroupManager 
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        sessionGroup={editSessionGroup}
        courses={courses}
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'en' ? 'Name' : 'Name'}</TableHead>
                <TableHead>{language === 'en' ? 'Course' : 'Kurs'}</TableHead>
                <TableHead>{language === 'en' ? 'Dates' : 'Termine'}</TableHead>
                <TableHead>{language === 'en' ? 'Price' : 'Preis'}</TableHead>
                <TableHead>{language === 'en' ? 'Status' : 'Status'}</TableHead>
                <TableHead>{language === 'en' ? 'Bookings' : 'Buchungen'}</TableHead>
                <TableHead className="text-right">{language === 'en' ? 'Actions' : 'Aktionen'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessionGroups.length > 0 ? (
                sessionGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">
                      <div>{group.name}</div>
                      {group.description && (
                        <div className="text-sm text-muted-foreground">{group.description}</div>
                      )}
                    </TableCell>
                    <TableCell>{group.courseName}</TableCell>
                    <TableCell>
                      <div>
                        <Calendar className="h-4 w-4 inline mr-1 text-primary" />
                        {formatDate(group.startDate)}
                      </div>
                      {group.endDate && (
                        <div className="text-sm text-muted-foreground">
                          {language === 'en' ? 'To ' : 'Bis '} 
                          {formatDate(group.endDate)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatPrice(group.price)}</TableCell>
                    <TableCell>
                      <Badge variant={group.isActive ? "success" : "secondary"}>
                        {group.isActive 
                          ? (language === 'en' ? 'Active' : 'Aktiv') 
                          : (language === 'en' ? 'Inactive' : 'Inaktiv')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-slate-500" />
                        <span>
                          {group.bookingsCount}
                          {group.maxParticipants && ` / ${group.maxParticipants}`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditSessionGroup(group)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleDeleteSessionGroup(group.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {selectedCourseId 
                      ? (language === 'en' ? 'No session groups found for this course' : 'Keine Sitzungsgruppen für diesen Kurs gefunden') 
                      : (language === 'en' ? 'No session groups found' : 'Keine Sitzungsgruppen gefunden')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSessions;
