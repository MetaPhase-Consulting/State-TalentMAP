import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Row } from 'Components/Layout';
import PositionExpandableContent from 'Components/PositionExpandableContent';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';
import { NO_VALUE } from 'Constants/SystemMessages';
import { bidAuditUpdateAuditGradeOrCategory } from 'actions/bidAudit';

const BidAuditGradeCard = ({ data, onEditModeSearch, isOpen, options, refetchFunction, cycleId, auditNbr }) => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [posSkillCode, setPosSkillCode] = useState(data?.position_skill_code);
  const [posGradeCode, setPosGradeCode] = useState(data?.position_grade_code);
  const [empSkillCode, setEmpSkillCode] = useState(data?.employee_skill_code);
  const [empGradeCode, setEmpGradeCode] = useState(data?.employee_grade_code);
  const [empTenCode, setEmpTenCode] = useState(data?.employee_tenure_code);

  useEffect(() => {
    onEditModeSearch(editMode, data?.id);
    if (!editMode) {
      setPosSkillCode(data?.position_skill_code);
      setPosGradeCode(data?.position_grade_code);
      setEmpSkillCode(data?.employee_skill_code);
      setEmpGradeCode(data?.employee_grade_code);
      setEmpTenCode(data?.employee_tenure_code);
    }
  }, [editMode]);

  useEffect(() => {
    setEditMode(isOpen);
  }, [isOpen]);

  const onSubmit = () => {
    dispatch(bidAuditUpdateAuditGradeOrCategory({
      auditGradeId: data.id,
      cycleId,
      auditNbr,
      posSkillCode,
      posGradeCode,
      empSkillCode,
      empGradeCode,
      empTenCode,
    },
    'grade',
    () => refetchFunction(),
    ));
  };

  const onCancelForm = () => {
    setPosSkillCode(data?.position_skill_code);
    setPosGradeCode(data?.position_grade_code);
    setEmpSkillCode(data?.employee_skill_code);
    setEmpGradeCode(data?.employee_grade_code);
    setEmpTenCode(data?.employee_tenure_code);
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

  const atGradesForm = {
    /* eslint-disable quote-props */
    staticBody: [],
    inputBody: (
      <div className="position-form bid-audit-form">
        <div className="bid-audit-options">
          <div className="filter-div">
            <div className="label">Position Grade:</div>
            <select
              value={posGradeCode}
              onChange={(e) => setPosGradeCode(e.target.value)}
            >
              {options?.position_grade_options?.map(grade => (
                <option value={grade?.code} key={grade?.code}>{grade?.code}</option>
              ))}
            </select>
          </div>
          <div className="filter-div">
            <div className="label">Position Skill Code - Description:</div>
            <select
              value={posSkillCode}
              onChange={(e) => setPosSkillCode(e.target.value)}
            >
              {posSkillCode
                  && <option value={data?.employee_skill_code}>{`(${data?.employee_skill_code}) ${data?.employee_skill_desc}`}</option>
              }
              <option value="" />
              {options?.position_skill_options?.map(option => (
                <option value={option?.code} key={option?.code}>{`(${option.code}) ${option.text}`}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="bid-audit-options">
          <div className="filter-div">
            <div className="label">Employee Grade:</div>
            <select
              value={empGradeCode}
              onChange={(e) => setEmpGradeCode(e.target.value)}
            >
              {options?.employee_grade_options?.map(grade => (
                <option value={grade?.code} key={grade?.code}>{grade.code}</option>
              ))}
            </select>
          </div>
          <div className="filter-div">
            <div className="label">Employee Skill Code - Description:</div>
            <select
              value={empSkillCode}
              onChange={(e) => setEmpSkillCode(e.target.value)}
            >
              {empSkillCode
                  && <option value={data?.employee_skill_code}>{`(${data?.employee_skill_code}) ${data?.employee_skill_desc}`}</option>
              }
              <option value="" />
              {options?.employee_skill_options?.map(option => (
                <option value={option?.code} key={option?.code}>{`(${option.code}) ${option.text}`}</option>
              ))}
            </select>
          </div>
          <div className="filter-div">
            <div className="label">Tenure Code - Description:</div>
            <select
              value={empTenCode}
              onChange={(e) => setEmpTenCode(e.target.value)}
            >
              {empTenCode
                  && <option value={data?.employee_tenure_code}>{`(${data?.employee_tenure_code}) ${data?.employee_tenure_desc}`}</option>
              }
              <option value="" />
              {options?.employee_tenure_options?.map(option => (
                <option value={option?.code} key={option?.code}>{`(${option?.code}) ${option?.text}`}</option>
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
          saveText="Save At Grade"
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
  options: PropTypes.shape({
    position_skill_options: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string,
      text: PropTypes.string,
    })),
    position_grade_options: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string,
      text: PropTypes.string,
    })),
    employee_skill_options: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string,
      text: PropTypes.string,
    })),
    employee_grade_options: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string,
      text: PropTypes.string,
    })),
    employee_tenure_options: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.string,
      text: PropTypes.string,
    })),
  }).isRequired,
  isOpen: PropTypes.bool,
  onEditModeSearch: PropTypes.func,
  cycleId: PropTypes.number.isRequired,
  auditNbr: PropTypes.number.isRequired,
  refetchFunction: PropTypes.func.isRequired,
  onEditModeSearch: PropTypes.func,
};

BidAuditGradeCard.defaultProps = {
  isOpen: false,
  onEditModeSearch: EMPTY_FUNCTION,
};

export default BidAuditGradeCard;
