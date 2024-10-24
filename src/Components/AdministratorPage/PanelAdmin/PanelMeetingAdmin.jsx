import { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { subMinutes } from 'date-fns';
import PropTypes from 'prop-types';
import FA from 'react-fontawesome';
import { convertQueryToString, userHasPermissions } from 'utilities';
import Spinner from 'Components/Spinner';
import Alert from 'Components/Alert';
import { HISTORY_OBJECT } from 'Constants/PropTypes';
import { panelMeetingsFetchData, panelMeetingsFiltersFetchData } from 'actions/panelMeetings';
import { runPanelMeeting } from 'actions/panelMeetingAdmin';
import { submitPanelMeeting } from '../../Panel/helpers';
import { panelMeetingAgendasFetchData } from '../../../actions/panelMeetingAgendas';
import { useDataLoader } from '../../../hooks';
import api from '../../../api';

const PanelMeetingAdmin = (props) => {
  const { history, panelMeetingsResults, panelMeetingsIsLoading, pmSeqNum } = props;
  const isCreate = !pmSeqNum;

  const dispatch = useDispatch();

  const userProfile = useSelector(state => state.userProfile);
  const isFsbidAdmin = userHasPermissions(['fsbid_admin'], userProfile?.permission_groups);
  const isPanelAdmin = userHasPermissions(['panel_admin'], userProfile?.permission_groups);

  // ============= Retrieve Data =============

  const { pmt_code, pms_code, panelMeetingDates } = panelMeetingsResults;

  const panelMeetingDate$ = panelMeetingDates?.find(x => x.mdt_code === 'MEET');
  const prelimCutoff$ = panelMeetingDates?.find(x => x.mdt_code === 'CUT');
  const prelimRunTime$ = panelMeetingDates?.find(x => x.mdt_code === 'OFF');
  const addendumCutoff$ = panelMeetingDates?.find(x => x.mdt_code === 'ADD');
  const addendumRunTime$ = panelMeetingDates?.find(x => x.mdt_code === 'OFFA');

  const panelMeetingsFilters = useSelector(state => state.panelMeetingsFilters);
  const panelMeetingsFiltersIsLoading = useSelector(state =>
    state.panelMeetingsFiltersFetchDataLoading);

  const savePanelSuccess = useSelector(state => state.createPanelMeetingSuccess);
  const runPreliminarySuccess = useSelector(state => state.runOfficialPreliminarySuccess);
  const runAddendumSuccess = useSelector(state => state.runOfficialAddendumSuccess);

  const agendas = useSelector(state => state.panelMeetingAgendas);
  const agendasIsLoading = useSelector(state => state.panelMeetingAgendasFetchDataLoading);
  const agendas$ = agendas?.results || [];

  useEffect(() => {
    dispatch(panelMeetingsFiltersFetchData());
    dispatch(panelMeetingAgendasFetchData({}, pmSeqNum));
  }, []);

  // ============= Input Management =============

  const datePickerRef = useRef(null);
  const openDatePicker = () => {
    datePickerRef.current.setOpen(true);
  };

  const [panelMeetingType, setPanelMeetingType] = useState('ID');
  const [panelMeetingDate, setPanelMeetingDate] = useState();
  const [panelMeetingStatus, setPanelMeetingStatus] = useState('I');
  const [prelimCutoff, setPrelimCutoff] = useState();
  const [addendumCutoff, setAddendumCutoff] = useState();
  const [prelimRuntime, setPrelimRuntime] = useState();
  const [addendumRuntime, setAddendumRuntime] = useState();

  const setInitialInputResults = () => {
    setPanelMeetingType(pmt_code);
    setPanelMeetingDate(new Date(panelMeetingDate$.pmd_dttm));
    setPanelMeetingStatus(pms_code);

    setPrelimCutoff(new Date(prelimCutoff$.pmd_dttm));
    setAddendumCutoff(new Date(addendumCutoff$.pmd_dttm));

    if (prelimRunTime$) {
      setPrelimRuntime(new Date(prelimRunTime$.pmd_dttm));
    }
    if (addendumRunTime$) {
      setAddendumRuntime(new Date(addendumRunTime$.pmd_dttm));
    }
  };

  useEffect(() => {
    if (!isCreate && !!Object.keys(panelMeetingsResults).length && !panelMeetingsIsLoading) {
      setInitialInputResults();
    }
  }, [panelMeetingsResults]);

  const selectPanelMeetingDate = (date) => {
    setPanelMeetingDate(date);
    if (!prelimCutoff) {
      const prelimCutoffMins = 2875;
      setPrelimCutoff(subMinutes(date, prelimCutoffMins));
    }
    if (!addendumCutoff) {
      const addendumCutoffMins = 1435;
      setAddendumCutoff(subMinutes(date, addendumCutoffMins));
    }
  };

  const clear = () => {
    if (!isCreate && !!Object.keys(panelMeetingsResults).length && !panelMeetingsIsLoading) {
      setInitialInputResults();
    } else {
      setPanelMeetingType('ID');
      setPanelMeetingDate('');
      setPrelimCutoff('');
      setAddendumCutoff('');
      setPrelimRuntime('');
      setAddendumRuntime('');
      setPanelMeetingStatus('I');
    }
  };


  // ============= Submission Management =============

  const createMeetingResults = useSelector(state => state.createPanelMeetingSuccess);
  const createMeetingLoading = useSelector(state => state.createPanelMeetingIsLoading);
  const createMeetingErrored = useSelector(state => state.createPanelMeetingHasErrored);

  useEffect(() => {
    if (!createMeetingLoading && !createMeetingErrored && createMeetingResults.length) {
      history.push('/profile/ao/panelmeetings');
    }
  }, [createMeetingResults]);

  // Submit current timestamp for specified field without saving other pending changes
  const handleRun = (field) => {
    if (field === 'prelimRuntime') {
      dispatch(runPanelMeeting(pmSeqNum, 'preliminary'));
    }
    if (field === 'addendumRuntime') {
      dispatch(runPanelMeeting(pmSeqNum, 'addendum'));
    }
    if (runPreliminarySuccess || runAddendumSuccess) {
      dispatch(panelMeetingsFetchData({ id: pmSeqNum }));
      dispatch(panelMeetingAgendasFetchData({}, pmSeqNum));
    }
  };

  const submit = () => {
    dispatch(submitPanelMeeting(panelMeetingsResults,
      {
        panelMeetingType,
        panelMeetingDate,
        prelimCutoff,
        addendumCutoff,
        prelimRuntime,
        addendumRuntime,
        panelMeetingStatus,
      },
    ));
    if (savePanelSuccess.length !== 0) {
      if (isCreate) {
        clear();
      } else {
        dispatch(panelMeetingsFetchData({ id: pmSeqNum }));
        dispatch(panelMeetingAgendasFetchData({}, pmSeqNum));
      }
    }
  };

  // ============= Form Conditions =============

  // Logic to determine if there is a subsequent panel with same meeting type
  // in initiated status for agenda itmes in NR status to roll over to

  const panelDateStart = new Date(panelMeetingDate$?.pmd_dttm);
  const panelDateEnd = new Date(panelMeetingDate$?.pmd_dttm);
  panelDateEnd.setFullYear(panelDateStart.getFullYear() + 10);
  const {
    data: subsequentPanels,
    loading: subsequentPanelsIsLoading,
  } = useDataLoader(api().get,
    `/fsbid/panel/meetings/?${convertQueryToString({
      limit: 1,
      page: 1,
      ordering: '-panel_date',
      type: pmt_code,
      status: 'I',
      'panel-date-start': panelDateStart.toJSON(),
      'panel-date-end': panelDateEnd.toJSON(),
    })}`,
  );
  const subsequentPanel = subsequentPanels?.data?.results?.length > 0
    ? subsequentPanels.data.results[0] : undefined;

  // Helpers for input disabling conditions

  const beforePanelMeetingDate = (
    panelMeetingDate$ ? (new Date(panelMeetingDate$.pmd_dttm) - new Date() > 0) : true
  );
  const beforePrelimCutoff = (
    prelimCutoff$ ? (new Date(prelimCutoff$.pmd_dttm) - new Date() > 0) : true
  );
  const beforeAddendumCutoff = (
    addendumCutoff$ ? (new Date(addendumCutoff$.pmd_dttm) - new Date() > 0) : true
  );

  // Only admins can access editable fields and run buttons
  // Additional business rules must be followed depending on the stage of the panel meeting

  const disableMeetingType = !isFsbidAdmin ||
    (!isCreate && !beforeAddendumCutoff);

  const disableStatus = !isFsbidAdmin ||
    (isCreate || !beforeAddendumCutoff);

  const disablePanelMeetingDate = !isFsbidAdmin ||
    (!isCreate && !beforePanelMeetingDate);

  const disablePrelimCutoff = !isFsbidAdmin ||
    (!isCreate && !beforePrelimCutoff);

  const disableAddendumCutoff = !isFsbidAdmin ||
    (!isCreate && !beforeAddendumCutoff);

  const disableRunPrelim = () => {
    let preconditioned = true;
    agendas$.forEach(a => {
      // Approved Agenda Items must be in Off-Panel Meeting Category
      if (a.status_short === 'APR' && a.pmi_mic_code !== 'O') {
        preconditioned = false;
      }
      // Agenda Items must be Approved, Ready, Not Ready, or Deferred
      if (
        a.status_short !== 'APR' &&
        a.status_short !== 'RDY' &&
        a.status_short !== 'NR' &&
        a.status_short !== 'DEF'
      ) {
        preconditioned = false;
      }
    });
    return (
      isCreate ||
      beforePrelimCutoff ||
      !beforePanelMeetingDate ||
      !preconditioned ||
      !subsequentPanel ||
      prelimRunTime$
    );
  };

  const disableRunAddendum = () => {
    let preconditioned = true;
    agendas$.forEach(a => {
      // Agenda Items must not be Disapproved or Not Ready
      if (a.status_short === 'DIS' || a.status_short === 'NR') {
        preconditioned = false;
      }
    });
    return (
      isCreate ||
      beforeAddendumCutoff ||
      !beforePanelMeetingDate ||
      !preconditioned ||
      !subsequentPanel ||
      addendumRunTime$
    );
  };

  const disableClear = !isFsbidAdmin ||
    (!isCreate && !beforePanelMeetingDate);

  const disableSave = !isFsbidAdmin ||
    (!isCreate && !beforePanelMeetingDate);

  const isLoading =
    panelMeetingsIsLoading ||
    panelMeetingsFiltersIsLoading ||
    agendasIsLoading ||
    subsequentPanelsIsLoading;

  if (isCreate && isPanelAdmin) {
    return <Alert type="error" title="Permission Denied" messages={[{ body: 'Additional permissions are required to access this feature.' }]} />;
  }
  return (
    (isLoading) ?
      <Spinner type="panel-admin-remarks" size="small" /> :
      <div className="admin-panel-meeting">
        <div>
          <div className="admin-panel-grid-row">
            <div className="panel-meeting-field">
              <label htmlFor="meeting-type">Meeting Type</label>
              <select
                disabled={disableMeetingType}
                className="select-dropdown"
                value={panelMeetingType}
                onChange={(e) => setPanelMeetingType(e.target.value)}
              >
                {
                  panelMeetingsFilters?.panelTypes?.map(a => (
                    <option value={a.code} key={a.text}>{a.text}</option>
                  ))
                }
              </select>
            </div>
            <div className="panel-meeting-field">
              <label htmlFor="status">Status</label>
              <select
                disabled={disableStatus}
                className="select-dropdown"
                value={panelMeetingStatus}
                onChange={(e) => setPanelMeetingStatus(e.target.value)}
              >
                {
                  panelMeetingsFilters?.panelStatuses?.map(a => (
                    <option value={a.code} key={a.text}>{a.text}</option>
                  ))
                }
              </select>
            </div>
            <div className="panel-meeting-field">
              <label htmlFor="panel-meeting-date">Panel Meeting Date</label>
              <div className="date-picker-wrapper larger-date-picker">
                <FA name="fa fa-calendar" onClick={() => openDatePicker()} />
                <DatePicker
                  disabled={disablePanelMeetingDate}
                  selected={panelMeetingDate}
                  onChange={selectPanelMeetingDate}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={5}
                  timeCaption="time"
                  dateFormat="MM/dd/yyyy h:mm aa"
                  ref={datePickerRef}
                />
              </div>
            </div>
          </div>
          <div className="admin-panel-grid-row">
            <div className="panel-meeting-field">
              <label htmlFor="preliminary-cutoff-date">Official Preliminary Cutoff</label>
              <div className="date-picker-wrapper larger-date-picker">
                <FA name="fa fa-calendar" onClick={() => openDatePicker()} />
                <DatePicker
                  disabled={disablePrelimCutoff}
                  selected={prelimCutoff}
                  onChange={(date) => setPrelimCutoff(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={5}
                  timeCaption="time"
                  dateFormat="MM/dd/yyyy h:mm aa"
                  ref={datePickerRef}
                />
              </div>
            </div>
            <div className="panel-meeting-field">
              <label htmlFor="addendum-cutoff-date">Official Addendum Cutoff</label>
              <div className="date-picker-wrapper larger-date-picker">
                <FA name="fa fa-calendar" onClick={() => openDatePicker()} />
                <DatePicker
                  disabled={disableAddendumCutoff}
                  selected={addendumCutoff}
                  onChange={(date) => setAddendumCutoff(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={5}
                  timeCaption="time"
                  dateFormat="MM/dd/yyyy h:mm aa"
                  ref={datePickerRef}
                />
              </div>
            </div>
          </div>
          <div className="admin-panel-grid-row">
            <div className="panel-meeting-field">
              <label htmlFor="addendum-cutoff-date">Official Preliminary Run Time</label>
              <div className="date-picker-wrapper larger-date-picker">
                <FA name="fa fa-calendar" onClick={() => openDatePicker()} />
                <DatePicker
                  disabled
                  selected={prelimRuntime}
                  onChange={(date) => setPrelimRuntime(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={5}
                  timeCaption="time"
                  dateFormat="MM/dd/yyyy h:mm aa"
                  ref={datePickerRef}
                />
              </div>
              {isPanelAdmin &&
                <button
                  disabled={disableRunPrelim()}
                  className="text-button"
                  onClick={() => { handleRun('prelimRuntime'); }}
                >
                  Run Official Preliminary
                </button>
              }
            </div>
            <div className="panel-meeting-field">
              <label htmlFor="addendum-cutoff-date">Official Addendum Run Time</label>
              <div className="date-picker-wrapper larger-date-picker">
                <FA name="fa fa-calendar" onClick={() => openDatePicker()} />
                <DatePicker
                  disabled
                  selected={addendumRuntime}
                  onChange={(date) => setAddendumRuntime(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={5}
                  timeCaption="time"
                  dateFormat="MM/dd/yyyy h:mm aa"
                  ref={datePickerRef}
                />
              </div>
              {isPanelAdmin &&
                <button
                  disabled={disableRunAddendum()}
                  className="text-button"
                  onClick={() => { handleRun('addendumRuntime'); }}
                >
                  Run Official Addendum
                </button>
              }
            </div>
          </div>
        </div>
        {isFsbidAdmin &&
          <div className="position-form--actions">
            <button onClick={clear} disabled={disableClear}>Clear</button>
            <button onClick={submit} disabled={disableSave}>{isCreate ? 'Create' : 'Save'}</button>
          </div>
        }
      </div>
  );
};

PanelMeetingAdmin.propTypes = {
  history: HISTORY_OBJECT.isRequired,
  pmSeqNum: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  panelMeetingsResults: PropTypes.shape(),
  panelMeetingsIsLoading: PropTypes.bool,
};

PanelMeetingAdmin.defaultProps = {
  match: {},
  pmSeqNum: false,
  panelMeetingsResults: undefined,
  panelMeetingsIsLoading: false,
};

export default withRouter(PanelMeetingAdmin);
