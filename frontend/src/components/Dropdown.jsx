import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Dropdown.module.css';

export default function Dropdown({ 
  options, 
  value, 
  onChange, 
  placeholder,
  className = '',
  error = false 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`${styles.dropdownContainer} ${className}`} ref={dropdownRef}>
      <div 
        className={`${styles.dropdownTrigger} ${error ? styles.error : ''} ${!value ? styles.placeholder : ''} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={20} className={`${styles.icon} ${isOpen ? styles.open : ''}`} />
      </div>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {options.map((option) => (
            <div 
              key={option.value}
              className={`${styles.dropdownItem} ${value === option.value ? styles.selected : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
