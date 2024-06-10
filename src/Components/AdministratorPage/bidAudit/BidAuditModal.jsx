import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import FA from 'react-fontawesome';
import { bidAuditCreateAudit, bidAuditFetchCycles } from 'actions/bidAudit';
import { formatDate } from 'utilities';
import Spinner from 'Components/Spinner';
import Alert from 'Components/Alert';

const BidAuditModal = ({ setOpen }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(bidAuditFetchCycles());
  }, []);

  const cycleOptions = useSelector(state => state.bidAuditCycles);
  const cycleOptionsLoading = useSelector(state => state.bidAuditFetchCyclesLoading);
  const cycleOptionsErrored = useSelector(state => state.bidAuditFetchCyclesErrored);

  const [assignmentCycle, setAssignmentCycle] = useState('');
  const [auditDescription, setAuditDescription] = useState('');
  const [postByDate, setPostByDate] = useState('');

  const cancel = () => setOpen(false);

  const submit = () => {
    const formData = {
      id: assignmentCycle.id,
      auditNumber: assignmentCycle.audit_number,
      postByDate: formatDate(postByDate),
      auditDescription,
    };
    dispatch(bidAuditCreateAudit(formData, () => setOpen(false)));
  };

  const handleCycleSelection = (id) => {
    const cycle = cycleOptions.find(x => x.id === Number(id));
    setAssignmentCycle(cycle);
  };

  const getOverlay = () => {
    let overlay;
    if (cycleOptionsLoading) {
      overlay = <Spinner type="standard-center" size="small" />;
    } else if (cycleOptionsErrored) {
      overlay = <Alert type="error" title="Error loading cycles" messages={[{ body: 'Please close and try again.' }]} />;
    } else {
      return false;
    }
    return overlay;
  };

  return (
    <div className="modal-child bid-audit-modal-wrapper">
      <div className="usa-width-one-whole">
        <div className="ba-modal-title">
          Create New Audit Cycle
        </div>
        {getOverlay() || <>
          <div className="ba-form">
            <div className="ba-modal-div">
              <div>Audit Number:</div>
              <span className="bid-audit-modal-number">{assignmentCycle?.audit_number || '--'}</span>
            </div>
            <div className="ba-modal-div">
              <div>Assignment Cycle:</div>
              <select
                defaultValue=""
                value={assignmentCycle?.id}
                className="bid-audit-modal-input"
                onChange={(e) => handleCycleSelection(e.target.value)}
              >
                <option value="" disabled />
                {cycleOptions?.map(cycle => (
                  <option key={cycle.id} value={cycle.id}>
                    {cycle.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="ba-modal-div">
              <div>Positions Posted By:</div>
              <span className="date-picker-validation-container larger-date-picker">
                <FA name="fa-regular fa-calendar" className="fa fa-calendar" />
                <DatePicker
                  selected={postByDate}
                  onChange={(date) => setPostByDate(date)}
                  dateFormat="MM/dd/yyyy"
                />
                <FA name="times" className={`${postByDate ? '' : 'hide'} fa-close`} onClick={() => setPostByDate('')} />
              </span>
            </div>
            <div className="ba-modal-div">
              <div>Audit Description:</div>
              <div>
                <input
                  type="text"
                  maxLength="100"
                  autoComplete="off"
                  name="description"
                  className="bid-audit-modal-input"
                  onChange={(e) => setAuditDescription(e.target.value)}
                />
                <div className="bid-audit-modal-word-count">
                  {auditDescription?.length} / 100
                </div>
              </div>
            </div>
          </div>
          <div className="position-form--actions">
            <button type="cancel" onClick={cancel}>Cancel</button>
            <button type="submit" onClick={submit} disabled={!assignmentCycle || !auditDescription || !postByDate}>Submit</button>
          </div>
        </>}
      </div>
    </div>
  );
};

BidAuditModal.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

export default BidAuditModal;
