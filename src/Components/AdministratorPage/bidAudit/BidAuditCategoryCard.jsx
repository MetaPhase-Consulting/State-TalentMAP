import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Row } from 'Components/Layout';
import PositionExpandableContent from 'Components/PositionExpandableContent';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';
import { NO_VALUE } from 'Constants/SystemMessages';
import swal from '@sweetalert/with-react';
import { bidAuditDeleteAuditGradeOrCategory, bidAuditUpdateAuditGradeOrCategory } from 'actions/bidAudit';

const BidAuditCategoryCard = ({ data, onEditModeSearch, isOpen, options, refetchFunction, cycleId, auditNbr }) => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [posCode, setPosCode] = useState(data?.position_skill_code);
  const [empCode, setEmpCode] = useState(data?.employee_skill_code);

  useEffect(() => {
    onEditModeSearch(editMode, data?.id);
    setPosCode(data?.position_skill_code);
    setEmpCode(data?.employee_skill_code);
  }, [editMode]);

  useEffect(() => {
    setEditMode(isOpen);
  }, [isOpen]);

  const onSubmit = () => {
    dispatch(bidAuditUpdateAuditGradeOrCategory({
      auditCategoryId: data.id,
      cycleId,
      auditNbr,
      posCode,
      empCode,
    },
    'category',
    () => refetchFunction(),
    ));
  };

  const onDeleteInCategory = () => {
    swal.close();
    dispatch(bidAuditDeleteAuditGradeOrCategory(
      {
        auditCategoryId: data.id,
        cycleId,
        auditNbr,
      },
      'category',
      () => refetchFunction(),
    ));
  };

  const onDelete = () => {
    swal({
      title: 'Confirm Delete',
      button: false,
      closeOnEsc: true,
      content: (
        <div className="simple-action-modal">
          <div className="help-text">
            <span>{'Are you sure you want to delete this In-Category relationship?'}</span>
          </div>
          <div className="modal-controls">
            <button onClick={onDeleteInCategory}>Yes</button>
            <button className="usa-button-secondary" onClick={() => swal.close()}>No</button>
          </div>
        </div>
      ),
    });
  };

  const onCancelForm = () => {
    setPosCode(data?.position_skill_code);
    setEmpCode(data?.employee_skill_code);
  };

  // =============== View Mode ===============

  const inCategoriesSections = {
    /* eslint-disable no-dupe-keys */
    /* eslint-disable quote-props */
    subheading: [
      { '': '' },
    ],
    bodyPrimary: [
      { 'Position Skill': (data.position_skill_code ? `${data.position_skill_code} - ${data.position_skill_desc}` : NO_VALUE) },
      { '': '' },
      { '': '' },
      { 'Employee Skill': (data.employee_skill_code ? `${data.employee_skill_code} - ${data.employee_skill_desc}` : NO_VALUE) },
    ],
  };

  // =============== Edit Mode ===============

  const inCategoriesForm = {
    /* eslint-disable quote-props */
    staticBody: [],
    inputBody: (
      <div className="position-form bid-audit-form">
        <div className="bid-audit-options">
          <div className="filter-div">
            <div className="label">Position Skill:</div>
            <select
              value={posCode}
              onChange={(e) => setPosCode(e.target.value)}
            >
              <option value={data?.position_skill_code}>{`(${data?.position_skill_code}) ${data?.position_skill_desc}`}</option>
              {options?.position_skill_options?.map(option => (
                <option value={option?.code} key={option?.code}>{`(${option.code}) ${option.text}`}</option>
              ))}
            </select>
          </div>
          <div className="filter-div">
            <div className="label">Employee Skill:</div>
            <select
              value={empCode}
              onChange={(e) => setEmpCode(e.target.value)}
            >
              <option value={data?.employee_skill_code}>{`(${data?.employee_skill_code}) ${data?.employee_skill_desc}`}</option>
              {options?.employee_skill_options?.map(option => (
                <option value={option?.code} key={option?.code}>{`(${option.code}) ${option.text}`}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="ba-delete-button-wrapper">
          <button onClick={onDelete} className="ba-delete-button">Delete</button>
        </div>
      </div>
    ),
    cancelText: 'Are you sure you want to discard all changes made to this card?',
    handleSubmit: () => onSubmit(),
    handleCancel: () => onCancelForm(),
    handleEdit: {
      editMode,
      setEditMode,
    },
    /* eslint-enable quote-props */
  };

  return (
    <Row fluid className="ba-card">
      <div className="position-content--container">
        <PositionExpandableContent
          sections={inCategoriesSections}
          form={inCategoriesForm}
          saveText="Save In Category"
          truncate={false}
        />
      </div>
    </Row>
  );
};

BidAuditCategoryCard.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    position_skill_code: PropTypes.string,
    position_skill_desc: PropTypes.string,
    employee_skill_code: PropTypes.string,
    employee_skill_desc: PropTypes.string,
  }).isRequired,
  isOpen: PropTypes.bool,
  onEditModeSearch: PropTypes.func,
  options: PropTypes.shape({
    position_skill_options: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string,
      text: PropTypes.string,
    })),
    employee_skill_options: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string,
      text: PropTypes.string,
    })),
  }).isRequired,
  cycleId: PropTypes.number.isRequired,
  auditNbr: PropTypes.number.isRequired,
  refetchFunction: PropTypes.func.isRequired,
};

BidAuditCategoryCard.defaultProps = {
  isOpen: false,
  onEditModeSearch: EMPTY_FUNCTION,
};

export default BidAuditCategoryCard;
