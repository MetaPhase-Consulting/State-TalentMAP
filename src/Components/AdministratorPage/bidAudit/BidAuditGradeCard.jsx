import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import swal from '@sweetalert/with-react';
import { Row } from 'Components/Layout';
import PositionExpandableContent from 'Components/PositionExpandableContent';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';
import { NO_VALUE } from 'Constants/SystemMessages';

const BidAuditGradeCard = ({ data, onEditModeSearch, isOpen }) => {
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    onEditModeSearch(editMode, data?.id);
  }, [editMode]);

  useEffect(() => {
    setEditMode(isOpen);
  }, [isOpen]);

  const onSubmit = () => {
    swal.close();
  };
  const onCancelForm = () => {
    swal.close();
  };

  // =============== View Mode ===============

  const atGradesSections = {
    /* eslint-disable no-dupe-keys */
    /* eslint-disable quote-props */
    subheading: [
      { '': '' },
    ],
    bodyPrimary: [
      { 'Position Grade': data.position_grade_code },
      { 'Position Skill': (data.position_skill_code ? `${data.position_skill_code} - ${data.position_skill_desc}` : NO_VALUE) },
      { '': '' },
      { 'Employee Grade': data.employee_grade_code },
      { 'Employee Skill': (data.employee_skill_code ? `${data.employee_skill_code} - ${data.employee_skill_desc}` : NO_VALUE) },
      { 'Employee Tenure': (data.employee_tenure_code ? `${data.employee_tenure_code} - ${data.employee_tenure_desc}` : NO_VALUE) },
    ],
  };

  // =============== Edit Mode ===============
  const skillCode = [
    { code: 1, name: 'INFORMATION MANAGEMENT' },
    { code: 2, name: 'SYSTEM MANAGEMENT' },
    { code: 3, name: 'DATABASE MANAGEMENT' },
    { code: 4, name: 'PIT' },
    { code: 5, name: 'INFORMATION ADMIN' },
    { code: 6, name: 'BUREAU MANAGEMENT' },
  ];
  const gradeOptions = [
    { code: 1, name: '01' },
    { code: 2, name: '02' },
    { code: 3, name: '03' },
    { code: 4, name: '04' },
    { code: 5, name: '05' },
    { code: 6, name: '06' },
  ];
  const tenureCode = [
    { code: 1, name: 'INFORMATION MANAGEMENT' },
    { code: 2, name: 'SYSTEM MANAGEMENT' },
    { code: 3, name: 'DATABASE MANAGEMENT' },
    { code: 4, name: 'PIT' },
    { code: 5, name: 'INFORMATION ADMIN' },
    { code: 6, name: 'BUREAU MANAGEMENT' },
  ];
  const atGradesForm = {
    /* eslint-disable quote-props */
    staticBody: [],
    inputBody: (
      <div className="position-form bid-audit-form">
        <div className="bid-audit-options">
          <div className="filter-div">
            <div className="label">Position Grade:</div>
            <select>
              {gradeOptions.map(grade => (
                <option value={grade?.name} key={grade?.code}>{grade?.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-div">
            <div className="label">Position Skill Code - Description:</div>
            <select>
              {skillCode.map(grade => (
                <option value={grade?.name} key={grade?.code}>{grade.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="bid-audit-options">
          <div className="filter-div">
            <div className="label">Employee Grade:</div>
            <select>
              {gradeOptions.map(grade => (
                <option value={grade?.name} key={grade?.code}>{grade.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-div">
            <div className="label">Employee Skill Code - Description:</div>
            <select>
              {skillCode.map(grade => (
                <option value={grade?.name} key={grade?.code}>{grade.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-div">
            <div className="label">Tenure Code - Description:</div>
            <select>
              {tenureCode.map(grade => (
                <option value={grade?.name} key={grade?.code}>{grade.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    ),
    cancelText: 'Are you sure you want to discard all changes made to this position?',
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
          sections={atGradesSections}
          form={atGradesForm}
          saveText="Save In Category"
        />
      </div>
    </Row>
  );
};

BidAuditGradeCard.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    position_grade_code: PropTypes.string,
    position_skill_code: PropTypes.string,
    position_skill_desc: PropTypes.string,
    employee_grade_code: PropTypes.string,
    employee_skill_code: PropTypes.string,
    employee_skill_desc: PropTypes.string,
    employee_tenure_code: PropTypes.string,
    employee_tenure_desc: PropTypes.string,
  }).isRequired,
  isOpen: PropTypes.bool,
  onEditModeSearch: PropTypes.func,
};

BidAuditGradeCard.defaultProps = {
  isOpen: false,
  onEditModeSearch: EMPTY_FUNCTION,
};

export default BidAuditGradeCard;
