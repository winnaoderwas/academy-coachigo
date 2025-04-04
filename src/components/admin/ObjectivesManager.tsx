
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Objective {
  id?: string;
  objective: string;
  order_num: number;
  isNew?: boolean;
}

interface ObjectivesManagerProps {
  courseId: string;
}

const ObjectivesManager = ({ courseId }: ObjectivesManagerProps) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<Objective[]>([]);

  useEffect(() => {
    if (courseId) {
      fetchObjectives();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [courseId]);

  const fetchObjectives = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('course_objectives')
        .select('*')
        .eq('course_id', courseId)
        .order('order_num', { ascending: true });

      if (error) {
        throw error;
      }

      setItems(data || []);
    } catch (error) {
      console.error('Error fetching objectives:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    const newItem: Objective = {
      objective: '',
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

  const handleInputChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index].objective = value;
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

  const saveObjectives = async () => {
    try {
      setSaving(true);

      // 1. Get existing items to find which ones to delete
      const { data: existingData, error: fetchError } = await supabase
        .from('course_objectives')
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
          .from('course_objectives')
          .delete()
          .in('id', idsToDelete);

        if (deleteError) throw deleteError;
      }

      // 4. Update existing items and insert new ones
      for (const item of items) {
        if (item.id) {
          // Update existing item
          const { error: updateError } = await supabase
            .from('course_objectives')
            .update({
              objective: item.objective,
              order_num: item.order_num
            })
            .eq('id', item.id);

          if (updateError) throw updateError;
        } else {
          // Insert new item
          const { error: insertError } = await supabase
            .from('course_objectives')
            .insert({
              course_id: courseId,
              objective: item.objective,
              order_num: item.order_num
            });

          if (insertError) throw insertError;
        }
      }

      // Refresh data
      await fetchObjectives();
    } catch (error) {
      console.error('Error saving objectives:', error);
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
          <CheckCircle className="h-5 w-5 mr-2" />
          {language === 'en' ? 'Learning Objectives' : 'Lernziele'}
        </h3>
        <Button onClick={handleAddItem} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          {language === 'en' ? 'Add Objective' : 'Lernziel hinzufügen'}
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <CheckCircle className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-center text-gray-500">
              {language === 'en' 
                ? 'No learning objectives yet. Add your first objective.' 
                : 'Noch keine Lernziele. Fügen Sie Ihr erstes Lernziel hinzu.'}
            </p>
            <Button onClick={handleAddItem} variant="outline" className="mt-4">
              <Plus className="h-4 w-4 mr-1" />
              {language === 'en' ? 'Add Objective' : 'Lernziel hinzufügen'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <Card key={index} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-grow">
                    <Label htmlFor={`objective-${index}`} className="sr-only">
                      {language === 'en' ? `Objective ${index + 1}` : `Lernziel ${index + 1}`}
                    </Label>
                    <Input
                      id={`objective-${index}`}
                      value={item.objective}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      placeholder={language === 'en' ? 'Enter learning objective' : 'Lernziel eingeben'}
                      className="w-full"
                    />
                  </div>
                  <div className="flex ml-2 space-x-1">
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
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-end">
            <Button onClick={saveObjectives} disabled={saving}>
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : null}
              {language === 'en' ? 'Save Objectives' : 'Lernziele speichern'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectivesManager;
