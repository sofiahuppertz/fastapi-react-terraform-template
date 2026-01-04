import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { text, palettes, primary } from '../../config/colors';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  id?: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
}

export function Dropdown({
  id,
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  searchable = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Filter options based on search query
  const filteredOptions = searchable && searchQuery
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setIsFocused(false);
    setSearchQuery('');
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (isOpen) {
        setSearchQuery('');
      }
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={handleToggle}
        onFocus={() => setIsFocused(true)}
        disabled={disabled}
        className="w-full px-4 py-3 border rounded-xl transition-all duration-200 font-satoshi text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          borderColor: isFocused ? primary.blue : palettes.blue.blue2,
          outline: isFocused ? `2px solid ${palettes.blue.blue1}` : 'none',
          backgroundColor: 'white',
          color: text.primary,
        }}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: text.subtle }}
        />
      </button>

      {isOpen && !disabled && (
        <div
          className="absolute z-50 w-full mt-2 rounded-xl shadow-lg border overflow-hidden"
          style={{
            backgroundColor: 'white',
            borderColor: palettes.blue.blue1,
            maxHeight: searchable ? '350px' : '300px',
          }}
        >
          {searchable && (
            <div className="p-2 border-b" style={{ borderColor: palettes.blue.blue1 }}>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  style={{ color: text.subtle }}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-3 py-2 border rounded-lg font-satoshi text-sm focus:outline-none focus:ring-2"
                  style={{
                    borderColor: palettes.blue.blue2,
                    color: text.primary,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = primary.blue;
                    e.currentTarget.style.outline = `2px solid ${palettes.blue.blue1}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = palettes.blue.blue2;
                    e.currentTarget.style.outline = 'none';
                  }}
                />
              </div>
            </div>
          )}
          <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: searchable ? '300px' : '300px' }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className="w-full px-4 py-3 text-left font-satoshi transition-all duration-150"
                  style={{
                    backgroundColor: value === option.value ? palettes.teal.teal0 : 'white',
                    color: value === option.value ? primary.sky : text.primary,
                  }}
                  onMouseEnter={(e) => {
                    if (value !== option.value) {
                      e.currentTarget.style.backgroundColor = palettes.dusty.dusty0 + '50';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (value !== option.value) {
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center font-satoshi" style={{ color: text.subtle }}>
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

