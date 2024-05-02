import { useState } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import FA from 'react-fontawesome';
import { formatDate } from 'utilities';
import swal from '@sweetalert/with-react';

const BidAuditModal = ({ assignmentCycleOptions, onSubmit }) => {
  const [assignmentCycle, setAssignmentCycle] = useState('');
  const [auditDescription, setAuditDescription] = useState('');
  const [postByDate, setPostByDate] = useState('');

  const cancel = () => swal.close();

  const submit = () => {
    onSubmit({
      id: assignmentCycle.id,
      auditNumber: assignmentCycle.audit_number + 1,
      postByDate: formatDate(postByDate),
      auditDescription,
    });
  };

  const handleCycleSelection = (id) => {
    const cycle = assignmentCycleOptions.find(x => x.id === Number(id));
    setAssignmentCycle(cycle);
  };


  return (
    <div className="bid-audit-modal-wrapper">
      <div className="usa-width-one-whole">

        <div className="ba-modal-div">
          <span>Audit Number:</span>
          <span>{assignmentCycle?.audit_number + 1 || '--'}</span>
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
            {assignmentCycleOptions?.map(cycle => (
              <option key={cycle.id} value={cycle.id}>
                {cycle.name}
              </option>
            ))}
          </select>
        </div>

        <div className="ba-modal-div">
          <div>Posted By Date:</div>
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
          <input
            type="text"
            maxLength="100"
            autoComplete="off"
            name="description"
            className="bid-audit-modal-input"
            onChange={(e) => setAuditDescription(e.target.value)}
          />
        </div>

        <div className="bid-audit-modal-word-count">
          {auditDescription?.length} / 100
        </div>

        <div className="bid-audit-modal-buttons">
          <button onClick={submit} disabled={!assignmentCycle || !auditDescription || !postByDate} type="submit">
            Submit
          </button>
          <button onClick={cancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

BidAuditModal.propTypes = {
  assignmentCycleOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      audit_number: PropTypes.number,
    }),
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default BidAuditModal;
