import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {
  bidAuditCreateGrade,
  bidAuditSecondFetchData,
  bidAuditSecondFetchModalData,
} from 'actions/bidAudit';
import Spinner from 'Components/Spinner';
import Alert from 'Components/Alert';

const BidAuditGradeModal = ({ match, setOpen }) => {
  const dispatch = useDispatch();

  const cycleId = match.params.cycleId;
  const auditNbr = match.params.auditId;

  useEffect(() => {
    dispatch(bidAuditSecondFetchModalData(cycleId, auditNbr, 'grade'));
  }, []);

  const secondFetchOptions = useSelector(state => state.bidAuditSecondFetchModalData);
  const secondFetchOptionsLoading = useSelector(state => state.bidAuditSecondFetchModalDataLoading);
  const secondFetchOptionsErrored = useSelector(state => state.bidAuditSecondFetchModalDataErrored);

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

  const getOverlay = () => {
    let overlay;
    if (secondFetchOptionsLoading) {
      overlay = <Spinner type="standard-center" size="small" />;
    } else if (secondFetchOptionsErrored) {
      overlay = <Alert type="error" title="Error loading position data" messages={[{ body: 'Please close and try again.' }]} />;
    } else {
      return false;
    }
    return overlay;
  };

  return (
    <div className="modal-child bid-audit-modal-wrapper">
      <div className="usa-width-one-whole">
        <div className="ba-modal-title">
          Create New At Grade for Bid Counts
        </div>

        {getOverlay() || <>
          <div className="ba-form">
            <div className="ba-modal-div">
              <div>Position Grade:</div>
              <select
                defaultValue=""
                className="bid-audit-modal-input"
                onChange={(e) => setPositionGrade(e.target.value)}
              >
                <option value="" disabled />
                {secondFetchOptions?.grade_options?.map(grade => (
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
                {secondFetchOptions?.skill_options?.map(skill => (
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
                {secondFetchOptions?.grade_options?.map(grade => (
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
                {secondFetchOptions?.skill_options?.map(skill => (
                  <option value={skill?.code} key={skill?.code}>{`(${skill.code}) ${skill.text}`}</option>
                ))}
              </select>
            </div>
            <div className="ba-modal-div">
              <div>Tenure:</div>
              <select
                defaultValue=""
                className="bid-audit-modal-input"
                onChange={(e) => setEmployeeTenure(e.target.value)}
              >
                <option value="" />
                {secondFetchOptions?.tenure_options?.map(tenure => (
                  <option value={tenure?.code} key={tenure?.code}>{`(${tenure.code}) ${tenure.text}`}</option>
                ))}
              </select>
            </div>
            <div className="position-form--actions">
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button onClick={onAtGradeSave} disabled={!positionGrade || !employeeGrade}>Submit</button>
            </div>
          </div>
        </>}

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
};

BidAuditGradeModal.defaultProps = {
  match: {},
};

export default withRouter(BidAuditGradeModal);
