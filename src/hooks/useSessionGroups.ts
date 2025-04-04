
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { SessionGroup } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

// Type for raw data from Supabase
interface RawSessionGroup {
  id: string;
  course_id: string;
  name: string;
  description: string | null;
  price: number;
  max_participants: number | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  courses?: { title: any } | null;
  session_bookings?: any[];
}

export const useSessionGroups = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sessionGroups, setSessionGroups] = useState<SessionGroup[]>([]);

  // Helper function to transform raw data to our SessionGroup type
  const transformSessionGroup = (group: RawSessionGroup): SessionGroup => {
    return {
      id: group.id,
      course_id: group.course_id,
      courseId: group.course_id, // Add camelCase alias
      name: group.name,
      description: group.description || undefined,
      price: group.price,
      max_participants: group.max_participants || undefined,
      maxParticipants: group.max_participants || undefined, // Add camelCase alias
      start_date: group.start_date,
      startDate: group.start_date, // Add camelCase alias
      end_date: group.end_date || undefined,
      endDate: group.end_date || undefined, // Add camelCase alias
      is_active: group.is_active,
      isActive: group.is_active, // Add camelCase alias
      createdAt: group.created_at,
      updatedAt: group.updated_at,
      courseName: group.courses?.title ? 
        (typeof group.courses.title === 'object' 
          ? (group.courses.title[language as keyof typeof group.courses.title] || group.courses.title.en) 
          : group.courses.title) 
        : 'Unknown',
      bookingsCount: group.session_bookings?.length || 0
    };
  };

  const fetchSessionGroups = async (courseId?: string) => {
    try {
      setLoading(true);
      
      const query = supabase
        .from('session_groups')
        .select(`
          *,
          courses (
            title
          ),
          session_bookings (
            id
          )
        `);
      
      // Add courseId filter if provided
      if (courseId) {
        query.eq('course_id', courseId);
      }
      
      // Add ordering
      query.order('created_at', { ascending: false });
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform the data to match our SessionGroup type
      const transformedData: SessionGroup[] = (data || []).map((item: RawSessionGroup) => 
        transformSessionGroup(item)
      );
      
      setSessionGroups(transformedData);
      return transformedData;
    } catch (error: any) {
      console.error('Error fetching session groups:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const createSessionGroup = async (sessionGroupData: Omit<SessionGroup, 'id' | 'createdAt' | 'updatedAt' | 'courseName' | 'bookingsCount'>) => {
    try {
      // Convert from our SessionGroup type to the database format
      const dbData = {
        course_id: sessionGroupData.course_id || sessionGroupData.courseId,
        name: sessionGroupData.name,
        description: sessionGroupData.description,
        price: sessionGroupData.price,
        max_participants: sessionGroupData.max_participants || sessionGroupData.maxParticipants,
        start_date: sessionGroupData.start_date || sessionGroupData.startDate,
        end_date: sessionGroupData.end_date || sessionGroupData.endDate,
        is_active: sessionGroupData.is_active || sessionGroupData.isActive
      };

      const { data, error } = await supabase
        .from('session_groups')
        .insert(dbData)
        .select(`*, courses(title), session_bookings(id)`)
        .single();

      if (error) throw error;
      
      // Transform the response to our SessionGroup type
      const transformedData = data ? transformSessionGroup(data as RawSessionGroup) : null;
      
      return transformedData;
    } catch (error: any) {
      console.error('Error creating session group:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateSessionGroup = async (id: string, sessionGroupData: Partial<Omit<SessionGroup, 'id' | 'createdAt' | 'updatedAt' | 'courseName' | 'bookingsCount'>>) => {
    try {
      // Convert from our SessionGroup type to the database format
      const dbData: any = {};
      if ('course_id' in sessionGroupData) dbData.course_id = sessionGroupData.course_id;
      if ('courseId' in sessionGroupData) dbData.course_id = sessionGroupData.courseId;
      if ('name' in sessionGroupData) dbData.name = sessionGroupData.name;
      if ('description' in sessionGroupData) dbData.description = sessionGroupData.description;
      if ('price' in sessionGroupData) dbData.price = sessionGroupData.price;
      if ('max_participants' in sessionGroupData) dbData.max_participants = sessionGroupData.max_participants;
      if ('maxParticipants' in sessionGroupData) dbData.max_participants = sessionGroupData.maxParticipants;
      if ('start_date' in sessionGroupData) dbData.start_date = sessionGroupData.start_date;
      if ('startDate' in sessionGroupData) dbData.start_date = sessionGroupData.startDate;
      if ('end_date' in sessionGroupData) dbData.end_date = sessionGroupData.end_date;
      if ('endDate' in sessionGroupData) dbData.end_date = sessionGroupData.endDate;
      if ('is_active' in sessionGroupData) dbData.is_active = sessionGroupData.is_active;
      if ('isActive' in sessionGroupData) dbData.is_active = sessionGroupData.isActive;

      const { data, error } = await supabase
        .from('session_groups')
        .update(dbData)
        .eq('id', id)
        .select(`*, courses(title), session_bookings(id)`)
        .single();

      if (error) throw error;
      
      // Transform the response to our SessionGroup type
      const transformedData = data ? transformSessionGroup(data as RawSessionGroup) : null;
      
      return transformedData;
    } catch (error: any) {
      console.error('Error updating session group:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteSessionGroup = async (id: string) => {
    try {
      const { error } = await supabase
        .from('session_groups')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      console.error('Error deleting session group:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const fetchSessionGroupSessions = async (sessionGroupId: string) => {
    try {
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
          course_syllabus (
            id,
            title,
            order_num
          )
        `)
        .eq('session_group_id', sessionGroupId)
        .order('session_date', { ascending: true });
        
      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      console.error('Error fetching session group sessions:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
      return [];
    }
  };

  return {
    sessionGroups,
    loading,
    refreshing,
    fetchSessionGroups,
    createSessionGroup,
    updateSessionGroup,
    deleteSessionGroup,
    fetchSessionGroupSessions,
    setRefreshing
  };
};
