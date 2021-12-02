import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { checkFlag } from 'flags';
import FA from 'react-fontawesome';

const EmployeeAgendaSearchRow = ({ isCDO }) => {
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
  return (
    <div className="usa-grid-full bidder-portfolio-stat-row">
      <div className="stat-card-data-point stat-card-data-point--name">
        <Link to="/profile/public/4">{data.bidder}</Link>
      </div>
      <div>
        <div>
          <div className="stat-card-data-point">
            <FA name="building-o" />
            <dt>ORG:</dt><dd>{data.currentPost} <FA className="org-fa-arrow" name="long-arrow-right" /> {data.futurePost}</dd>
          </div>
          <div className="stat-card-data-point">
            <FA name="clock-o" />
            <dt>TED:</dt><dd>{data.ted}</dd>
          </div>
          <div className="stat-card-data-point">
            <FA name="user-o" />
            <dt>CDO:</dt><dd>{data.cdo}</dd>
          </div>
          <div className="stat-card-data-point">
            <FA name="pencil-square" />
            <dt>Author:</dt><dd className="author-name">{data.author}</dd>
          </div>
          <div className="stat-card-data-point">
            <FA name="calendar-o" />
            <dt>Panel Meeting Date:</dt><dd>{data.panelDate}</dd>
          </div>
          <div className="stat-card-data-point">
            <FA name="sticky-note-o" />
            <dt>Agenda Status:</dt><dd>{data.agendaStatus}</dd>
          </div>
        </div>
        {
          useCDOBidding() &&
            <div className="button-container" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <div className="eas-button">
                {/* search results add to favorites/compare buttons for styling */}
                <span>
                  <Link to={`/profile/${userRole}/agendaitemhistory/perdet`}>View History</Link>
                </span>
              </div>
              <div className="employee-agenda-search-button">
                {/* styling may change since this will be a component */}
                    Create Agenda Item
              </div>
            </div>}
      </div>
    </div>
  );
};

EmployeeAgendaSearchRow.propTypes = {
  isCDO: PropTypes.bool,
};

EmployeeAgendaSearchRow.defaultProps = {
  isCDO: false,
};

export default EmployeeAgendaSearchRow;
