import { useRef } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import FA from 'react-fontawesome';

const TMDatePicker = ({
  selected,
  onChange,
  value,
  selectsRange,
  showTimeSelect,
  showMonthDropdown,
  showYearDropdown,
  placeholderText,
  showIcon,
  isClearable,
  excludeDates,
  useStandardInputWidth,
  condensed,
}) => {
  const datePickerRef = useRef(null);
  const openDatePicker = () => {
    datePickerRef.current.setOpen(true);
  };

  let wrapperClasses = 'tm-datepicker';

  if (showIcon) {
    wrapperClasses = wrapperClasses.concat(' show-icon');
  }
  if (useStandardInputWidth) {
    wrapperClasses = wrapperClasses.concat(' standard-input-width');
  }
  if (condensed) {
    wrapperClasses = wrapperClasses.concat(' condensed');
  }


  return (
    <div className={wrapperClasses}>
      {showIcon &&
        <FA name="fa fa-calendar" onClick={() => openDatePicker()} />
      }
      <DatePicker
        selected={selected}
        onChange={onChange}
        selectsRange={selectsRange}
        showTimeSelect={showTimeSelect}
        showMonthDropdown={showMonthDropdown}
        showYearDropdown={showYearDropdown}
        startDate={selectsRange ? value[0] : null}
        endDate={selectsRange ? value[1] : null}
        isClearable={isClearable}
        dropdownMode="select"
        placeholderText={placeholderText}
        excludeDates={excludeDates}
        ref={datePickerRef}
      />
    </div>
  );
};

export default TMDatePicker;

TMDatePicker.propTypes = {
  value: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.instanceOf(Date),
  showMonthDropdown: PropTypes.bool,
  showYearDropdown: PropTypes.bool,
  placeholderText: PropTypes.string,
  selectsRange: PropTypes.bool,
  showIcon: PropTypes.bool,
  useStandardInputWidth: PropTypes.bool,
  condensed: PropTypes.bool,
  isClearable: PropTypes.bool,
  showTimeSelect: PropTypes.bool,
  excludeDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
};

TMDatePicker.defaultProps = {
  value: [null, null],
  selected: null,
  showMonthDropdown: false,
  showYearDropdown: false,
  placeholderText: 'Select Date',
  selectsRange: false,
  showIcon: false,
  useStandardInputWidth: false,
  condensed: false,
  isClearable: false,
  showTimeSelect: false,
  excludeDates: [],
};
