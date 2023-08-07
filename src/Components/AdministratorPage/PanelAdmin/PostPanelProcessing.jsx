import { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import FA from 'react-fontawesome';
import PropTypes from 'prop-types';
import Spinner from 'Components/Spinner';
import { panelMeetingsFetchData } from 'actions/panelMeetings';
import { postPanelProcessingFetchData, postPanelStatusesFetchData } from 'actions/postPanelProcessing';
import { createPostPanelProcessing } from '../../../actions/postPanelProcessing';
import { submitPanelMeeting } from '../../Panel/helpers';


const PostPanelProcessing = (props) => {
  const pmSeqNum = props.match?.params?.pmSeqNum ?? false;

  const dispatch = useDispatch();

  // ============= Table Context =============

  const panelMeetingsResults = useSelector(state => state.panelMeetings);
  const panelMeetingsResults$ = panelMeetingsResults?.results?.[0] ?? {};
  const panelMeetingsIsLoading = useSelector(state => state.panelMeetingsFetchDataLoading);
  const { panelMeetingDates } = panelMeetingsResults$;

  const postPanelStarted$ = panelMeetingDates?.find(x => x.mdt_code === 'POSS');
  const postPanelRuntime$ = panelMeetingDates?.find(x => x.mdt_code === 'POST');
  const agendaCompletedTime$ = panelMeetingDates?.find(x => x.mdt_code === 'COMP');

  const postPanelResults = useSelector(state => state.postPanelProcessingFetchDataSuccess);
  const postPanelIsLoading = useSelector(state => state.postPanelProcessingFetchDataLoading);
  const postPanelStatusesResults =
    useSelector(state => state.postPanelStatusesFetchDataSuccess);
  const postPanelStatusesIsLoading = useSelector(state => state.postPanelStatusesFetchDataLoading);

  const [postPanelStarted, setPostPanelStarted] = useState();
  const [postPanelRuntime, setPostPanelRuntime] = useState();
  const [agendaCompletedTime, setAgendaCompletedTime] = useState();

  useEffect(() => {
    dispatch(panelMeetingsFetchData({ id: pmSeqNum }));
    dispatch(postPanelProcessingFetchData({ id: pmSeqNum }));
    dispatch(postPanelStatusesFetchData());
  }, []);

  useEffect(() => {
    if (!!Object.keys(panelMeetingsResults).length && !panelMeetingsIsLoading) {
      if (postPanelStarted$) {
        setPostPanelStarted(new Date(postPanelStarted$.pmd_dttm));
      }
      if (postPanelRuntime$) {
        setPostPanelRuntime(new Date(postPanelRuntime$.pmd_dttm));
      }
      if (agendaCompletedTime$) {
        setAgendaCompletedTime(new Date(agendaCompletedTime$.pmd_dttm));
      }
    }
  }, [panelMeetingsResults]);

  const datePickerRef = useRef(null);
  const openDatePicker = () => {
    datePickerRef.current.setOpen(true);
  };

  // ============= Form Management =============

  const [formData, setFormData] = useState(postPanelResults);

  const handleStatusSelection = (objLabel, newStatus) => {
    const newFormData = formData.map(o => {
      if (o.label === objLabel) {
        return {
          ...o,
          status: newStatus,
        };
      }
      return o;
    });
    setFormData(newFormData);
  };

  const [canEditFields, setCanEditFields] = useState(true);

  useEffect(() => {
    // Including conditions for all 3 dates because some Panels in Post Panel status and after
    // have post panel runtime and agenda completed dates but no post panel started
    if (!postPanelStarted$ && !postPanelRuntime$ && !agendaCompletedTime$) {
      dispatch(submitPanelMeeting(panelMeetingsResults$,
        { postPanelStarted: new Date() },
      ));
    }
    setFormData(postPanelResults);
    setCanEditFields(true);
  }, [postPanelResults]);

  const runPostPanelProcessing = () => {
    dispatch(createPostPanelProcessing(formData));
    dispatch(submitPanelMeeting(panelMeetingsResults$,
      { postPanelRuntime: new Date() },
    ));
  };

  const submit = () => {
    dispatch(createPostPanelProcessing(formData));
    dispatch(submitPanelMeeting(panelMeetingsResults$,
      {
        postPanelStarted,
        postPanelRuntime,
        agendaCompletedTime,
      },
    ));
  };

  const cancel = () => {
    // Depending on how the API works, this will need to handle removing these fields
    // instead of setting them to undefined
    if (!postPanelRuntime$ && !agendaCompletedTime$) {
      dispatch(submitPanelMeeting(panelMeetingsResults$,
        {
          postPanelStarted: undefined,
          postPanelRuntime: undefined,
          agendaCompletedTime: undefined,
        },
      ));
    }
  };

  // Remove second half of this when loading states are implemented with the api call in actions
  const isLoading = (postPanelIsLoading || postPanelStatusesIsLoading) ||
    (!postPanelStatusesResults.length || !formData.length);

  return (
    isLoading ?
      <Spinner type="panel-admin-remarks" size="small" /> :
      <div className="post-panel-processing">
        <div className="post-panel-grid-row">
          <div className="panel-meeting-field">
            <label htmlFor="addendum-cutoff-date">Post Panel Started</label>
            <div className="date-picker-wrapper larger-date-picker">
              <FA name="fa fa-calendar" onClick={() => openDatePicker()} />
              <DatePicker
                disabled={!canEditFields}
                selected={postPanelStarted}
                onChange={(date) => setPostPanelStarted(date)}
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
            <label htmlFor="addendum-cutoff-date">Post Panel Run Time</label>
            <div className="date-picker-wrapper larger-date-picker">
              <FA name="fa fa-calendar" onClick={() => openDatePicker()} />
              <DatePicker
                disabled={!canEditFields}
                selected={postPanelRuntime}
                onChange={(date) => setPostPanelRuntime(date)}
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
        <div className="post-panel-processing--table">
          <table>
            <thead>
              <tr>
                <th>Val</th>
                <th>Item</th>
                <th>Label</th>
                <th>Name</th>
                {postPanelStatusesResults.map((o) => (
                  <th key={o.label}>{o.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {formData.map(d => (
                <tr key={d.label}>
                  <td>
                    {d.value ?
                      <FA name="check" /> :
                      '---'
                    }
                  </td>
                  <td>
                    <span className="item-link">
                      {d.item}
                    </span>
                  </td>
                  <td>{d.label}</td>
                  <td>{d.name}</td>
                  {postPanelStatusesResults.map((o) => (
                    <td key={o.label}>
                      <input
                        type="radio"
                        name={`${o.label} ${d.label}`}
                        checked={d.status === o.value}
                        onChange={() => handleStatusSelection(d.label, o.value)}
                        disabled={!canEditFields}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          disabled={!postPanelStarted$ || postPanelRuntime$}
          className="text-button mb-20"
          onClick={runPostPanelProcessing}
        >
          Run Post Panel Processing
        </button>
        <div className="post-panel-grid-row">
          <div className="panel-meeting-field">
            <label htmlFor="addendum-cutoff-date">Agenda Completed Time</label>
            <div className="date-picker-wrapper larger-date-picker">
              <FA name="fa fa-calendar" onClick={() => openDatePicker()} />
              <DatePicker
                disabled={!canEditFields && !postPanelRuntime$}
                selected={agendaCompletedTime}
                onChange={(date) => setAgendaCompletedTime(date)}
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
        <div className="position-form--actions">
          <button onClick={cancel} disabled={postPanelRuntime$ || agendaCompletedTime$}>
            Cancel
          </button>
          <button onClick={submit} disabled={!canEditFields}>Save</button>
        </div>
      </div>
  );
};

PostPanelProcessing.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      pmSeqNum: PropTypes.string,
    }),
  }),
};

PostPanelProcessing.defaultProps = {
  match: {},
};

export default withRouter(PostPanelProcessing);
