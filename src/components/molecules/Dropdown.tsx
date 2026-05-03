import { useEffect, useRef, useState } from 'react';
import { DropdownText } from '@/constant/components.constant';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  title: string;
  options: DropdownOption[];
  onSelect?: (value: string) => void;
}

export const Dropdown = ({ title, options, onSelect }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) {
        return;
      }

      if (!dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: DropdownOption) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect?.(option.value);
  };

  return (
    <div ref={dropdownRef} className="relative flex w-full flex-col pt-4">
      <p className="w-full">{title}</p>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="mt-2 w-full rounded border border-miku bg-inherit px-3 py-2 text-left font-bold focus:outline-none focus:ring-2 focus:ring-miku">
        <span>{selectedOption?.label ?? DropdownText.placeholder}</span>
      </button>

      {isOpen && (
        <ul className="absolute left-0 top-full z-20 mt-1 max-h-60 w-full overflow-y-auto rounded border border-miku bg-inherit shadow">
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full bg-inherit px-3 py-2 text-left hover:bg-gray-100">
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
