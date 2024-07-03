import { useRef } from 'react';
import Linkify from 'react-linkify';
import TextareaAutosize from 'react-textarea-autosize';
import DatePicker from 'react-datepicker';
import FA from 'react-fontawesome';
import PropTypes from 'prop-types';
import { Row } from 'Components/Layout';
import DefinitionList from '../../../DefinitionList';
import InputActions from '../Common/InputActions';

const Header = (props) => {
  const { getCableValue, modCableValue } = props;

  const datePickerRef = useRef(null);
  const openDatePicker = () => {
    datePickerRef.current.setOpen(true);
  };

  /* eslint-disable quote-props */
  const definitions = {
    'Classification': getCableValue('CLASSIFICATION') || '---',
    'Clearance': getCableValue('CLEARANCE') || '---',
    'Special Handling': getCableValue('SPECIAL HANDLING') || '---',
    'Captions': getCableValue('CAPTIONS') || '---',
    'E.O': getCableValue('E.O.') || '---',
    'Tags': getCableValue('TAGS') || '---',
    'EOM': getCableValue('EOM') || '---',
    'Continuation': getCableValue('CONTINUATION') || '---',
  };
  /* eslint-enable quote-props */

  return (
    <div className="position-content position-form">
      <Row fluid className="position-content--section position-content--details">
        <DefinitionList
          itemProps={{ excludeColon: true }}
          items={definitions}
        />
      </Row>
      <div className="content-divider" />
      <div className="input-container">
        <InputActions />
        <div className="position-form--label-input-container">
          <label htmlFor="drafting-office">Drafting Office</label>
          <input
            id="drafting-office"
            defaultValue={getCableValue('DRAFTING OFFICE')}
            onChange={(e) => modCableValue('DRAFTING OFFICE', e.target.value)}
          />
        </div>
        <Row fluid className="mt-20">
          <div className="position-form--label-input-container">
            <label htmlFor="date">Date</label>
            <div className="date-wrapper-react larger-date-picker">
              <FA name="fa fa-calendar" onClick={() => openDatePicker()} />
              <FA name="times" className={`${getCableValue('DATE') ? '' : 'hide'}`} onClick={() => modCableValue('DATE', '')} />
              <DatePicker
                id="date"
                selected={(new Date(getCableValue('DATE'))) || ''}
                onChange={(e) => modCableValue('DATE', e.target.value)}
                dateFormat="MM/dd/yyyy"
                placeholderText={'MM/DD/YYY'}
                ref={datePickerRef}
              />
            </div>
          </div>
        </Row>
        <div className="position-form--label-input-container">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            value={getCableValue('TELEPHONE')}
            onChange={(e) => modCableValue('TELEPHONE', e.target.value)}
          />
        </div>
        <Row fluid className="position-content--description">
          <span className="definition-title">Subject</span>
          <Linkify properties={{ target: '_blank' }}>
            <TextareaAutosize
              maxRows={4}
              minRows={1}
              maxLength="500"
              name="subject"
              placeholder="No Description"
              value={getCableValue('SUBJECT')}
              onChange={(e) => modCableValue('SUBJECT', e.target.value)}
              draggable={false}
            />
          </Linkify>
          <div className="word-count">
            {getCableValue('SUBJECT')?.length} / 500
          </div>
        </Row>
      </div>
      <div className="position-form--actions">
        <button onClick={() => { }}>Cancel</button>
        <button onClick={() => { }}>Next</button>
      </div>
    </div>
  );
};

Header.propTypes = {
  getCableValue: PropTypes.func,
  modCableValue: PropTypes.func,
};

Header.defaultProps = {
  getCableValue: undefined,
  modCableValue: undefined,
};

export default Header;
