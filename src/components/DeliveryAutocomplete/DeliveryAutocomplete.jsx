import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import './DeliveryAutocomplete.scss';

const DeliveryAutocomplete = ({ 
  type = 'city', // 'city' or 'warehouse'
  value, 
  onChange, 
  onSearch, 
  placeholder,
  disabled = false,
  error = '',
  cityRef = null,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const wrapperRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Закриття випадаючого списку при кліку поза компонентом
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Пошук з debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Для міст — мінімум 2 символи, для відділень — дозволяємо фільтрацію від 1 символу
    const minLength = type === 'city' ? 2 : 1;

    if (query.length >= minLength) {
      searchTimeoutRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const data = type === 'warehouse'
            ? await onSearch(query, cityRef)
            : await onSearch(query);
          setResults(data);
          setIsOpen(data.length > 0);
        } catch (error) {
          console.error('Помилка пошуку:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else if (query.length === 0 && type === 'city') {
      setResults([]);
      setIsOpen(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, onSearch, cityRef, type]);

  // При зміні cityRef: скидаємо вибір і автоматично завантажуємо відділення
  useEffect(() => {
    if (type === 'warehouse') {
      setQuery('');
      setSelectedLabel('');
      setResults([]);

      if (cityRef) {
        setIsLoading(true);
        onSearch('', cityRef).then((data) => {
          setResults(data);
          setIsOpen(data.length > 0);
        }).catch(() => {
          setResults([]);
        }).finally(() => {
          setIsLoading(false);
        });
      }
    }
  }, [cityRef, type]);

  const handleSelect = (item) => {
    setQuery('');
    setSelectedLabel(item.label);
    setIsOpen(false);
    onChange(item);
  };

  const handleClear = () => {
    setQuery('');
    setSelectedLabel('');
    setResults([]);
    onChange({ value: '', label: '' });
  };

  const handleInputChange = (e) => {
    const newQuery = e.target.value;

    // Якщо було вибрано значення і користувач почав друкувати/видаляти — скидаємо вибір
    if (selectedLabel) {
      setSelectedLabel('');
      onChange({ value: '', label: '' });
    }

    setQuery(newQuery);
  };

  return (
    <div className="delivery-autocomplete" ref={wrapperRef}>
      <div className={`delivery-autocomplete__input-wrapper ${error ? 'error' : ''}`}>
        <Search size={18} className="delivery-autocomplete__icon" />
        <input
          type="text"
          value={selectedLabel || query}
          onChange={handleInputChange}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="delivery-autocomplete__input"
        />
        {(selectedLabel || query) && (
          <button
            type="button"
            onClick={handleClear}
            className="delivery-autocomplete__clear"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="delivery-autocomplete__dropdown">
          {isLoading ? (
            <div className="delivery-autocomplete__loading">
              Завантаження...
            </div>
          ) : results.length > 0 ? (
            <ul className="delivery-autocomplete__list">
              {results.map((item) => (
                <li
                  key={item.value}
                  onClick={() => handleSelect(item)}
                  className="delivery-autocomplete__item"
                >
                  <MapPin size={16} className="delivery-autocomplete__item-icon" />
                  <div className="delivery-autocomplete__item-content">
                    <div className="delivery-autocomplete__item-label">
                      {item.label}
                    </div>
                    {item.address && (
                      <div className="delivery-autocomplete__item-address">
                        {item.address}
                      </div>
                    )}
                    {item.area && (
                      <div className="delivery-autocomplete__item-area">
                        {item.area}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="delivery-autocomplete__empty">
              Нічого не знайдено
            </div>
          )}
        </div>
      )}

      {error && <span className="delivery-autocomplete__error">{error}</span>}
    </div>
  );
};

export default DeliveryAutocomplete;
