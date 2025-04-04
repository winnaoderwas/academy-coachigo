
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SyllabusItem {
  id?: string;
  title: string;
  description: string;
  order_num: number;
  isNew?: boolean;
}

interface SyllabusManagerProps {
  courseId: string;
}

const SyllabusManager = ({ courseId }: SyllabusManagerProps) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<SyllabusItem[]>([]);

  useEffect(() => {
    if (courseId) {
      fetchSyllabus();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [courseId]);

  const fetchSyllabus = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('course_syllabus')
        .select('*')
        .eq('course_id', courseId)
        .order('order_num', { ascending: true });

      if (error) {
        throw error;
      }

      setItems(data || []);
    } catch (error) {
      console.error('Error fetching syllabus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    const newItem: SyllabusItem = {
      title: '',
      description: '',
      order_num: items.length,
      isNew: true
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    // Update order numbers
    newItems.forEach((item, i) => {
      item.order_num = i;
    });
    setItems(newItems);
  };

  const handleInputChange = (index: number, field: 'title' | 'description', value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    // Update order numbers
    newItems.forEach((item, i) => {
      item.order_num = i;
    });
    setItems(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    // Update order numbers
    newItems.forEach((item, i) => {
      item.order_num = i;
    });
    setItems(newItems);
  };

  const saveSyllabus = async () => {
    try {
      setSaving(true);

      // 1. Get existing items to find which ones to delete
      const { data: existingData, error: fetchError } = await supabase
        .from('course_syllabus')
        .select('id')
        .eq('course_id', courseId);

      if (fetchError) throw fetchError;

      // 2. Find IDs to delete (existing IDs not in current items)
      const currentIds = items.filter(item => item.id).map(item => item.id);
      const idsToDelete = existingData
        .filter(item => !currentIds.includes(item.id))
        .map(item => item.id);

      // 3. Delete removed items
      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('course_syllabus')
          .delete()
          .in('id', idsToDelete);

        if (deleteError) throw deleteError;
      }

      // 4. Update existing items and insert new ones
      for (const item of items) {
        if (item.id) {
          // Update existing item
          const { error: updateError } = await supabase
            .from('course_syllabus')
            .update({
              title: item.title,
              description: item.description,
              order_num: item.order_num
            })
            .eq('id', item.id);

          if (updateError) throw updateError;
        } else {
          // Insert new item
          const { error: insertError } = await supabase
            .from('course_syllabus')
            .insert({
              course_id: courseId,
              title: item.title,
              description: item.description,
              order_num: item.order_num
            });

          if (insertError) throw insertError;
        }
      }

      // Refresh data
      await fetchSyllabus();
    } catch (error) {
      console.error('Error saving syllabus:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          {language === 'en' ? 'Course Syllabus' : 'Kursplan'}
        </h3>
        <Button onClick={handleAddItem} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          {language === 'en' ? 'Add Module' : 'Modul hinzufügen'}
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <BookOpen className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-center text-gray-500">
              {language === 'en' 
                ? 'No syllabus items yet. Add your first module.' 
                : 'Noch keine Kursmodule. Fügen Sie Ihr erstes Modul hinzu.'}
            </p>
            <Button onClick={handleAddItem} variant="outline" className="mt-4">
              <Plus className="h-4 w-4 mr-1" />
              {language === 'en' ? 'Add Module' : 'Modul hinzufügen'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <Card key={index} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-gray-500">
                    {language === 'en' ? `Module ${index + 1}` : `Modul ${index + 1}`}
                  </p>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleMoveDown(index)}
                      disabled={index === items.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteItem(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`title-${index}`}>
                      {language === 'en' ? 'Title' : 'Titel'}
                    </Label>
                    <Input
                      id={`title-${index}`}
                      value={item.title}
                      onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                      placeholder={language === 'en' ? 'Module title' : 'Modultitel'}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`description-${index}`}>
                      {language === 'en' ? 'Description' : 'Beschreibung'}
                    </Label>
                    <Textarea
                      id={`description-${index}`}
                      value={item.description}
                      onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                      placeholder={language === 'en' ? 'Module description' : 'Modulbeschreibung'}
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-end">
            <Button onClick={saveSyllabus} disabled={saving}>
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : null}
              {language === 'en' ? 'Save Syllabus' : 'Kursplan speichern'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyllabusManager;
