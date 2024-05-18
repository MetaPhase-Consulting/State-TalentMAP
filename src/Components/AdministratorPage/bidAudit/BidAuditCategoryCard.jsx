import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import swal from '@sweetalert/with-react';
import { Row } from 'Components/Layout';
import PositionExpandableContent from 'Components/PositionExpandableContent';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';
import { NO_VALUE } from 'Constants/SystemMessages';

const BidAuditCategoryCard = ({ data, onEditModeSearch, isOpen }) => {
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
  const mockData = [
    { code: 1, name: 'INFORMATION MANAGEMENT' },
    { code: 2, name: 'SYSTEM MANAGEMENT' },
    { code: 3, name: 'DATABASE MANAGEMENT' },
    { code: 4, name: 'PIT' },
    { code: 5, name: 'INFORMATION ADMIN' },
    { code: 6, name: 'BUREAU MANAGEMENT' },
  ];

  const inCategoriesForm = {
    /* eslint-disable quote-props */
    staticBody: [],
    inputBody: (
      <div className="position-form bid-audit-form">
        <div className="bid-audit-options">
          <div className="filter-div">
            <div className="label">Position Skill Code - Description:</div>
            <select>
              {mockData.map(grade => (
                <option value={grade?.name} key={grade?.code}>{grade.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-div">
            <div className="label">Employee Skill Code - Description:</div>
            <select>
              {mockData.map(grade => (
                <option value={grade.code} key={grade?.code}>{grade.name}</option>
              ))}
            </select>
          </div>
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
};

BidAuditCategoryCard.defaultProps = {
  isOpen: false,
  onEditModeSearch: EMPTY_FUNCTION,
};

export default BidAuditCategoryCard;
