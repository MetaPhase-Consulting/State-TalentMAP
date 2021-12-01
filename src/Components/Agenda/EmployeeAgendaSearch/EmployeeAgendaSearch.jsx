import PropTypes from 'prop-types';
import ProfileSectionTitle from '../../ProfileSectionTitle';
import EmployeeAgendaSearchCards from '../EmployeeAgendaSearchCards/EmployeeAgendaSearchCards';

const EmployeeAgendaSearch = ({ isCDO }) => (
  <div className="usa-grid-full profile-content-inner-container">
    <ProfileSectionTitle title="Employee Agenda Search" icon="user-circle-o" />
    <div className="usa-grid-full employee-agenda-card-list">
      <EmployeeAgendaSearchCards isCDO={isCDO} />
    </div>
  </div>
);

EmployeeAgendaSearch.propTypes = {
  isCDO: PropTypes.bool,
};

EmployeeAgendaSearch.defaultProps = {
  isCDO: false,
};

export default EmployeeAgendaSearch;
