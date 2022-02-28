import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FA from 'react-fontawesome';
import LinkButton from 'Components/LinkButton';
import { get } from 'lodash';
import { formatDate } from 'utilities';
import { FALLBACK } from '../EmployeeAgendaSearchCard/EmployeeAgendaSearchCard';

const EmployeeAgendaSearchRow = ({ isCDO, result }) => {
  // will need to update during integration
  const { person, currentAssignment, hsAssignment, agenda } = result;
  const agendaStatus = get(agenda, 'status') || FALLBACK;
  // const author = get(result, 'author') || 'Coming soon';
  const bidder = get(person, 'fullName') || FALLBACK;
  const cdo = get(person, 'cdo.name') || FALLBACK;
  const currentPost = get(currentAssignment, 'orgDescription') || FALLBACK;
  const futurePost = get(hsAssignment, 'orgDescription') || FALLBACK;
  const initials = get(person, 'initials') || '';
  const panelDate = get(agenda, 'panelDate') ? formatDate(agenda.panelDate) : FALLBACK;
  // const showHandshakeIcon = get(result, 'hs_accepted') || false;
  const ted = get(currentAssignment, 'TED') ? formatDate(currentAssignment.TED) : FALLBACK;
  const perdet = get(person, 'perdet', '');
  const userRole = isCDO ? 'cdo' : 'ao';
  const employeeID = get(person, 'employeeID', '') || FALLBACK;

  return (
    <div className="usa-grid-full employee-agenda-stat-row">
      <div className="initials-circle-container">
        <div className="initials-circle">
          {initials}
        </div>
      </div>
      <div className="employee-agenda-row-name">
        {
          isCDO ?
            <Link to={`/profile/public/${perdet}`}>{bidder} ({employeeID})</Link> :
            <div className="row-name">{bidder} ({employeeID})</div>
        }
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
          {/*
            // TODO - do we want to include and/or filter by Author?
            <div className="employee-agenda-row-data-point">
            <FA name="pencil-square" />
            <dt>Author:</dt>
            <dd>{author}</dd>
          </div>
          */}
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
        <div className="button-container">
          <div className="view-agenda-item-container">
            <LinkButton className="view-agenda-item-button" toLink={`/profile/${userRole}/agendaitemhistory/${perdet}`}>View History</LinkButton>
          </div>
          <div className="create-ai-box-container">
            <LinkButton className="create-ai-box-button" toLink={`/profile/${userRole}/createagendaitem/${perdet}`}>Create Agenda Item</LinkButton>
          </div>
        </div>

      </div>
    </div>
  );
};

EmployeeAgendaSearchRow.propTypes = {
  isCDO: PropTypes.bool,
  result: PropTypes.PropTypes.shape({
    person: PropTypes.shape({}),
    currentAssignment: PropTypes.shape({
      TED: PropTypes.string,
    }),
    hsAssignment: PropTypes.shape({}),
    agenda: PropTypes.shape({
      panelDate: PropTypes.string,
    }),
  }),
};

EmployeeAgendaSearchRow.defaultProps = {
  isCDO: false,
  result: {},
};

export default EmployeeAgendaSearchRow;
