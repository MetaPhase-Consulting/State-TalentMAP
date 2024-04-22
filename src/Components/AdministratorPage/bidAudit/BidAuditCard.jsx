import { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import FA from 'react-fontawesome';
import TextareaAutosize from 'react-textarea-autosize';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';
import TabbedCard from 'Components/TabbedCard';
import PropTypes from 'prop-types';
import swal from '@sweetalert/with-react';
import PositionExpandableContent from 'Components/PositionExpandableContent';
import { history } from '../../../store';

const BidAuditCard = ({ data, onEditModeSearch }) => {
  const {
    audit_id,
    audit_desc,
    cycle_id,
    cycle_category,
    cycle_name,
    cycle_status,
    posted_by_date,
    audit_date,
  } = data;

  const [description, setDescription] = useState(audit_desc || '');
  const [pbDate, setPbDate] = useState(posted_by_date ? new Date(posted_by_date) : '');

  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    onEditModeSearch(editMode, audit_id);
  }, [editMode]);

  useEffect(() => {
    onEditModeSearch(editMode, audit_id);
  }, [editMode]);

  const onSubmitBidData = () => {
    swal.close();
  };

  const onInCategory = () => {
    history.push(`/profile/administrator/bidaudit/category/${cycle_id}/${audit_id}/`);
  };
  const onAtGrade = () => {
    history.push(`/profile/administrator/bidaudit/grade/${cycle_id}/${audit_id}/`);
  };

  const onCancelForm = () => {
    setPbDate(posted_by_date ? new Date(posted_by_date) : '');
    swal.close();
  };

  const datePickerRef = useRef(null);
  const openDatePicker = () => {
    datePickerRef.current.setOpen(true);
  };


  const bidAuditSections = {
    /* eslint-disable no-dupe-keys */
    /* eslint-disable quote-props */
    subheading: [
      { 'Cycle Name': cycle_name || 'None listed' },
      { 'Status': cycle_status || 'None listed' },
      { 'Category': cycle_category || 'None listed' },
    ],
    bodyPrimary: [
      { 'Audit Number': audit_id || 'None listed' },
      { 'Description': audit_desc || 'None listed' },
      { 'Posted': posted_by_date || 'None listed' },
      { 'Audit Date': audit_date || 'None listed' },
    ],
    /* eslint-enable quote-props */
    /* eslint-enable no-dupe-keys */
  };
  const bidAuditForm = {
    /* eslint-disable quote-props */
    staticBody: [
      { 'Audit Number': audit_id || 'None listed' },
      { 'Audit Date': audit_date || 'None listed' },
    ],
    inputBody: (
      <div className="position-form">
        <div className="position-form--label-input-container">
          <label htmlFor="description">Audit Description</label>
          <TextareaAutosize
            maxRows={2}
            minRows={1}
            maxLength="100"
            name="description"
            placeholder="Please provide a description of the bid season."
            defaultValue={description || ''}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="word-count">
          {description?.length} / 100
        </div>
        <div className="position-form--inputs">
          <div className="position-form--label-input-container">
            <label htmlFor="status">Posted By Date</label>
            <div className="date-wrapper-react larger-date-picker">
              <FA name="fa fa-calendar" onClick={() => openDatePicker()} />
              <FA name="times" className={`${pbDate ? '' : 'hide'}`} onClick={() => setPbDate(null)} />
              <DatePicker
                id={`mc-date-${audit_id}`}
                selected={pbDate}
                onChange={setPbDate}
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
                ref={datePickerRef}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="ba-flex-end">
            <button onClick={onInCategory}>View In Categories</button>
            <button onClick={onAtGrade}>View At Grades</button>
          </div>
        </div>
      </div>
    ),
    cancelText: 'Are you sure you want to discard all changes made to this position?',
    handleSubmit: () => onSubmitBidData(),
    handleCancel: () => onCancelForm(),
    handleEdit: {
      editMode,
      setEditMode,
    },
    /* eslint-enable quote-props */
  };

  return (
    <TabbedCard
      tabs={[{
        text: 'Bid Audit',
        value: 'Bid Audit',
        content: (
          <div className="position-content--container">
            <PositionExpandableContent
              sections={bidAuditSections}
              form={bidAuditForm}
              saveText="Save Audit Cycle"
            />
          </div>
        ),
      },
      ]}
    />
  );
};

BidAuditCard.propTypes = {
  data: PropTypes.shape({
    audit_id: PropTypes.number,
    audit_desc: PropTypes.string,
    cycle_id: PropTypes.number,
    cycle_category: PropTypes.string,
    cycle_category_code: PropTypes.string,
    cycle_name: PropTypes.string,
    cycle_status: PropTypes.string,
    cycle_status_code: PropTypes.string,
    posted_by_date: PropTypes.string,
    audit_date: PropTypes.string,
  }).isRequired,
  onEditModeSearch: PropTypes.func,
};

BidAuditCard.defaultProps = {
  onEditModeSearch: EMPTY_FUNCTION,
};

export default BidAuditCard;
