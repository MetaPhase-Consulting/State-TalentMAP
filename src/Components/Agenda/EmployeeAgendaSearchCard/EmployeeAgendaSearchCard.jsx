import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { checkFlag } from 'flags';
import FA from 'react-fontawesome';
import { Tooltip } from 'react-tippy';
import { Handshake } from 'Components/Ribbon';
import LinkButton from 'Components/LinkButton';
import { BIDDER_OBJECT } from 'Constants/PropTypes'; // for dummy data purposes only
import BoxShadow from '../../BoxShadow';

const EmployeeAgendaSearchCard = ({ isCDO, result }) => {
  const showHandshakeIcon = result.hs_accepted;
  const userRole = isCDO ? 'cdo' : 'ao';
  const useCDOBidding = () => checkFlag('flags.cdo_bidding');

  return (
    <BoxShadow className="employee-agenda-stat-card">
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
            <Link to="/profile/public/6">{result.bidder}</Link>
          </h3>
        </div>
        <div className="employee-agenda-card-data-point-top">
          <div className="employee-card-data-point">
            <FA name="building-o" />
            <dt>Org:</dt>
            <dd>
              {result.currentPost} <FA className="org-fa-arrow" name="long-arrow-right" /> {result.futurePost}
            </dd>
          </div>
          <div className="employee-card-data-point">
            <FA name="clock-o" />
            <dt>TED:</dt>
            <dd>{result.ted}</dd>
          </div>
          <div className="employee-card-data-point">
            <FA name="user-o" />
            <dt>CDO:</dt>
            <dd>{result.cdo}</dd>
          </div>
        </div>
        <div className="employee-card-data-point">
          <FA name="pencil-square" />
          <dt>Author:</dt>
          <dd>{result.author}</dd>
        </div>
        <div className="employee-card-data-point">
          <FA name="calendar-o" />
          <dt>Panel Meeting Date:</dt>
          <dd>{result.panelDate}</dd>
        </div>
        <div className="employee-card-data-point">
          <FA name="sticky-note-o" />
          <dt>Agenda Status:</dt>
          <dd>{result.agendaStatus}</dd>
        </div>
      </div>
      <div className="employee-agenda-card-bottom">
        {/* will need to add a flag for both buttons during integration */}
        <div className="button-container">
          <div className="view-agenda-item-container">
            <LinkButton className="view-agenda-item-button" toLink={`/profile/${userRole}/agendaitemhistory/perdet`}>View History</LinkButton>
          </div>
          {/* update the flag during integration */}
          {useCDOBidding() &&
            <div className="create-ai-box-container">
              <LinkButton className="create-ai-box-button" toLink="#">Create Agenda Item</LinkButton>
            </div>
          }
        </div>
      </div>
    </BoxShadow>
  );
};

EmployeeAgendaSearchCard.propTypes = {
  isCDO: PropTypes.bool,
  result: BIDDER_OBJECT.isRequired,
};

EmployeeAgendaSearchCard.defaultProps = {
  isCDO: false,
};

export default EmployeeAgendaSearchCard;
