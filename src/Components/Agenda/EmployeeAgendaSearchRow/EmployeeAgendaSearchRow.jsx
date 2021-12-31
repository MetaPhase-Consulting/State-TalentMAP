import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { checkFlag } from 'flags';
import FA from 'react-fontawesome';
import LinkButton from 'Components/LinkButton';
import { get } from 'lodash';

const EmployeeAgendaSearchRow = ({ isCDO, result }) => {
  // will need to update during integration
  const { person, currentAssignment } = result;
  const agendaStatus = get(result, 'agendaStatus') || 'None listed';
  const author = get(result, 'author') || 'None listed';
  const bidder = get(person, 'fullName') || 'None listed';
  const cdo = get(result, 'cdo') || 'None listed';
  const currentPost = get(currentAssignment, 'orgDescription') || 'None listed';
  const futurePost = get(result, 'futurePost') || 'None listed';
  const initials = get(person, 'initials') || '';
  const panelDate = get(result, 'panelDate') || 'None listed';
  const ted = get(currentAssignment, 'TED') || 'None listed';
  const userRole = isCDO ? 'cdo' : 'ao';
  const useCDOBidding = () => checkFlag('flags.cdo_bidding');

  return (
    <div className="usa-grid-full employee-agenda-stat-row">
      <div className="initials-circle-container">
        <div className="initials-circle">
          {initials}
        </div>
      </div>
      <div className="employee-agenda-row-name">
        <Link to="/profile/public/6">{bidder}</Link>
      </div>
      <div className="employee-agenda-row-data-container">
        <div className="employee-agenda-row-data-points">
          <div className="employee-agenda-row-data-point">
            <FA name="building-o" />
            <dt>Org:</dt>
            <dd>
              {currentPost}
              <FA className="org-fa-arrow" name="long-arrow-right" />
              {futurePost}</dd>
          </div>
          <div className="employee-agenda-row-data-point">
            <FA name="clock-o" />
            <dt>TED:</dt>
            <dd>{ted}</dd>
          </div>
          <div className="employee-agenda-row-data-point">
            <FA name="user-o" />
            <dt>CDO:</dt>
            <dd>{cdo}</dd>
          </div>
          <div className="employee-agenda-row-data-point">
            <FA name="pencil-square" />
            <dt>Author:</dt>
            <dd>{author}</dd>
          </div>
          <div className="employee-agenda-row-data-point">
            <FA name="calendar-o" />
            <dt>Panel Meeting Date:</dt>
            <dd>{panelDate}</dd>
          </div>
          <div className="employee-agenda-row-data-point">
            <FA name="sticky-note-o" />
            <dt>Agenda Status:</dt>
            <dd>{agendaStatus}</dd>
          </div>
        </div>
        {
          useCDOBidding() &&
            <div className="button-container">
              <div className="view-agenda-item-container">
                <LinkButton className="view-agenda-item-button" toLink={`/profile/${userRole}/agendaitemhistory/perdet`}>View History</LinkButton>
              </div>
              <div className="create-ai-box-container">
                <LinkButton className="create-ai-box-button" toLink="#">Create Agenda Item</LinkButton>
              </div>
            </div>}
      </div>
    </div>
  );
};

EmployeeAgendaSearchRow.propTypes = {
  isCDO: PropTypes.bool,
  result: PropTypes.arrayOf(PropTypes.shape({})),
};

EmployeeAgendaSearchRow.defaultProps = {
  isCDO: false,
  result: [],
};

export default EmployeeAgendaSearchRow;
