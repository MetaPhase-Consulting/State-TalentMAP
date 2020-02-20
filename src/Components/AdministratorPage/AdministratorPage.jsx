import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { EMPTY_FUNCTION } from '../../Constants/PropTypes';
import Dashboard from './Dashboard';
import Logs from './Logs';
import Stats from './Stats';
import UserRoles from './UserRoles';

const AdministratorPage = (props) => {
  const {
    isLoading,
    logsIsLoading,
    onDownloadClick,
    logsList,
    logsListIsLoading,
    logsListHasErrored,
    log,
    logIsLoading,
    logHasErrored,
    getLog,
    onDownloadOne,
    syncJobs,
    syncJobsIsLoading,
    runAllJobs,
    patchSyncJob,
    patchSyncIsLoading,
    usersIsLoading,
    usersHasErrored,
    usersList,
    totalUsers,
  } = props;

  const dashboardProps = {
    isLoading,
    logsIsLoading,
    onDownloadClick,
    syncJobs,
    syncJobsIsLoading,
    runAllJobs,
    patchSyncJob,
    patchSyncIsLoading,
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
    usersList,
    usersIsLoading,
    usersHasErrored,
    totalUsers,
  };

  return (
    <div className="usa-grid-full profile-content-container">
      <Switch>
        <Route path="/profile/administrator/dashboard" render={() => <Dashboard {...dashboardProps} />} />
        <Route path="/profile/administrator/logs" render={() => <Logs {...logsProps} />} />
        <Route path="/profile/administrator/stats" render={() => <Stats />} />
        <Route path="/profile/administrator/userroles" render={() => <UserRoles {...userProps} />} />
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
  usersIsLoading: PropTypes.bool,
  usersHasErrored: PropTypes.bool,
  usersList: PropTypes.arrayOf(PropTypes.shape({})),
  totalUsers: PropTypes.number,
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
  usersIsLoading: false,
  usersHasErrored: false,
  usersList: [],
  totalUsers: 0, // ?mike? this feels excessive 2 of 3
};

export default AdministratorPage;
