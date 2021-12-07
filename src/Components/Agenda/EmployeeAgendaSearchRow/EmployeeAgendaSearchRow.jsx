/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { checkFlag } from 'flags';
import FA from 'react-fontawesome';
import { BIDDER_OBJECT } from 'Constants/PropTypes'; // for dummy data purposes only
import InteractiveElement from '../../InteractiveElement';

const EmployeeAgendaSearchRow = ({ isCDO, results }) => {
  const userRole = isCDO ? 'cdo' : 'ao';
  const useCDOBidding = () => checkFlag('flags.cdo_bidding');

  // does Handshake Status need to be added below?
  return (
    <div className="usa-grid-full employee-agenda-stat-row">
      <div className="initials-circle-container">
        <div className="initials-circle">
          {results.initials}
        </div>
      </div>
      <div className="employee-row-data-point employee-agenda-row-name">
        <Link className="row-name-text" to="/profile/public/4">{results.bidder}</Link>
      </div>
      <div className="employee-agenda-row-data-container">
        <div className="employee-agenda-row-data-points">
          <div className="employee-agenda-row-data-point">
            <FA name="building-o" />
            <dt>ORG:</dt>
            <dd>{results.currentPost} <FA className="org-fa-arrow" name="long-arrow-right" /> {results.futurePost}</dd>
          </div>
          <div className="employee-agenda-row-data-point">
            <FA name="clock-o" />
            <dt>TED:</dt>
            <dd>{results.ted}</dd>
          </div>
          <div className="employee-agenda-row-data-point">
            <FA name="user-o" />
            <dt>CDO:</dt>
            <dd>{results.cdo}</dd>
          </div>
          <div className="employee-agenda-row-data-point">
            <FA name="handshake-o" />
            <dt>Handshake Status:</dt>
            <dd>{results.hs_status}</dd>
          </div>
          <div className="employee-agenda-row-data-point">
            <FA className="fa-calendar" name="calendar-o" />
            <dt>Panel Meeting Date:</dt>
            <dd>{results.panelDate}</dd>
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
              <div className="create-pai-box-container">
                <InteractiveElement className="create-pai-box-button">
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
  results: BIDDER_OBJECT.isRequired,
};

EmployeeAgendaSearchRow.defaultProps = {
  isCDO: false,
};

export default EmployeeAgendaSearchRow;
