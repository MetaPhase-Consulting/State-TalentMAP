import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bidAuditCreateGrade, bidAuditSecondFetchData } from 'actions/bidAudit';

const BidAuditGradeModal = ({ match, setOpen, options }) => {
  const dispatch = useDispatch();

  const cycleId = match.params.cycleId;
  const auditNbr = match.params.auditId;

  const [positionGrade, setPositionGrade] = useState('');
  const [positionSkill, setPositionSkill] = useState('');
  const [employeeGrade, setEmployeeGrade] = useState('');
  const [employeeSkill, setEmployeeSkill] = useState('');
  const [employeeTenure, setEmployeeTenure] = useState('');


  const onAtGradeSave = () => {
    dispatch(bidAuditCreateGrade(
      {
        cycleId,
        auditNbr,
        positionGrade,
        positionSkill,
        employeeGrade,
        employeeSkill,
        employeeTenure,
      },
      () => setOpen(false),
      () => dispatch(bidAuditSecondFetchData(cycleId, auditNbr, 'grade')),
    ));
  };

  return (
    <div className="modal-child bid-audit-modal-wrapper">
      <div className="usa-width-one-whole">
        <div className="ba-modal-title">
          Create New At Grade for Bid Counts
        </div>
        <div className="ba-form">
          <div className="ba-modal-div">
            <div>Position Grade:</div>
            <select
              defaultValue=""
              className="bid-audit-modal-input"
              onChange={(e) => setPositionGrade(e.target.value)}
            >
              <option value="" disabled />
              {options?.position_grade_options?.map(grade => (
                <option value={grade?.code} key={grade?.code}>{grade?.code}</option>
              ))}
            </select>
          </div>
          <div className="ba-modal-div">
            <div>Position Skill:</div>
            <select
              defaultValue=""
              className="bid-audit-modal-input"
              onChange={(e) => setPositionSkill(e.target.value)}
            >
              <option value="" />
              {options?.position_skill_options?.map(skill => (
                <option value={skill?.code} key={skill?.code}>{`(${skill.code}) ${skill.text}`}</option>
              ))}
            </select>
          </div>
          <div className="ba-modal-div">
            <div>Employee Grade:</div>
            <select
              defaultValue=""
              className="bid-audit-modal-input"
              onChange={(e) => setEmployeeGrade(e.target.value)}
            >
              <option value="" disabled />
              {options?.employee_grade_options?.map(grade => (
                <option value={grade?.code} key={grade?.code}>{grade.code}</option>
              ))}
            </select>
          </div>
          <div className="ba-modal-div">
            <div>Employee Skill:</div>
            <select
              defaultValue=""
              className="bid-audit-modal-input"
              onChange={(e) => setEmployeeSkill(e.target.value)}
            >
              <option value="" />
              {options?.employee_skill_options?.map(skill => (
                <option value={skill?.code} key={skill?.code}>{`(${skill.code}) ${skill.text}`}</option>
              ))}
            </select>
          </div>
          <div className="ba-modal-div">
            <div>Employee Tenure:</div>
            <select
              defaultValue=""
              className="bid-audit-modal-input"
              onChange={(e) => setEmployeeTenure(e.target.value)}
            >
              <option value="" />
              {options?.employee_tenure_options?.map(tenure => (
                <option value={tenure?.code} key={tenure?.code}>{`(${tenure.code}) ${tenure.text}`}</option>
              ))}
            </select>
          </div>
          <div className="position-form--actions">
            <button onClick={() => setOpen(false)}>Cancel</button>
            <button onClick={onAtGradeSave} disabled={!positionGrade || !employeeGrade}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

BidAuditGradeModal.propTypes = {
  setOpen: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      cycleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      auditId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }),
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
};

BidAuditGradeModal.defaultProps = {
  match: {},
};

export default withRouter(BidAuditGradeModal);
