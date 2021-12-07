import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { checkFlag } from 'flags';
import FA from 'react-fontawesome';
import { BIDDER_OBJECT } from 'Constants/PropTypes'; // for dummy data purposes only
import InteractiveElement from '../../InteractiveElement';

const EmployeeAgendaSearchRow = ({ isCDO, result }) => {
  const userRole = isCDO ? 'cdo' : 'ao';
  const useCDOBidding = () => checkFlag('flags.cdo_bidding');

  // does Handshake Status need to be added below?
  return (
    <div className="usa-grid-full employee-agenda-stat-row">
      <div className="initials-circle-container">
        <div className="initials-circle">
          {result.initials}
        </div>
      </div>
      <div className="employee-agenda-row-name">
        <Link to="/profile/public/4">{result.bidder}</Link>
      </div>
      <div className="employee-agenda-row-data-container">
        <div className="employee-agenda-row-data-points">
          <div className="employee-agenda-row-data-point">
            <FA name="building-o" />
            <dt>Org:</dt>
            <dd>{result.currentPost} <FA className="org-fa-arrow" name="long-arrow-right" /> {result.futurePost}</dd>
          </div>
          <div className="employee-agenda-row-data-point">
            <FA name="clock-o" />
            <dt>TED:</dt>
            <dd>{result.ted}</dd>
          </div>
          <div className="employee-agenda-row-data-point">
            <FA name="user-o" />
            <dt>CDO:</dt>
            <dd>{result.cdo}</dd>
          </div>
          <div className="employee-agenda-row-data-point">
            <FA name="handshake-o" />
            <dt>Handshake Status:</dt>
            <dd>{result.hs_status}</dd>
          </div>
          <div className="employee-agenda-row-data-point">
            <FA className="fa-pencil" name="pencil-square" />
            <dt>Author:</dt>
            <dd>{result.author}</dd>
          </div>
          <div className="employee-agenda-row-data-point">
            <FA className="fa-calendar" name="calendar-o" />
            <dt>Panel Meeting Date:</dt>
            <dd>{result.panelDate}</dd>
          </div>
        </div>
        {
          useCDOBidding() &&
            <div className="button-container">
              <div className="view-agenda-item-container">
                <InteractiveElement className="view-agenda-item-button">
                  <Link className="view-agenda-item-text" to={`/profile/${userRole}/agendaitemhistory/perdet`}>View History</Link>
                </InteractiveElement>
              </div>
              <div className="create-ai-box-container">
                <InteractiveElement className="create-ai-box-button">
                Create Agenda Item
                </InteractiveElement>
              </div>
            </div>}
      </div>
    </div>
  );
};

EmployeeAgendaSearchRow.propTypes = {
  isCDO: PropTypes.bool,
  result: BIDDER_OBJECT.isRequired,
};

EmployeeAgendaSearchRow.defaultProps = {
  isCDO: false,
};

export default EmployeeAgendaSearchRow;
