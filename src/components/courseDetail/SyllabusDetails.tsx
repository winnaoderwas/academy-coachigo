import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  Video, 
  FileText, 
  ExternalLink, 
  Play, 
  Download,
  Info,
  Book,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from '@/components/ui/collapsible';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SyllabusDetailsProps {
  courseId: string;
}

interface SyllabusDetailItem {
  id: number;
  title: string | null;
  description: string | null;
  video_url: string | null;
  meeting_url: string | null;
  downloads: string[] | null;
  Infos: string[] | null;
  course_syllabus_id: string | null;
}

interface SyllabusItem {
  id: string;
  title: string;
  description: string;
  order_num: number;
  materials?: SyllabusDetailItem[];
}

const SyllabusDetails = ({ courseId }: SyllabusDetailsProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [syllabusItems, setSyllabusItems] = useState<SyllabusItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [videoLabels, setVideoLabels] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetchSyllabusWithDetails();
  }, [courseId]);

  const fetchSyllabusWithDetails = async () => {
    try {
      setLoading(true);
      
      // First fetch all syllabus items
      const { data: syllabusData, error: syllabusError } = await supabase
        .from('course_syllabus')
        .select('*')
        .eq('course_id', courseId)
        .order('order_num', { ascending: true });

      if (syllabusError) throw syllabusError;
      
      if (!syllabusData || syllabusData.length === 0) {
        setSyllabusItems([]);
        setLoading(false);
        return;
      }
      
      // Fetch all syllabus details
      const { data: detailsData, error: detailsError } = await supabase
        .from('course_syllabus_details')
        .select('*')
        .eq('course_id', courseId);

      if (detailsError) throw detailsError;

      // Process video URLs for multiple videos
      const videoLabelMap: Record<string, string[]> = {};
      
      detailsData?.forEach(detail => {
        if (detail.video_url) {
          // Check if we need to extract multiple videos
          try {
            const videoData = JSON.parse(detail.video_url);
            if (Array.isArray(videoData)) {
              const labels = videoData.map(v => v.label || language === 'en' ? 'Watch Video' : 'Video ansehen');
              videoLabelMap[detail.id] = labels;
            }
          } catch (e) {
            // Not JSON, so it's a single video URL
            videoLabelMap[detail.id] = [language === 'en' ? 'Watch Video' : 'Video ansehen'];
          }
        }
      });
      
      setVideoLabels(videoLabelMap);
      
      // Map details to syllabus items
      const syllabusWithDetails = syllabusData.map(item => {
        const materials = detailsData?.filter(detail => detail.course_syllabus_id === item.id) || [];
        
        // Process each material to handle video_url field correctly
        const processedMaterials = materials.map(material => {
          let processedMaterial = { ...material };
          
          // Try to parse video_url as JSON in case it's multiple videos
          if (material.video_url) {
            try {
              const videoData = JSON.parse(material.video_url);
              if (Array.isArray(videoData)) {
                // Keep the original format for later processing
                processedMaterial.video_url = material.video_url;
              }
            } catch (e) {
              // If it's not valid JSON, keep as is (single URL)
            }
          }
          
          return processedMaterial;
        });
        
        return {
          ...item,
          materials: processedMaterials
        };
      });
      
      setSyllabusItems(syllabusWithDetails);
      
      // Remove the initial video selection
      setSelectedVideo(null);
    } catch (error: any) {
      console.error('Error fetching syllabus with details:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
      setSyllabusItems([]);
    } finally {
      setLoading(false);
    }
  };

  const renderVideoPlayer = () => {
    if (!selectedVideo) return null;

    return (
      <div className="rounded-lg overflow-hidden bg-black mb-6">
        <div className="aspect-w-16 aspect-h-9">
          <iframe 
            src={selectedVideo}
            title="Video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            style={{ aspectRatio: '16/9' }}
          ></iframe>
        </div>
      </div>
    );
  };

  const handleVideoClick = (videoUrl: string | null) => {
    if (!videoUrl) return;
    
    try {
      // Try to parse it as JSON in case it contains multiple videos
      const videoData = JSON.parse(videoUrl);
      if (Array.isArray(videoData) && videoData.length > 0) {
        // If it's the first video or currently no video is selected, select the first one
        setSelectedVideo(videoData[0].url);
      }
    } catch (e) {
      // If it's not valid JSON, treat it as a single URL
      setSelectedVideo(videoUrl);
    }
  };

  const handleDownload = (url: string) => {
    const fileName = url.split('/').pop() || 'download';
    toast({
      title: language === 'en' ? 'Downloading' : 'Wird heruntergeladen',
      description: fileName,
    });
    window.open(url, '_blank');
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModule(prevModule => prevModule === moduleId ? null : moduleId);
  };

  const renderVideoButtons = (material: SyllabusDetailItem) => {
    if (!material.video_url) return null;
    
    try {
      const videoData = JSON.parse(material.video_url);
      if (Array.isArray(videoData)) {
        return (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="videos">
              <AccordionTrigger className="py-2">
                <span className="flex items-center">
                  <Video className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Videos' : 'Videos'}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {videoData.map((video, index) => (
                    <Button 
                      key={index}
                      onClick={() => setSelectedVideo(video.url)}
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span className="flex items-center">
                        <Video className="h-4 w-4 mr-2" />
                        {video.label || (language === 'en' ? `Video ${index + 1}` : `Video ${index + 1}`)}
                      </span>
                      <Play className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      }
    } catch (e) {
      // Not JSON, handle as single URL
    }
    
    // Default case: single video URL
    return (
      <Button 
        onClick={() => setSelectedVideo(material.video_url)}
        variant="outline"
        className="w-full justify-between"
      >
        <span className="flex items-center">
          <Video className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Watch Video' : 'Video ansehen'}
        </span>
        <Play className="h-4 w-4" />
      </Button>
    );
  };

  if (loading) {
    return (
      <div className="glass rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Video className="h-5 w-5 mr-2 text-primary" />
          {language === 'en' ? 'Course Materials' : 'Kursmaterialien'}
        </h2>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (syllabusItems.length === 0) {
    return (
      <div className="glass rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Video className="h-5 w-5 mr-2 text-primary" />
          {language === 'en' ? 'Course Materials' : 'Kursmaterialien'}
        </h2>
        <div className="bg-white rounded-lg p-6 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {language === 'en' ? 'No Materials Available Yet' : 'Noch keine Materialien verfügbar'}
          </h3>
          <p className="text-gray-500">
            {language === 'en' 
              ? 'The instructor has not uploaded any materials for this course yet.' 
              : 'Der Dozent hat noch keine Materialien für diesen Kurs hochgeladen.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Book className="h-5 w-5 mr-2 text-primary" />
        {language === 'en' ? 'Course Materials' : 'Kursmaterialien'}
      </h2>

      {renderVideoPlayer()}

      <div className="space-y-4">
        {syllabusItems.map((syllabus) => (
          <Collapsible 
            key={syllabus.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
            open={expandedModule === syllabus.id}
            onOpenChange={(open) => {
              if (open) {
                setExpandedModule(syllabus.id);
              } else if (expandedModule === syllabus.id) {
                setExpandedModule(null);
              }
            }}
          >
            <CollapsibleTrigger asChild>
              <div 
                className="p-4 flex items-center justify-between cursor-pointer bg-gray-50 hover:bg-gray-100"
                onClick={() => toggleModule(syllabus.id)}
              >
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-lg">
                    {`${language === 'en' ? 'Module' : 'Modul'} ${syllabus.order_num + 1}: ${syllabus.title}`}
                  </h3>
                </div>
                {expandedModule === syllabus.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="p-4">
                {syllabus.description && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">{language === 'en' ? 'Description' : 'Beschreibung'}</h4>
                    <p className="text-gray-700">{syllabus.description}</p>
                  </div>
                )}

                {syllabus.materials && syllabus.materials.length > 0 ? (
                  <div className="space-y-6">
                    {syllabus.materials.map((material) => (
                      <div key={material.id} className="p-4 bg-gray-50 rounded-lg">
                        {material.title && (
                          <h4 className="font-medium mb-3">{material.title}</h4>
                        )}
                        
                        {material.description && (
                          <p className="text-gray-700 mb-4">{material.description}</p>
                        )}
                        
                        <div className="space-y-4">
                          {material.video_url && (
                            <div>
                              {renderVideoButtons(material)}
                            </div>
                          )}

                          {material.meeting_url && (
                            <div>
                              <Button 
                                onClick={() => window.open(material.meeting_url!, '_blank')}
                                variant="outline"
                                className="w-full justify-between"
                              >
                                <span className="flex items-center">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  {language === 'en' ? 'Join Meeting' : 'Meeting beitreten'}
                                </span>
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          )}

                          {material.downloads && material.downloads.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">{language === 'en' ? 'Downloads' : 'Downloads'}</h4>
                              <div className="space-y-2">
                                {material.downloads.map((download, index) => (
                                  <Button 
                                    key={index}
                                    variant="outline"
                                    className="w-full justify-between text-left"
                                    onClick={() => handleDownload(download)}
                                  >
                                    <span className="flex items-center">
                                      <FileText className="h-4 w-4 mr-2" />
                                      <span className="truncate">{download.split('/').pop()}</span>
                                    </span>
                                    <Download className="h-4 w-4 flex-shrink-0" />
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}

                          {material.Infos && material.Infos.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">{language === 'en' ? 'Additional Information' : 'Zusätzliche Informationen'}</h4>
                              <div className="space-y-2 bg-white p-3 rounded-lg border border-gray-100">
                                {material.Infos.map((info, index) => (
                                  <div key={index} className="flex items-start p-2">
                                    <Info className="h-4 w-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                                    <p className="text-gray-700">{info}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    {language === 'en' 
                      ? 'No additional materials available for this module yet.' 
                      : 'Noch keine zusätzlichen Materialien für dieses Modul verfügbar.'}
                  </p>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default SyllabusDetails;
