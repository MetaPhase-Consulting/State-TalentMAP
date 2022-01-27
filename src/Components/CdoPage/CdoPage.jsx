import { Route, Switch } from 'react-router-dom';
import BidderPortfolio from 'Containers/BidderPortfolio';
import AvailableBidderContainer from 'Components/AvailableBidder/AvailableBidderContainer';
import EmployeeAgendaSearch from 'Components/Agenda/EmployeeAgendaSearch/EmployeeAgendaSearch';
import AgendaItemHistory from 'Components/Agenda/AgendaItemHistory/AgendaItemHistory';
import AgendaItemMaintenanceContainer from '../../Components/Agenda/AgendaItemMaintenanceContainer/AgendaItemMaintenanceContainer';

const CdoPage = () => (
  <div className="usa-grid-full profile-content-container">
    <Switch>
      <Route path="/profile/cdo/availablebidders" render={() => <AvailableBidderContainer isCDO />} />
      <Route path="/profile/cdo/bidderportfolio" render={() => <BidderPortfolio />} />
      <Route path="/profile/cdo/employeeagenda" render={() => <EmployeeAgendaSearch isCDO />} />
      <Route path="/profile/cdo/agendaitemhistory/:id" render={() => <AgendaItemHistory />} />
      <Route path="/profile/cdo/createagendaitem/:id" render={() => <AgendaItemMaintenanceContainer />} />
    </Switch>
  </div>
);

export default CdoPage;
