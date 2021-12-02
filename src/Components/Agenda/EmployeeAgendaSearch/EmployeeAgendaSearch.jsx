/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState } from 'react';
import ProfileSectionTitle from '../../ProfileSectionTitle';
import EmployeeAgendaSearchCards from '../EmployeeAgendaSearchCards/EmployeeAgendaSearchCards';
// import EmployeeAgendaSearchRow from '../EmployeeAgendaSearchRow/EmployeeAgendaSearchRow';

const EmployeeAgendaSearch = ({ isCDO }) => {
  const [cardView, setCardView] = useState(false);
  const view = cardView ? 'card' : 'grid';

  return (
    <div className="usa-grid-full profile-content-inner-container">
      <ProfileSectionTitle title="Employee Agenda Search" icon="user-circle-o" />
      <div className="usa-grid-full employee-agenda-card-list">
        <EmployeeAgendaSearchCards isCDO={isCDO} />
      </div>
      {/* {
        cardView &&
          <div className="usa-grid-full employee-agenda-card-list">
            <EmployeeAgendaSearchCards isCDO={isCDO} />
          </div>
      }
      {
        !cardView &&
          <div className="usa-grid-full employee-agenda-card-list">
            <EmployeeAgendaSearchRow isCDO={isCDO} />
          </div>
      } */}
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
