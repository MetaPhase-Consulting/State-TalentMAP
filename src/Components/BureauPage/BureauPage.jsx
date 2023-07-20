import { Route, Switch } from 'react-router-dom';
import AvailableBidderContainer from 'Components/AvailableBidder/AvailableBidderContainer';
import EmployeeAgendaSearch from 'Components/Agenda/EmployeeAgendaSearch/EmployeeAgendaSearch';
import AgendaItemHistory from 'Components/Agenda/AgendaItemHistory/AgendaItemHistory';
import AgendaItemMaintenanceContainer from 'Components/Agenda/AgendaItemMaintenanceContainer/AgendaItemMaintenanceContainer';
import PanelMeetingSearch from 'Components/Panel/PanelMeetingSearch/PanelMeetingSearch';
import PublishablePositions from 'Components/PublishablePositions/PublishablePositions';
import PanelMeetingAgendas from 'Components/Panel/PanelMeetingAgendas/PanelMeetingAgendas';
import CycleManagement from 'Components/CycleManagement';
import CyclePositionSearch from 'Components/CycleManagement/CyclePositionSearch';
import PositionManager from './PositionManager';
import PositionManagerDetails from './PositionManagerDetails';
import ProjectedVacancy from './ProjectedVacancy';

const BureauPage = () => {
  const posManagerProps = {
    fromBureauMenu: true,
  };

  return (
    <div className="usa-grid-full profile-content-container">
      <Switch>
        <Route path="/profile/ao/employeeagendas" render={() => <EmployeeAgendaSearch isCDO={false} viewType="ao" />} />
        <Route path="/profile/ao/agendaitemhistory/:id" render={() => <AgendaItemHistory isCDO={false} viewType="ao" />} />
        <Route path="/profile/ao/createagendaitem/:id/:agendaID" render={() => <AgendaItemMaintenanceContainer isCDO={false} />} />
        <Route path="/profile/ao/createagendaitem/:id" render={() => <AgendaItemMaintenanceContainer isCDO={false} />} />
        <Route path="/profile/ao/panelmeetings" render={() => <PanelMeetingSearch isCDO={false} />} />
        <Route path="/profile/ao/availablebidders" render={() => <AvailableBidderContainer isCDO={false} isAO />} />
        <Route path="/profile/ao/panelmeetingagendas/:pmID" render={() => <PanelMeetingAgendas isAO />} />
        <Route path="/profile/ao/cyclemanagement" render={() => <CycleManagement isAO />} />
        <Route path="/profile/ao/cyclepositionsearch/:id" render={() => <CyclePositionSearch isAO />} />
        <Route path="/profile/cdo/availablebidders" render={() => <AvailableBidderContainer isCDO isAO={false} />} />
        <Route path="/profile/bureau/positionmanager/:type/:id" render={() => <PositionManagerDetails />} />
        <Route path="/profile/bureau/positionmanager" render={() => <PositionManager {...posManagerProps} />} />
        <Route path="/profile/bureau/availablebidders" render={() => <AvailableBidderContainer isCDO={false} />} />
        <Route path="/profile/bureau/projectedvacancy" render={() => <ProjectedVacancy isCDO={false} />} />
        <Route path="/profile/bureau/publishablepositions" render={() => <PublishablePositions />} />
        <Route path="/profile/bureau/cyclemanagement" render={() => <CycleManagement isAO={false} />} />
        <Route path="/profile/bureau/cyclepositionsearch/:id" render={() => <CyclePositionSearch />} />
      </Switch>
    </div>
  );
};

export default BureauPage;
