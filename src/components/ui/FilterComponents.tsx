import { useState } from 'react';

interface FilterPanelProps {
  title: string;
  children: React.ReactNode;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

export function FilterPanel({ 
  title, 
  children, 
  isCollapsible = true, 
  defaultExpanded = true,
  className = '' 
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div 
        className={`
          px-4 py-3 border-b border-gray-100 flex items-center justify-between
          ${isCollapsible ? 'cursor-pointer hover:bg-gray-50' : ''}
        `}
        onClick={isCollapsible ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <h3 className="font-semibold text-gray-800">{title}</h3>
        {isCollapsible && (
          <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        )}
      </div>
      
      {isExpanded && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
}

// Range Slider Component
interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export function RangeSlider({ 
  label, 
  min, 
  max, 
  value, 
  onChange, 
  step = 1, 
  formatValue = (val) => val.toString(),
  className = '' 
}: RangeSliderProps) {
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm text-gray-500">
          {formatValue(value[0])} - {formatValue(value[1])}
        </span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => onChange([parseInt(e.target.value), value[1]])}
          className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={(e) => onChange([value[0], parseInt(e.target.value)])}
          className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
        />
      </div>
    </div>
  );
}

// Checkbox Filter Component
interface CheckboxFilterProps {
  options: Array<{ id: string; label: string; count?: number }>;
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  className?: string;
}

export function CheckboxFilter({ 
  options, 
  selectedIds, 
  onChange,
  className = '' 
}: CheckboxFilterProps) {
  const toggleOption = (optionId: string) => {
    if (selectedIds.includes(optionId)) {
      onChange(selectedIds.filter(id => id !== optionId));
    } else {
      onChange([...selectedIds, optionId]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {options.map((option) => (
        <label key={option.id} className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={selectedIds.includes(option.id)}
            onChange={() => toggleOption(option.id)}
            className="mr-3 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700 flex-1">{option.label}</span>
          {option.count && (
            <span className="text-xs text-gray-500">({option.count})</span>
          )}
        </label>
      ))}
    </div>
  );
}

// Search Input Component
interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  className?: string;
}

export function SearchInput({ 
  placeholder, 
  value, 
  onChange, 
  onSearch,
  className = '' 
}: SearchInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      {onSearch && (
        <button
          onClick={onSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary-600 hover:text-primary-800"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
          </svg>
        </button>
      )}
    </div>
  );
}