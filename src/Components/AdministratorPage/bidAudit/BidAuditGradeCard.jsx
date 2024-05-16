import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import swal from '@sweetalert/with-react';
import TabbedCard from 'Components/TabbedCard';
import PositionExpandableContent from 'Components/PositionExpandableContent';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';

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
      { 'Position Skill Code': data.position_skill_code },
      { 'Position Skill Description': data.position_skill_desc },
      { '': '' },
      { 'Employee Grade': data.employee_grade_code },
      { 'Employee Skill Code': data.employee_skill_code },
      { 'Employee Skill Description': data.employee_skill_desc },
      { 'Employee Tenure Code': data.employee_tenure_code },
      { 'Employee Tenure Description': data.employee_tenure_desc },
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
    <TabbedCard
      tabs={
        [
          {
            value: 'At Grade',
            content: (
              <div className="position-content--container">
                <PositionExpandableContent
                  sections={atGradesSections}
                  form={atGradesForm}
                  saveText="Save In Category"
                />
              </div>
            ),
          },
        ]
      }
    />
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
  }),
  isOpen: PropTypes.bool,
  onEditModeSearch: PropTypes.func,
};

BidAuditGradeCard.defaultProps = {
  data: {},
  isOpen: false,
  onEditModeSearch: EMPTY_FUNCTION,
};

export default BidAuditGradeCard;
