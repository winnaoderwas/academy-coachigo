import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, FileText, Video, Link2, Edit, Trash2, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SyllabusDetailsManagerProps {
  courseId: string;
  syllabusId: string;
  syllabusTitle: string;
}

interface VideoItem {
  url: string;
  label: string;
}

interface SyllabusDetailItem {
  id: number | null;  // Changed from string to number to match the database schema
  title: string | null;
  description: string | null;
  video_url: string | null;
  meeting_url: string | null;
  downloads: string[] | null;
  Infos: string[] | null;
  course_syllabus_id: string | null;
  course_id: string | null;
  videos?: VideoItem[];
}

const SyllabusDetailsManager = ({ courseId, syllabusId, syllabusTitle }: SyllabusDetailsManagerProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [details, setDetails] = useState<SyllabusDetailItem[]>([]);
  const [newDetail, setNewDetail] = useState<SyllabusDetailItem>({
    id: null,
    title: '',
    description: '',
    video_url: '',
    meeting_url: '',
    downloads: [],
    Infos: [],
    course_syllabus_id: syllabusId,
    course_id: courseId,
    videos: []
  });
  const [editMode, setEditMode] = useState<number | null>(null);
  const [tempDownload, setTempDownload] = useState('');
  const [tempInfo, setTempInfo] = useState('');
  const [tempVideoUrl, setTempVideoUrl] = useState('');
  const [tempVideoLabel, setTempVideoLabel] = useState('');

  useEffect(() => {
    if (courseId && syllabusId) {
      fetchDetails();
    }
  }, [courseId, syllabusId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('course_syllabus_details')
        .select('*')
        .eq('course_syllabus_id', syllabusId);

      if (error) throw error;
      
      const processedData = data?.map(item => {
        const processedItem: SyllabusDetailItem = {
          ...item,
          videos: []
        };
        
        if (item.video_url) {
          try {
            const videoData = JSON.parse(item.video_url);
            if (Array.isArray(videoData)) {
              processedItem.videos = videoData;
            } else {
              processedItem.videos = [{ url: item.video_url, label: '' }];
            }
          } catch (e) {
            if (item.video_url) {
              processedItem.videos = [{ url: item.video_url, label: '' }];
            }
          }
        }
        
        return processedItem;
      });
      
      setDetails(processedData || []);
    } catch (error: any) {
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDownload = () => {
    if (!tempDownload.trim()) return;
    
    if (editMode !== null) {
      const updatedDetails = [...details];
      const detail = updatedDetails.find(d => d.id === editMode);
      if (detail) {
        detail.downloads = [...(detail.downloads || []), tempDownload];
      }
      setDetails(updatedDetails);
    } else {
      setNewDetail({
        ...newDetail,
        downloads: [...(newDetail.downloads || []), tempDownload]
      });
    }
    setTempDownload('');
  };

  const handleRemoveDownload = (index: number) => {
    if (editMode !== null) {
      const updatedDetails = [...details];
      const detail = updatedDetails.find(d => d.id === editMode);
      if (detail && detail.downloads) {
        detail.downloads = detail.downloads.filter((_, i) => i !== index);
      }
      setDetails(updatedDetails);
    } else {
      setNewDetail({
        ...newDetail,
        downloads: newDetail.downloads?.filter((_, i) => i !== index) || []
      });
    }
  };

  const handleAddInfo = () => {
    if (!tempInfo.trim()) return;
    
    if (editMode !== null) {
      const updatedDetails = [...details];
      const detail = updatedDetails.find(d => d.id === editMode);
      if (detail) {
        detail.Infos = [...(detail.Infos || []), tempInfo];
      }
      setDetails(updatedDetails);
    } else {
      setNewDetail({
        ...newDetail,
        Infos: [...(newDetail.Infos || []), tempInfo]
      });
    }
    setTempInfo('');
  };

  const handleRemoveInfo = (index: number) => {
    if (editMode !== null) {
      const updatedDetails = [...details];
      const detail = updatedDetails.find(d => d.id === editMode);
      if (detail && detail.Infos) {
        detail.Infos = detail.Infos.filter((_, i) => i !== index);
      }
      setDetails(updatedDetails);
    } else {
      setNewDetail({
        ...newDetail,
        Infos: newDetail.Infos?.filter((_, i) => i !== index) || []
      });
    }
  };

  const handleAddVideo = () => {
    if (!tempVideoUrl.trim()) return;
    
    const newVideo: VideoItem = {
      url: tempVideoUrl,
      label: tempVideoLabel.trim() || (language === 'en' ? 'Video' : 'Video')
    };
    
    if (editMode !== null) {
      const updatedDetails = [...details];
      const detail = updatedDetails.find(d => d.id === editMode);
      if (detail) {
        detail.videos = [...(detail.videos || []), newVideo];
        detail.video_url = JSON.stringify(detail.videos);
      }
      setDetails(updatedDetails);
    } else {
      const updatedVideos = [...(newDetail.videos || []), newVideo];
      setNewDetail({
        ...newDetail,
        videos: updatedVideos,
        video_url: JSON.stringify(updatedVideos)
      });
    }
    
    setTempVideoUrl('');
    setTempVideoLabel('');
  };

  const handleRemoveVideo = (index: number) => {
    if (editMode !== null) {
      const updatedDetails = [...details];
      const detail = updatedDetails.find(d => d.id === editMode);
      if (detail && detail.videos) {
        detail.videos = detail.videos.filter((_, i) => i !== index);
        detail.video_url = detail.videos.length > 0 ? JSON.stringify(detail.videos) : null;
      }
      setDetails(updatedDetails);
    } else {
      const updatedVideos = newDetail.videos?.filter((_, i) => i !== index) || [];
      setNewDetail({
        ...newDetail,
        videos: updatedVideos,
        video_url: updatedVideos.length > 0 ? JSON.stringify(updatedVideos) : null
      });
    }
  };

  const handleSaveDetail = async () => {
    try {
      setSaving(true);
      
      if (editMode !== null) {
        const detailToUpdate = details.find(d => d.id === editMode);
        if (!detailToUpdate) return;
        
        const updateData = {
          title: detailToUpdate.title,
          description: detailToUpdate.description,
          meeting_url: detailToUpdate.meeting_url,
          downloads: detailToUpdate.downloads,
          Infos: detailToUpdate.Infos,
          video_url: detailToUpdate.video_url
        };
        
        const { error } = await supabase
          .from('course_syllabus_details')
          .update(updateData)
          .eq('id', editMode);
          
        if (error) throw error;
        
        setEditMode(null);
        toast({
          title: language === 'en' ? 'Success' : 'Erfolg',
          description: language === 'en' ? 'Detail updated successfully' : 'Detail erfolgreich aktualisiert',
        });
      } else {
        const insertData = {
          course_id: courseId,
          course_syllabus_id: syllabusId,
          title: newDetail.title,
          description: newDetail.description,
          meeting_url: newDetail.meeting_url,
          downloads: newDetail.downloads,
          Infos: newDetail.Infos,
          video_url: newDetail.video_url
        };
        
        const { data, error } = await supabase
          .from('course_syllabus_details')
          .insert(insertData)
          .select();
          
        if (error) throw error;
        
        setNewDetail({
          id: null,
          title: '',
          description: '',
          video_url: '',
          meeting_url: '',
          downloads: [],
          Infos: [],
          course_syllabus_id: syllabusId,
          course_id: courseId,
          videos: []
        });
        
        toast({
          title: language === 'en' ? 'Success' : 'Erfolg',
          description: language === 'en' ? 'Detail added successfully' : 'Detail erfolgreich hinzugefügt',
        });
      }
      
      fetchDetails();
    } catch (error: any) {
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEditDetail = (detail: SyllabusDetailItem) => {
    setEditMode(detail.id as number);
    setTempDownload('');
    setTempInfo('');
    setTempVideoUrl('');
    setTempVideoLabel('');
  };

  const handleDeleteDetail = async (id: number) => {
    try {
      const { error } = await supabase
        .from('course_syllabus_details')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      fetchDetails();
      toast({
        title: language === 'en' ? 'Success' : 'Erfolg',
        description: language === 'en' ? 'Detail deleted successfully' : 'Detail erfolgreich gelöscht',
      });
    } catch (error: any) {
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    fetchDetails();
  };

  return (
    <div className="space-y-8 mt-6">
      <div className="font-medium text-lg mb-2">
        {language === 'en' ? `Materials for Module: ${syllabusTitle}` : `Materialien für Modul: ${syllabusTitle}`}
      </div>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {details.length === 0 ? (
            <div className="text-center p-4 border border-dashed rounded-md border-gray-300">
              <p className="text-gray-500">
                {language === 'en' 
                  ? 'No materials added yet for this module.' 
                  : 'Noch keine Materialien für dieses Modul hinzugefügt.'}
              </p>
            </div>
          ) : (
            details.map((detail) => (
              <div 
                key={detail.id} 
                className="p-4 border rounded-md bg-white shadow-sm"
              >
                {editMode === detail.id ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">
                      {language === 'en' ? 'Edit Material' : 'Material bearbeiten'}
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {language === 'en' ? 'Title' : 'Titel'}
                      </label>
                      <Input
                        value={detail.title || ''}
                        onChange={(e) => {
                          const updatedDetails = [...details];
                          const detailToUpdate = updatedDetails.find(d => d.id === detail.id);
                          if (detailToUpdate) {
                            detailToUpdate.title = e.target.value;
                          }
                          setDetails(updatedDetails);
                        }}
                        placeholder={language === 'en' ? 'Title' : 'Titel'}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {language === 'en' ? 'Description' : 'Beschreibung'}
                      </label>
                      <Textarea
                        value={detail.description || ''}
                        onChange={(e) => {
                          const updatedDetails = [...details];
                          const detailToUpdate = updatedDetails.find(d => d.id === detail.id);
                          if (detailToUpdate) {
                            detailToUpdate.description = e.target.value;
                          }
                          setDetails(updatedDetails);
                        }}
                        placeholder={language === 'en' ? 'Description' : 'Beschreibung'}
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center text-sm font-medium mb-1">
                        <Video className="h-4 w-4 mr-1" />
                        {language === 'en' ? 'Videos' : 'Videos'}
                      </label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                        <div className="md:col-span-2">
                          <Input
                            value={tempVideoUrl}
                            onChange={(e) => setTempVideoUrl(e.target.value)}
                            placeholder={language === 'en' ? 'Video URL' : 'Video-URL'}
                            className="w-full"
                          />
                        </div>
                        <div className="md:col-span-1">
                          <Input
                            value={tempVideoLabel}
                            onChange={(e) => setTempVideoLabel(e.target.value)}
                            placeholder={language === 'en' ? 'Label (optional)' : 'Bezeichnung (optional)'}
                            className="w-full"
                          />
                        </div>
                        <div className="md:col-span-1">
                          <Button 
                            type="button" 
                            className="w-full"
                            size="sm" 
                            onClick={handleAddVideo}
                          >
                            <Plus className="h-4 w-4 mr-1" /> 
                            {language === 'en' ? 'Add' : 'Hinzufügen'}
                          </Button>
                        </div>
                      </div>
                      
                      {detail.videos && detail.videos.length > 0 && (
                        <div className="space-y-2 mt-2">
                          {detail.videos.map((video, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <div className="flex-1 truncate mr-2">
                                <span className="font-medium text-sm">
                                  {video.label || (language === 'en' ? `Video ${index + 1}` : `Video ${index + 1}`)}:
                                </span>{' '}
                                <span className="text-sm text-gray-600 truncate">{video.url}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoveVideo(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="flex items-center text-sm font-medium mb-1">
                        <Link2 className="h-4 w-4 mr-1" />
                        {language === 'en' ? 'Meeting URL' : 'Meeting-URL'}
                      </label>
                      <Input
                        value={detail.meeting_url || ''}
                        onChange={(e) => {
                          const updatedDetails = [...details];
                          const detailToUpdate = updatedDetails.find(d => d.id === detail.id);
                          if (detailToUpdate) {
                            detailToUpdate.meeting_url = e.target.value;
                          }
                          setDetails(updatedDetails);
                        }}
                        placeholder={language === 'en' ? 'URL to the meeting' : 'URL zum Meeting'}
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center text-sm font-medium mb-1">
                        <FileText className="h-4 w-4 mr-1" />
                        {language === 'en' ? 'Downloads' : 'Downloads'}
                      </label>
                      
                      <div className="flex space-x-2 mb-2">
                        <Input
                          value={tempDownload}
                          onChange={(e) => setTempDownload(e.target.value)}
                          placeholder={language === 'en' ? 'URL to download' : 'URL zum Download'}
                        />
                        <Button type="button" size="sm" onClick={handleAddDownload}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {detail.downloads && detail.downloads.length > 0 && (
                        <div className="space-y-2 mt-2">
                          {detail.downloads.map((url, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-sm truncate">{url}</span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoveDownload(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="flex items-center text-sm font-medium mb-1">
                        <Info className="h-4 w-4 mr-1" />
                        {language === 'en' ? 'Additional Information' : 'Zusätzliche Informationen'}
                      </label>
                      
                      <div className="flex space-x-2 mb-2">
                        <Input
                          value={tempInfo}
                          onChange={(e) => setTempInfo(e.target.value)}
                          placeholder={language === 'en' ? 'Additional information' : 'Zusätzliche Information'}
                        />
                        <Button type="button" size="sm" onClick={handleAddInfo}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {detail.Infos && detail.Infos.length > 0 && (
                        <div className="space-y-2 mt-2">
                          {detail.Infos.map((info, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-sm">{info}</span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoveInfo(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <Button onClick={handleSaveDetail} disabled={saving}>
                        {language === 'en' ? 'Save Changes' : 'Änderungen speichern'}
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit}>
                        {language === 'en' ? 'Cancel' : 'Abbrechen'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-lg">{detail.title}</h3>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditDetail(detail)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteDetail(detail.id as number)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    
                    {detail.description && (
                      <p className="text-gray-600 mt-2">{detail.description}</p>
                    )}
                    
                    <div className="mt-4 space-y-2">
                      {detail.videos && detail.videos.length > 0 ? (
                        <div className="flex items-start text-sm">
                          <Video className="h-4 w-4 text-blue-500 mr-2 mt-1" />
                          <div className="text-gray-700">
                            <div className="font-medium mb-1">{language === 'en' ? 'Videos:' : 'Videos:'}</div>
                            <ul className="list-disc list-inside ml-2">
                              {detail.videos.map((video, i) => (
                                <li key={i} className="truncate">
                                  {video.label || (language === 'en' ? `Video ${i + 1}` : `Video ${i + 1}`)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : detail.video_url ? (
                        <div className="flex items-center text-sm">
                          <Video className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="text-gray-700 truncate">{detail.video_url}</span>
                        </div>
                      ) : null}
                      
                      {detail.meeting_url && (
                        <div className="flex items-center text-sm">
                          <Link2 className="h-4 w-4 text-purple-500 mr-2" />
                          <span className="text-gray-700 truncate">{detail.meeting_url}</span>
                        </div>
                      )}
                      
                      {detail.downloads && detail.downloads.length > 0 && (
                        <div className="flex items-start text-sm">
                          <FileText className="h-4 w-4 text-green-500 mr-2 mt-1" />
                          <div className="text-gray-700">
                            <div className="font-medium mb-1">{language === 'en' ? 'Downloads:' : 'Downloads:'}</div>
                            <ul className="list-disc list-inside ml-2">
                              {detail.downloads.map((url, i) => (
                                <li key={i} className="truncate">{url}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      
                      {detail.Infos && detail.Infos.length > 0 && (
                        <div className="flex items-start text-sm">
                          <Info className="h-4 w-4 text-amber-500 mr-2 mt-1" />
                          <div className="text-gray-700">
                            <div className="font-medium mb-1">
                              {language === 'en' ? 'Additional Information:' : 'Zusätzliche Informationen:'}
                            </div>
                            <ul className="list-disc list-inside ml-2">
                              {detail.Infos.map((info, i) => (
                                <li key={i}>{info}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
      
      {editMode === null && (
        <div className="bg-gray-50 p-4 rounded-md border">
          <h3 className="font-semibold text-lg mb-4">
            {language === 'en' ? 'Add New Material' : 'Neues Material hinzufügen'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {language === 'en' ? 'Title' : 'Titel'}
              </label>
              <Input
                value={newDetail.title || ''}
                onChange={(e) => setNewDetail({...newDetail, title: e.target.value})}
                placeholder={language === 'en' ? 'Title' : 'Titel'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {language === 'en' ? 'Description' : 'Beschreibung'}
              </label>
              <Textarea
                value={newDetail.description || ''}
                onChange={(e) => setNewDetail({...newDetail, description: e.target.value})}
                placeholder={language === 'en' ? 'Description' : 'Beschreibung'}
              />
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium mb-1">
                <Video className="h-4 w-4 mr-1" />
                {language === 'en' ? 'Videos' : 'Videos'}
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                <div className="md:col-span-2">
                  <Input
                    value={tempVideoUrl}
                    onChange={(e) => setTempVideoUrl(e.target.value)}
                    placeholder={language === 'en' ? 'Video URL' : 'Video-URL'}
                    className="w-full"
                  />
                </div>
                <div className="md:col-span-1">
                  <Input
                    value={tempVideoLabel}
                    onChange={(e) => setTempVideoLabel(e.target.value)}
                    placeholder={language === 'en' ? 'Label (optional)' : 'Bezeichnung (optional)'}
                    className="w-full"
                  />
                </div>
                <div className="md:col-span-1">
                  <Button 
                    type="button" 
                    className="w-full"
                    size="sm" 
                    onClick={handleAddVideo}
                  >
                    <Plus className="h-4 w-4 mr-1" /> 
                    {language === 'en' ? 'Add' : 'Hinzufügen'}
                  </Button>
                </div>
              </div>
              
              {newDetail.videos && newDetail.videos.length > 0 && (
                <div className="space-y-2 mt-2">
                  {newDetail.videos.map((video, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex-1 truncate mr-2">
                        <span className="font-medium text-sm">
                          {video.label || (language === 'en' ? `Video ${index + 1}` : `Video ${index + 1}`)}:
                        </span>{' '}
                        <span className="text-sm text-gray-600 truncate">{video.url}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveVideo(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium mb-1">
                <Link2 className="h-4 w-4 mr-1" />
                {language === 'en' ? 'Meeting URL' : 'Meeting-URL'}
              </label>
              <Input
                value={newDetail.meeting_url || ''}
                onChange={(e) => setNewDetail({...newDetail, meeting_url: e.target.value})}
                placeholder={language === 'en' ? 'URL to the meeting' : 'URL zum Meeting'}
              />
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium mb-1">
                <FileText className="h-4 w-4 mr-1" />
                {language === 'en' ? 'Downloads' : 'Downloads'}
              </label>
              
              <div className="flex space-x-2 mb-2">
                <Input
                  value={tempDownload}
                  onChange={(e) => setTempDownload(e.target.value)}
                  placeholder={language === 'en' ? 'URL to download' : 'URL zum Download'}
                />
                <Button type="button" size="sm" onClick={handleAddDownload}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {newDetail.downloads && newDetail.downloads.length > 0 && (
                <div className="space-y-2 mt-2">
                  {newDetail.downloads.map((url, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm truncate">{url}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveDownload(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium mb-1">
                <Info className="h-4 w-4 mr-1" />
                {language === 'en' ? 'Additional Information' : 'Zusätzliche Informationen'}
              </label>
              
              <div className="flex space-x-2 mb-2">
                <Input
                  value={tempInfo}
                  onChange={(e) => setTempInfo(e.target.value)}
                  placeholder={language === 'en' ? 'Additional information' : 'Zusätzliche Information'}
                />
                <Button type="button" size="sm" onClick={handleAddInfo}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {newDetail.Infos && newDetail.Infos.length > 0 && (
                <div className="space-y-2 mt-2">
                  {newDetail.Infos.map((info, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{info}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveInfo(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Button onClick={handleSaveDetail} disabled={saving}>
              {language === 'en' ? 'Add Material' : 'Material hinzufügen'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyllabusDetailsManager;
