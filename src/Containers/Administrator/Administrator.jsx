import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AdministratorPage from '../../Components/AdministratorPage';
import { getLogs, getLogsList, getLog, getLogToDownload } from '../../actions/logs';
import { syncsFetchData, putAllSyncs } from '../../actions/synchronizations';
import { EMPTY_FUNCTION } from '../../Constants/PropTypes';

export const downloadFile = (text) => {
  const filename = `logs-${Date.now()}.txt`;
  const data = text;
  const blob = new Blob([data], { type: 'text/csv' });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
};

class AdministratorContainer extends Component {
  constructor(props) {
    super(props);
    this.onDownloadClick = this.onDownloadClick.bind(this);
    this.getLogById = this.getLogById.bind(this);
    this.onDownloadOne = this.onDownloadOne.bind(this);
    this.runAllJobs = this.runAllJobs.bind(this);
    this.state = {};
  }

  componentWillMount() {
    this.props.getLogsList();
    this.props.getSyncJobs();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.logsIsLoading && !nextProps.logsIsLoading && nextProps.logs) {
      downloadFile(nextProps.log);
    }
    if (this.props.logToDownloadIsLoading && !nextProps.logToDownloadIsLoading
      && nextProps.logToDownload) {
      downloadFile(nextProps.logToDownload);
    }
  }

  onDownloadClick() {
    if (!this.props.isLoading) {
      this.props.getLogs();
    }
  }

  onDownloadOne(id) {
    if (!this.props.logToDownloadIsLoading) {
      this.props.getLogToDownload(id);
    }
  }

  getLogById(id) {
    this.props.getLog(id);
  }

  runAllJobs() {
    const { putAllSyncJobs, putAllSyncsIsLoading } = this.props;
    if (!putAllSyncsIsLoading) {
      putAllSyncJobs();
    }
  }

  render() {
    const { logs, logsIsLoading, logsHasErrored,
    logsList, logsListIsLoading, logsListHasErrored,
    log, logIsLoading, logHasErrored, syncJobs, syncJobsIsLoading } = this.props;
    const props = {
      logs,
      logsIsLoading,
      logsHasErrored,
      onDownloadClick: this.onDownloadClick,
      logsList,
      logsListIsLoading,
      logsListHasErrored,
      log,
      logIsLoading,
      logHasErrored,
      getLog: this.getLogById,
      onDownloadOne: this.onDownloadOne,
      syncJobs,
      syncJobsIsLoading,
      runAllJobs: this.runAllJobs,
    };
    return (
      <AdministratorPage {...props} />
    );
  }
}

AdministratorContainer.propTypes = {
  getLogs: PropTypes.func,
  getLogsList: PropTypes.func,
  isLoading: PropTypes.bool,
  logs: PropTypes.string,
  logsIsLoading: PropTypes.bool,
  logsHasErrored: PropTypes.bool,
  logsList: PropTypes.arrayOf(PropTypes.string),
  logsListIsLoading: PropTypes.bool,
  logsListHasErrored: PropTypes.bool,
  log: PropTypes.arrayOf(PropTypes.string),
  logIsLoading: PropTypes.bool,
  logHasErrored: PropTypes.bool,
  logToDownload: PropTypes.string,
  logToDownloadIsLoading: PropTypes.bool,
  logToDownloadHasErrored: PropTypes.bool,
  getLog: PropTypes.func,
  getLogToDownload: PropTypes.func,
  getSyncJobs: PropTypes.func,
  syncJobs: PropTypes.arrayOf(PropTypes.shape({})),
  syncJobsIsLoading: PropTypes.bool,
  syncsJobsHasErrored: PropTypes.bool,
  putAllSyncJobs: PropTypes.func,
  putAllSyncsIsLoading: PropTypes.bool,
};

AdministratorContainer.defaultProps = {
  getLogs: EMPTY_FUNCTION,
  getLogsList: EMPTY_FUNCTION,
  isLoading: false,
  logs: '',
  logsIsLoading: false,
  logsHasErrored: false,
  logsList: [],
  logsListIsLoading: false,
  logsListHasErrored: false,
  log: [],
  logIsLoading: false,
  logHasErrored: false,
  logToDownload: '',
  logToDownloadIsLoading: false,
  logToDownloadHasErrored: false,
  getLog: EMPTY_FUNCTION,
  getLogToDownload: EMPTY_FUNCTION,
  getSyncJobs: EMPTY_FUNCTION,
  syncJobs: [],
  syncJobsIsLoading: false,
  syncsJobsHasErrored: false,
  putAllSyncsIsLoading: false,
  putAllSyncJobs: EMPTY_FUNCTION,
};

const mapStateToProps = state => ({
  logs: state.logsSuccess,
  logsIsLoading: state.logsIsLoading,
  logsHasErrored: state.logsHasErrored,
  logsList: state.logsListSuccess,
  logsListIsLoading: state.logsListIsLoading,
  logsListHasErrored: state.logsListHasErrored,
  log: state.logSuccess,
  logIsLoading: state.logIsLoading,
  logHasErrored: state.logHasErrored,
  logToDownload: state.logToDownloadSuccess,
  logToDownloadIsLoading: state.logToDownloadIsLoading,
  logToDownloadHasErrored: state.logToDownloadHasErrored,
  syncJobs: state.syncs,
  syncJobsIsLoading: state.syncsIsLoading,
  syncsJobsHasErrored: state.syncsHasErrored,
  putAllSyncsIsLoading: state.putAllSyncsIsLoading,
});

export const mapDispatchToProps = dispatch => ({
  getLogs: () => dispatch(getLogs()),
  getLogsList: () => dispatch(getLogsList()),
  getLog: id => dispatch(getLog(id)),
  getLogToDownload: id => dispatch(getLogToDownload(id)),
  getSyncJobs: () => dispatch(syncsFetchData()),
  putAllSyncJobs: () => dispatch(putAllSyncs()),
});

export default connect(mapStateToProps, mapDispatchToProps)((AdministratorContainer));
