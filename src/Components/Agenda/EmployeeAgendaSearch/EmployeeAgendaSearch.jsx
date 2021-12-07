import PropTypes from 'prop-types';
import { useState } from 'react';
import ProfileSectionTitle from '../../ProfileSectionTitle';
import EmployeeAgendaSearchCard from '../EmployeeAgendaSearchCard/EmployeeAgendaSearchCard';
import EmployeeAgendaSearchRow from '../EmployeeAgendaSearchRow/EmployeeAgendaSearchRow';

const EmployeeAgendaSearch = ({ isCDO }) => {
  const [cardView, setCardView] = useState(true);
  const view = cardView ? 'row' : 'card';

  const data = [
    {
      agendaStatus: 'Complete',
      author: 'Last, First MI Author',
      bidder: 'Last, First MI',
      cdo: 'Last, First MI CDO',
      currentPost: 'Paris (EUR)',
      futurePost: 'Djbouti (AF)',
      hs_accepted: true, // for testing only
      hs_status: 'Accepted', // for testing only
      initials: 'FL',
      panelDate: '12/25/2021',
      ted: '04/2022',
    },
    {
      agendaStatus: 'Complete',
      author: 'Last, First MI Author',
      bidder: 'Last, First MI',
      cdo: 'Last, First MI CDO',
      currentPost: 'Paris (EUR)',
      futurePost: 'Djbouti (AF)',
      hs_accepted: false,
      hs_status: 'Offered',
      initials: 'FL',
      panelDate: '12/25/2021',
      ted: '04/2025',
    },
    {
      agendaStatus: 'Complete',
      author: 'Last, First MI Author',
      bidder: 'Last, First MI',
      cdo: 'Last, First MI CDO',
      currentPost: 'Paris (EUR)',
      futurePost: 'Djbouti (AF)',
      hs_accepted: false,
      hs_status: 'Extended',
      initials: 'FL',
      panelDate: '12/25/2021',
      ted: '09/2023',
    },
    {
      agendaStatus: 'Complete',
      author: 'Last, First MI Author',
      bidder: 'Last, First MI',
      cdo: 'Last, First MI CDO',
      currentPost: 'Paris (EUR)',
      futurePost: 'Djbouti (AF)',
      hs_accepted: true,
      hs_status: 'Accepted',
      initials: 'FL',
      panelDate: '12/25/2021',
      ted: '11/2022',
    },
    {
      agendaStatus: 'Complete',
      author: 'Last, First MI Author',
      bidder: 'Last, First MI',
      cdo: 'Last, First MI CDO',
      currentPost: 'Paris (EUR)',
      futurePost: 'Djbouti (AF)',
      hs_accepted: false,
      hs_status: 'Accepted',
      initials: 'FL',
      panelDate: '12/25/2021',
      ted: '07/2024',
    },
    {
      agendaStatus: 'Complete',
      author: 'Last, First MI Author',
      bidder: 'Last, First MI',
      cdo: 'Last, First MI CDO',
      currentPost: 'Paris (EUR)',
      futurePost: 'Djbouti (AF)',
      hs_accepted: false,
      hs_status: 'Offered',
      initials: 'FL',
      panelDate: '12/25/2021',
      ted: '09/2023',
    },
    {
      agendaStatus: 'Complete',
      author: 'Last, First MI Author',
      bidder: 'Last, First MI',
      cdo: 'Last, First MI CDO',
      currentPost: 'Paris (EUR)',
      futurePost: 'Djbouti (AF)',
      hs_accepted: false,
      hs_status: 'Extended',
      initials: 'FL',
      panelDate: '12/25/2021',
      ted: '03/2023',
    },
    {
      agendaStatus: 'Complete',
      author: 'Last, First MI Author',
      bidder: 'Last, First MI',
      cdo: 'Last, First MI CDO',
      currentPost: 'Paris (EUR)',
      futurePost: 'Djbouti (AF)',
      hs_accepted: true,
      hs_status: 'Accepted',
      initials: 'FL',
      panelDate: '12/25/2021',
      ted: '06/2023',
    },
  ];

  return (
    <div className="usa-grid-full profile-content-inner-container">
      <ProfileSectionTitle title="Employee Agenda Search" icon="user-circle-o" />
      {/* card/row functionality will be added on another ticket */}
      <button onClick={() => setCardView(!cardView)}>
        {`${view} view`}
      </button>
      {
        cardView &&
          <div className="employee-agenda-card">
            {data.map(result => (
              // TODO: include React keys once we have real data
              <EmployeeAgendaSearchCard result={result} isCDO={isCDO} />
            ))}
          </div>
      }
      {
        !cardView &&
          <div className="employee-agenda-row">
            {data.map(result => (
              // TODO: include React keys once we have real data
              <EmployeeAgendaSearchRow result={result} isCDO={isCDO} />
            ))}
          </div>
      }
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
