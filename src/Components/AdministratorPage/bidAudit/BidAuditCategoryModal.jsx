import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bidAuditCreateCategory, bidAuditSecondFetchData } from 'actions/bidAudit';
// import Spinner from 'Components/Spinner';
// import Alert from 'Components/Alert';

const BidAuditCategoryModal = ({ match, setOpen, options }) => {
  const dispatch = useDispatch();

  const cycleId = match.params.cycleId;
  const auditNbr = match.params.auditId;

  // useEffect(() => {
  //   dispatch(bidAuditSecondFetchModalData(cycleId, auditNbr, 'category'));
  // }, []);

  // const categoryOptions = useSelector(state => state.bidAuditSecondFetchModalData);
  // const categoryOptionsLoading = useSelector(state => state.bidAuditSecondFetchModalDataLoading);
  // const categoryOptionsErrored = useSelector(state => state.bidAuditSecondFetchModalDataErrored);

  const [positionSkill, setPositionSkill] = useState('');
  const [employeeSkill, setEmployeeSkill] = useState('');

  const onInCategorySave = () => {
    dispatch(bidAuditCreateCategory(
      { positionSkill, employeeSkill, cycleId, auditNbr },
      () => setOpen(false),
      () => dispatch(bidAuditSecondFetchData(cycleId, auditNbr, 'category')),
    ));
  };

  // const getOverlay = () => {
  //   let overlay;
  //   if (categoryOptionsLoading) {
  //     overlay = <Spinner type="standard-center" size="small" />;
  //   } else if (categoryOptionsErrored) {
  //     overlay = <Alert type="error" title="Error loading position data" messages={[{ body: 'Please close and try again.' }]} />;
  //   } else {
  //     return false;
  //   }
  //   return overlay;
  // };

  return (
    <div className="modal-child bid-audit-modal-wrapper">
      <div className="usa-width-one-whole">
        <div className="ba-modal-title">
          Create New In Skill Category for Bid Counts
        </div>
        {/* {getOverlay() || <> */}
        <div className="ba-form">
          <div className="ba-modal-div">
            <div>Position Skill:</div>
            <select
              defaultValue=""
              className="bid-audit-modal-input"
              onChange={(e) => setPositionSkill(e.target.value)}
            >
              <option value="" disabled />
              {options?.position_skill_options?.map(option => (
                <option value={option?.code} key={option?.code}>{`(${option.code}) ${option.text}`}</option>
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
              <option value="" disabled />
              {options?.employee_skill_options?.map(option => (
                <option value={option?.code} key={option?.code}>{`(${option.code}) ${option.text}`}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="position-form--actions">
          <button type="cancel" onClick={() => setOpen(false)}>Cancel</button>
          <button type="submit" onClick={onInCategorySave} disabled={!positionSkill || !employeeSkill}>Submit</button>
        </div>
        {/* </>} */}
      </div>
    </div>
  );
};

BidAuditCategoryModal.propTypes = {
  setOpen: PropTypes.func.isRequired,
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      cycleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      auditId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }),
};

BidAuditCategoryModal.defaultProps = {
  match: {},
};

export default withRouter(BidAuditCategoryModal);
