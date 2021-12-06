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

  const data = {
    agendaStatus: 'Complete',
    author: 'Last, First MI Author',
    bidder: 'Last, First MI',
    cdo: 'Last, First MI CDO',
    currentPost: 'Paris (EUR)',
    futurePost: 'Djbouti (AF)',
    panelDate: '12/25/2021',
    ted: '11/29/2021',
  };
  // does Handshake Status need to be added below?
  return (
    <div className="usa-grid-full bidder-portfolio-stat-row">
      <div className="stat-card-data-point stat-card-data-point--name employee-agenda-row-name">
        <Link to="/profile/public/4">{data.bidder}</Link>
      </div>
      <div>
        <div>
          <div className="employee-agenda-row-data-points">
            <div className="employee-agenda-row-data-point">
              <FA name="building-o" />
              <dt>ORG:</dt><dd>{data.currentPost} <FA className="org-fa-arrow" name="long-arrow-right" /> {data.futurePost}</dd>
            </div>
            <div className="employee-agenda-row-data-point">
              <FA name="clock-o" />
              <dt>TED:</dt><dd>{data.ted}</dd>
            </div>
            <div className="employee-agenda-row-data-point">
              <FA name="user-o" />
              <dt>CDO:</dt><dd>{data.cdo}</dd>
            </div>
            <div className="employee-agenda-row-data-point">
              <FA name="pencil-square" />
              <dt>Author:</dt><dd className="author-name">{data.author}</dd>
            </div>
            <div className="employee-agenda-row-data-point">
              <FA name="calendar-o" />
              <dt>Panel Meeting Date:</dt><dd>{data.panelDate}</dd>
            </div>
            <div className="employee-agenda-row-data-point">
              <FA name="sticky-note-o" />
              <dt>Agenda Status:</dt><dd>{data.agendaStatus}</dd>
            </div>
          </div>
        </div>
        {
          useCDOBidding() &&
            <div className="button-container" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
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
  results: {},
};

export default EmployeeAgendaSearchRow;
