import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DropdownText } from '@/constant/components.constant';

const ESTIMATED_MENU_HEIGHT = 240;

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getMenuStyle = (): React.CSSProperties => {
    if (!buttonRef.current) return {};
    const rect = buttonRef.current.getBoundingClientRect();
    const base = { position: 'fixed' as const, left: rect.left, width: rect.width };
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    if (spaceBelow < ESTIMATED_MENU_HEIGHT && spaceAbove > spaceBelow) {
      return { ...base, bottom: window.innerHeight - rect.top + 4 };
    }
    return { ...base, top: rect.bottom + 4 };
  };

  const handleSelect = (option: DropdownOption) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect?.(option.value);
  };

  return (
    <div className="flex w-full flex-col pt-4">
      <p className="w-full">{title}</p>

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="mt-2 w-full rounded border border-miku bg-white px-3 py-2 text-left font-bold text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-miku">
        {selectedOption?.label ?? DropdownText.placeholder}
      </button>

      {isOpen &&
        createPortal(
          <ul
            ref={menuRef}
            style={getMenuStyle()}
            className="z-9999 max-h-60 overflow-y-auto rounded border border-miku bg-white text-black shadow-lg">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100">
                  {option.label}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
};
