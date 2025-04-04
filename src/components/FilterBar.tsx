
import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { CourseLevel, CourseFormat, CourseCategory } from '@/types';

interface FilterBarProps {
  onLevelChange: (level: CourseLevel | 'all') => void;
  onFormatChange: (format: CourseFormat | 'all') => void;
  onCategoryChange: (category: CourseCategory | 'all') => void;
  onClearFilters: () => void;
  activeFilters: {
    level: CourseLevel | 'all';
    format: CourseFormat | 'all';
    category: CourseCategory | 'all';
  };
}

const FilterBar = ({
  onLevelChange,
  onFormatChange,
  onCategoryChange,
  onClearFilters,
  activeFilters
}: FilterBarProps) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const levels: (CourseLevel | 'all')[] = ['all', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const formats: (CourseFormat | 'all')[] = ['all', 'Online', 'Offline', 'Hybrid'];
  const categories: (CourseCategory | 'all')[] = [
    'all',
    'Machine Learning',
    'Deep Learning',
    'Natural Language Processing',
    'Computer Vision',
    'Reinforcement Learning',
    'AI Ethics'
  ];

  const hasActiveFilters = 
    activeFilters.level !== 'all' || 
    activeFilters.format !== 'all' || 
    activeFilters.category !== 'all';

  const renderFilters = () => (
    <>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Level</label>
          <Select
            value={activeFilters.level}
            onValueChange={(value) => onLevelChange(value as CourseLevel | 'all')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level === 'all' ? 'All Levels' : level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Format</label>
          <Select
            value={activeFilters.format}
            onValueChange={(value) => onFormatChange(value as CourseFormat | 'all')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Formats" />
            </SelectTrigger>
            <SelectContent>
              {formats.map((format) => (
                <SelectItem key={format} value={format}>
                  {format === 'all' ? 'All Formats' : format}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Category</label>
          <Select
            value={activeFilters.category}
            onValueChange={(value) => onCategoryChange(value as CourseCategory | 'all')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="w-full text-sm"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      )}
    </>
  );

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Kursübersicht</h2>
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden"
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Active Filter Pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.level !== 'all' && (
            <Badge variant="secondary" className="px-3 py-1">
              Level: {activeFilters.level}
              <X 
                className="h-3 w-3 ml-2 cursor-pointer" 
                onClick={() => onLevelChange('all')}
              />
            </Badge>
          )}
          {activeFilters.format !== 'all' && (
            <Badge variant="secondary" className="px-3 py-1">
              Format: {activeFilters.format}
              <X 
                className="h-3 w-3 ml-2 cursor-pointer" 
                onClick={() => onFormatChange('all')}
              />
            </Badge>
          )}
          {activeFilters.category !== 'all' && (
            <Badge variant="secondary" className="px-3 py-1">
              Category: {activeFilters.category}
              <X 
                className="h-3 w-3 ml-2 cursor-pointer" 
                onClick={() => onCategoryChange('all')}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <div className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter 
          </h3>
          <Separator className="mb-4" />
          {renderFilters()}
        </div>
      </div>

      {/* Mobile Filters */}
      {isMobileFilterOpen && (
        <div className="lg:hidden glass rounded-xl p-4 mb-4 animate-fade-in">
          {renderFilters()}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
