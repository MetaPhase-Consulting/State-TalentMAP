import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { get } from 'lodash';
import DatePicker from 'react-datepicker';
import FA from 'react-fontawesome';
import TextareaAutosize from 'react-textarea-autosize';
import { getResult } from 'utilities';
import { EMPTY_FUNCTION, POSITION_DETAILS } from 'Constants/PropTypes';
import {
  NO_BUREAU, NO_GRADE, NO_ORG, NO_POSITION_NUMBER, NO_POSITION_TITLE, NO_POST,
  NO_SKILL,
} from 'Constants/SystemMessages';
import TabbedCard from 'Components/TabbedCard';
import PropTypes from 'prop-types';
import swal from '@sweetalert/with-react';
import { savebidAuditSelections } from 'actions/bidAudit';
import PositionExpandableContent from 'Components/PositionExpandableContent';
import { history } from '../../../store';

const BidAuditCard = ({ result, id, onEditModeSearch }) => {
  const dispatch = useDispatch();
  const pos = get(result, 'position') || result;
  const [description, setDescription] = useState(result.description || '');
  const [pbDate, setPbDate] = useState(getResult(pos, 'mc_date'));
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    onEditModeSearch(editMode, id);
  }, [editMode]);

  const onSubmitBidData = () => {
    const data = {
      id,
      description,
      pbDate,
    };
    dispatch(savebidAuditSelections(data));
  };

  const onInCategory = () => {
    history.push(`/profile/administrator/bidaudit/category/${id}`);
  };
  const onAtGrade = () => {
    history.push(`/profile/administrator/bidaudit/grade/${id}`);
  };

  const onCancelForm = () => {
    setPbDate(getResult(pos, 'mc_date'));
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
      { 'Cycle Name': result.cycle_name || NO_POSITION_NUMBER },
      { 'Status': result.cycle_status || NO_SKILL },
      { 'Category': result.cycle_category || NO_POSITION_TITLE },
    ],
    bodyPrimary: [
      { 'Audit Number': result.id || NO_BUREAU },
      { 'Description': result.description || NO_POST },
      { 'Posted': result.bid_audit_date_posted || NO_ORG },
      { 'Audit Date': result.bid_audit_date || NO_GRADE },
    ],
    /* eslint-enable quote-props */
    /* eslint-enable no-dupe-keys */
  };
  const bidAuditForm = {
    /* eslint-disable quote-props */
    staticBody: [
      { 'Audit Number': result.id || NO_BUREAU },
      { 'Audit Date': result.bid_audit_date || NO_GRADE },
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
                id={`mc-date-${id}`}
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
  result: POSITION_DETAILS.isRequired,
  id: PropTypes.number,
  onEditModeSearch: PropTypes.func,
};

BidAuditCard.defaultProps = {
  result: {},
  id: null,
  onEditModeSearch: EMPTY_FUNCTION,
  atGrades: [],
  inCategories: [],
};

export default BidAuditCard;
