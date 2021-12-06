/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState } from 'react';
import ProfileSectionTitle from '../../ProfileSectionTitle';
import EmployeeAgendaSearchCards from '../EmployeeAgendaSearchCards/EmployeeAgendaSearchCards';
import EmployeeAgendaSearchRow from '../EmployeeAgendaSearchRow/EmployeeAgendaSearchRow';

const EmployeeAgendaSearch = ({ isCDO }) => {
  const [cardView, setCardView] = useState(false);
  const view = cardView ? 'card' : 'grid';

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
      panelDate: '12/25/2021',
      ted: '06/2023',
    },
  ];

  return (
    <div className="usa-grid-full profile-content-inner-container">
      <ProfileSectionTitle title="Employee Agenda Search" icon="user-circle-o" />
      {/* <div className="usa-grid-full employee-agenda-row"> */}
      {/* card/row functionality will be added on another ticket */}
      {/* {
          data.map(result => (
            <EmployeeAgendaSearchRow results={result} isCDO={isCDO} />
          ))
        } */}
      {/* </div> */}
      <div className="usa-grid-full employee-agenda-card-list">
        {
          data.map(result => (
            <EmployeeAgendaSearchCards results={result} isCDO={isCDO} />
          ))
        }
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
