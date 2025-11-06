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

  console.log('🔧 DeliveryAutocomplete render:', { type, value, disabled, cityRef, query, selectedLabel });

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
    console.log('🔄 useEffect пошуку спрацював:', { query, type });
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length >= 2) {
      console.log('✅ Довжина query >= 2, запускаємо пошук через 300мс');
      searchTimeoutRef.current = setTimeout(async () => {
        setIsLoading(true);
        console.log('🚀 Викликаємо onSearch функцію з query:', query);
        try {
          const data = await onSearch(query, cityRef);
          console.log('📦 Отримано результати пошуку:', data);
          setResults(data);
          setIsOpen(data.length > 0);
        } catch (error) {
          console.error('❌ Помилка пошуку в компоненті:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      console.log('⏸️ Query занадто короткий, пошук не запускається');
      setResults([]);
      setIsOpen(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, onSearch, cityRef]);

  // Скидання при зміні cityRef (для відділень)
  useEffect(() => {
    if (type === 'warehouse') {
      console.log('🔄 cityRef змінився, скидаємо warehouse');
      setQuery('');
      setSelectedLabel('');
      setResults([]);
    }
  }, [cityRef, type]);

  const handleSelect = (item) => {
    console.log('✅ Вибрано елемент:', item);
    setQuery('');
    setSelectedLabel(item.label);
    setIsOpen(false);
    onChange(item);
  };

  const handleClear = () => {
    console.log('🗑️ Очищення поля');
    setQuery('');
    setSelectedLabel('');
    setResults([]);
    onChange({ value: '', label: '' });
  };

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    console.log('⌨️ Введення тексту:', newQuery);
    setQuery(newQuery);
    
    // Якщо користувач очищає input і вже щось було вибрано
    if (newQuery === '' && selectedLabel) {
      setSelectedLabel('');
      onChange({ value: '', label: '' });
    }
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
            console.log('👆 Focus на input, results:', results.length);
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
