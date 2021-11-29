import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { checkFlag } from 'flags';
import FA from 'react-fontawesome';
import ProfileSectionTitle from '../../ProfileSectionTitle';
import BoxShadow from '../../BoxShadow';
import { Handshake } from '../../Ribbon';

const EmployeeAgendaSearch = ({ isCDO }) => {
  const userRole = isCDO ? 'cdo' : 'ao';
  const useCDOBidding = () => checkFlag('flags.cdo_bidding');

  return (
    <div className="usa-grid-full profile-content-inner-container">
      <ProfileSectionTitle title="Employee Agenda Search" icon="user-circle-o" />
      <h4>
        <Link to={`/profile/${userRole}/agendaitemhistory/perdet`}>View Employee History</Link>
      </h4>
      <BoxShadow className="usa-grid-full bidder-portfolio-stat-card">
        <div className="bidder-portfolio-stat-card-top">
          {/* need to create container for HS icon thats in results container top */}
          <Handshake showText={false} className="ribbon-primary" />
          <div className="stat-card-data-point">
            <Link to="/profile/public/4">Last, First MI</Link>
          </div>
          <div className="stat-card-data-point">
            <FA name="building-o" />
            <dt>ORG:</dt><dd>Pairs (EUR) <FA name="long-arrow-right" /> Djbouti (AF)</dd>
          </div>
          <div className="stat-card-data-point">
            <FA name="clock-o" />
            <dt>TED:</dt><dd>11/29/2021</dd>
          </div>
          <div className="stat-card-data-point">
            <FA name="user-o" />
            <dt>CDO:</dt><dd>Last, First MI CDO</dd>
          </div>
          <div className="stat-card-data-point">
            <FA name="pencil-square" />
            <dt>Author:</dt><dd>Last, First MI Author</dd>
          </div>
          <div className="stat-card-data-point">
            <FA name="calendar-o" />
            <dt>Panel Meeting Date:</dt><dd>12/25/2021</dd>
          </div>
          <div className="stat-card-data-point">
            <FA name="sticky-note-o" />
            <dt>Agenda Status:</dt><dd>Complete</dd>
          </div>
        </div>
        <div className="bidder-portfolio-stat-card-bottom">
          {useCDOBidding() &&
            <div className="button-container" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <div className="eas-button">
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
      </BoxShadow>
    </div>
  );
};

EmployeeAgendaSearch.propTypes = {
  isCDO: PropTypes.bool,
};

EmployeeAgendaSearch.defaultProps = {
  isCDO: false,
};

export default EmployeeAgendaSearch;
