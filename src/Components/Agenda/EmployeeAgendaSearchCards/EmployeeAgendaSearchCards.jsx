import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { checkFlag } from 'flags';
import FA from 'react-fontawesome';
import { Tooltip } from 'react-tippy';
import { BIDDER_OBJECT } from 'Constants/PropTypes'; // for dummy data purposes only
import BoxShadow from '../../BoxShadow';
import { Handshake } from '../../Ribbon';
import InteractiveElement from '../../InteractiveElement';

const EmployeeAgendaSearchCards = ({ isCDO, results }) => {
  const showHandshakeIcon = results.hs_accepted;
  const userRole = isCDO ? 'cdo' : 'ao';
  const useCDOBidding = () => checkFlag('flags.cdo_bidding');

  return (
    <div className="employee-agenda-card-container">
      <BoxShadow className="usa-grid-full employee-agenda-card">
        <div className="employee-agenda-card-inner">
          <div className="employee-agenda-card-top">
            <div className="employee-ribbon-container">
              <div className="ribbon-container-condensed">
                {showHandshakeIcon &&
                  <Tooltip
                    title="Handshake"
                    arrow
                    offset={-60}
                  >
                    <Handshake showText={false} className="ribbon-condensed-card" />
                  </Tooltip>
                }
              </div>
            </div>
          </div>
          <div>
            <h3>
              {/* may want to disable link for prod, only show name? */}
              <Link to="/profile/public/4">{results.bidder}</Link>
            </h3>
          </div>
          <div className="employee-agenda-card-data-point-top">
            <div className="employee-card-data-point">
              <FA name="building-o" />
              <dt>ORG:</dt><dd>{results.currentPost} <FA className="org-fa-arrow" name="long-arrow-right" /> {results.futurePost}</dd>
            </div>
            <div className="employee-card-data-point">
              <FA name="clock-o" />
              <dt>TED:</dt><dd>{results.ted}</dd>
            </div>
            <div className="employee-card-data-point">
              <FA name="user-o" />
              <dt>CDO:</dt><dd>{results.cdo}</dd>
            </div>
          </div>
          <div className="employee-card-data-point">
            <FA name="pencil-square" />
            <dt>Author:</dt><dd className="author-name">{results.author}</dd>
          </div>
          <div className="employee-card-data-point">
            <FA name="calendar-o" />
            <dt>Panel Meeting Date:</dt><dd>{results.panelDate}</dd>
          </div>
          <div className="employee-card-data-point">
            <FA name="sticky-note-o" />
            <dt>Agenda Status:</dt><dd>{results.agendaStatus}</dd>
          </div>
        </div>
        <div className="employee-agenda-card-top-bottom">
          {useCDOBidding() &&
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
      </BoxShadow>
    </div>
  );
};

EmployeeAgendaSearchCards.propTypes = {
  isCDO: PropTypes.bool,
  results: BIDDER_OBJECT.isRequired,
};

EmployeeAgendaSearchCards.defaultProps = {
  isCDO: false,
  results: {},
};

export default EmployeeAgendaSearchCards;
