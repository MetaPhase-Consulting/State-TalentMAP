import { useEffect, useState } from 'react';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';
import PropTypes from 'prop-types';

const MonthYearInput = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [isError, setIsError] = useState(false);

  const formatMonthYear = (date) => {
    if (!date) return '';
    // Can i always assume value will be MM/YYYY - check DB
    return date;
  };

  useEffect(() => {
    setInputValue(formatMonthYear(value));
  }, [value]);

  const formatInput = (input) => {
    // Allow only digits and slash
    const formatted = input.replace(/[^\d/]/g, '');

    return formatted.substring(0, 7);
  };

  const handleInputChange = (e) => {
    const formattedInput = formatInput(e.target.value);
    setInputValue(formattedInput);

    if (formattedInput.length === 7) {
      if (/^(0[1-9]|1[0-2])\/(19[0-9]{2}|2[0-9]{3})$/.test(formattedInput)) {
        setIsError(false);
        onChange(formattedInput);
      } else {
        setIsError(true);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key !== 'Backspace' && inputValue.length === 2 && e.key !== '/') {
      // Insert a slash
      setInputValue(`${inputValue}/`);
    }
    if (e.key === '/' && inputValue.length !== 2) {
      // Prevent slash input
      e.preventDefault();
    }
  };

  return (
    <input
      className={isError ? 'month-year-input-error' : ''}
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder="MM/YYYY"
    />
  );
};

MonthYearInput.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
};

MonthYearInput.defaultProps = {
  onChange: EMPTY_FUNCTION,
  value: '',
};

export default MonthYearInput;

