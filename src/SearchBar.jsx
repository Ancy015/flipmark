import { useState } from 'react';

const SearchBar = ({ products = [], value = '', onChange = () => {}, onSelect }) => {
    const normalized = (value ?? '').trim().toLowerCase();
    const suggestions = normalized
      ? products.filter((item) => {
          const name = item?.name ?? '';
          const category = item?.category ?? '';
          return (
            name.toLowerCase().includes(normalized) ||
            category.toLowerCase().includes(normalized)
          );
        }).slice(0, 8)
      : [];
  
    const handleSearch = (e) => {
      const nextValue = e.target.value;
      onChange(nextValue);
    };
  
    const handleClick = (item) => {
      // update input value with clicked item
      onChange(item.name);
  
      // notify parent about selected item
      if (onSelect) {
        onSelect(item);
      }
    };
  
    const clearSearch = () => {
      onChange('');
    };
  
    return (
      <div className="search-box">
        <div className="search-input-row">
          <input
            type="text"
            value={value}
            onChange={handleSearch}
            placeholder="Search name or category"
          />
          <button type="button" onClick={clearSearch}>
            Clear
          </button>
        </div>
  
        {suggestions.length > 0 && (
          <div className="search-suggestions" role="listbox" aria-label="Product suggestions">
            {suggestions.map((item, index) => (
              <button
                type="button"
                key={item?.id ?? item?.name ?? index}
                className="search-suggestion-item"
                onClick={() => handleClick(item)}   // ✅ each item gets its own click handler
              >
                {item?.name ?? 'Unnamed product'}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default SearchBar;
  