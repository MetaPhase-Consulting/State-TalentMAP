import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import BidCycles from 'Containers/BidCycles';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';
import CycleManagement from 'Components/CycleManagement';
import CyclePositionSearch from 'Components/CycleManagement/CyclePositionSearch';
import AssignmentCycleEdit from 'Components/CycleManagement/AssignmentCycleEdit';
import CycleClassifications from 'Components/CycleManagement/CycleClassifications';
import Dashboard from './Dashboard';
import BureauExceptions from './BureauExceptions/';
import Logs from './Logs';
import Stats from './Stats';
import UserRoles from './UserRoles';
import FeatureFlags from './FeatureFlags';
import PanelAdmin from './PanelAdmin';
import ManageBidSeasons from './ManageBidSeasons/ManageBidSeasons';
import BidAudit from './bidAudit/BidAudit';
import BidAuditCategory from './bidAudit/BidAuditCategory';
import BidAuditGrade from './bidAudit/BidAuditGrade';
import BidAuditData from './bidAudit/BidAuditData';
import CycleJobCategories from './CycleJobCategories/CycleJobCategories';
import ManageEntryLevel from './ManageEntryLevel/ManageEntryLevel';
import JobCategories from './JobCategories/JobCategories';
import OrgStats from './OrgStats/OrgStats';
import BiddingTool from '../BiddingFunctionsPage/BiddingTool/BiddingTool';

const AdministratorPage = (props) => {
  const {
    isLoading,
    logsList,
    logsListIsLoading,
    logsListHasErrored,
    log,
    logIsLoading,
    logHasErrored,
    getLog,
    onDownloadOne,
    totalUsers,
    featureFlags,
  } = props;

  const dashboardProps = {
    isLoading,
  };

  const logsProps = {
    logsList,
    logsListIsLoading,
    logsListHasErrored,
    log,
    logIsLoading,
    logHasErrored,
    getLog,
    onDownloadOne,
  };

  const userProps = {
    totalUsers,
  };

  const featureFlagsProps = {
    featureFlags,
  };

  return (
    <div className="usa-grid-full profile-content-container">
      <Switch>
        <Route path="/profile/administrator/dashboard" render={() => <Dashboard {...dashboardProps} />} />
        <Route path="/profile/administrator/bureauexceptions" render={() => <BureauExceptions />} />
        <Route path="/profile/administrator/logs" render={() => <Logs {...logsProps} />} />
        <Route path="/profile/administrator/stats" render={() => <Stats />} />
        <Route path="/profile/administrator/userroles" render={() => <UserRoles {...userProps} />} />
        <Route path="/profile/administrator/featureflags" render={() => <FeatureFlags {...featureFlagsProps} />} />
        <Route path="/profile/administrator/cycles" render={() => <BidCycles />} />
        <Route path="/profile/administrator/managebidseasons" render={() => <ManageBidSeasons />} />
        <Route path="/profile/administrator/bidaudit/category/:cycleId/:auditId" render={() => <BidAuditCategory />} />
        <Route path="/profile/administrator/bidaudit/grade/:cycleId/:auditId" render={() => <BidAuditGrade />} />
        <Route path="/profile/administrator/bidaudit/data/:cycleId/:auditId" render={() => <BidAuditData />} />
        <Route path="/profile/administrator/bidaudit/" render={() => <BidAudit />} />
        <Route path="/profile/administrator/panel/:pmSeqNum" render={() => <PanelAdmin />} />
        <Route path="/profile/administrator/panel/" render={() => <PanelAdmin />} />
        <Route path="/profile/administrator/cyclejobcategories/" render={() => <CycleJobCategories />} />
        <Route path="/profile/administrator/manageentrylevel/" render={() => <ManageEntryLevel />} />
        <Route path="/profile/administrator/jobcategories/" render={() => <JobCategories />} />
        <Route path="/profile/administrator/orgstats" render={() => <OrgStats />} />
        <Route path="/profile/administrator/biddingtool/:id" render={() => <BiddingTool />} />
        <Route path="/profile/administrator/biddingtool/" render={() => <BiddingTool />} />
        <Route path="/profile/administrator/cyclemanagement" render={() => <CycleManagement />} />
        <Route path="/profile/administrator/assignmentcycle/:id" render={() => <AssignmentCycleEdit />} />
        <Route path="/profile/administrator/cyclepositionsearch/:id" render={() => <CyclePositionSearch />} />
        <Route path="/profile/administrator/cycleclassifications/" render={() => <CycleClassifications />} />
      </Switch>
    </div>
  );
};

AdministratorPage.propTypes = {
  isLoading: PropTypes.bool,
  logsIsLoading: PropTypes.bool,
  onDownloadClick: PropTypes.func,
  logsList: PropTypes.arrayOf(PropTypes.string),
  logsListIsLoading: PropTypes.bool,
  logsListHasErrored: PropTypes.bool,
  log: PropTypes.arrayOf(PropTypes.string),
  logIsLoading: PropTypes.bool,
  logHasErrored: PropTypes.bool,
  getLog: PropTypes.func,
  onDownloadOne: PropTypes.func,
  syncJobs: PropTypes.arrayOf(PropTypes.shape({})),
  syncJobsIsLoading: PropTypes.bool,
  runAllJobs: PropTypes.func,
  patchSyncIsLoading: PropTypes.bool,
  patchSyncJob: PropTypes.func,
  totalUsers: PropTypes.number,
  featureFlags: PropTypes.shape({}),
};

AdministratorPage.defaultProps = {
  isLoading: false,
  logsIsLoading: false,
  onDownloadClick: EMPTY_FUNCTION,
  logsList: [],
  logsListIsLoading: false,
  logsListHasErrored: false,
  log: [],
  logIsLoading: false,
  logHasErrored: false,
  getLog: EMPTY_FUNCTION,
  onDownloadOne: EMPTY_FUNCTION,
  syncJobs: [],
  syncJobsIsLoading: false,
  runAllJobs: EMPTY_FUNCTION,
  patchSyncIsLoading: false,
  patchSyncJob: EMPTY_FUNCTION,
  totalUsers: 0,
  featureFlags: {},
};

export default AdministratorPage;
