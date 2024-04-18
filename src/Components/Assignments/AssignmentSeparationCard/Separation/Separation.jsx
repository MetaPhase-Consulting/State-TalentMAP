import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FA from 'react-fontawesome';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { getResult } from 'utilities';
import { EMPTY_FUNCTION, POSITION_DETAILS } from 'Constants/PropTypes';
import {
  NO_BUREAU, NO_GRADE, NO_POSITION_TITLE, NO_POST,
  NO_STATUS, NO_TOUR_END_DATE, NO_VALUE,
} from 'Constants/SystemMessages';
import { altAssignmentDetailFetchData } from 'actions/assignment';
import { resetPositionsFetchData } from 'actions/positions';
import Alert from 'Components/Alert';
import Spinner from 'Components/Spinner';
import CheckBox from 'Components/CheckBox';
import TMDatePicker from 'Components/TMDatePicker';
import InteractiveElement from 'Components/InteractiveElement';
import PositionExpandableContent from 'Components/PositionExpandableContent';
import GsaLocations from 'Components/Agenda/AgendaItemResearchPane/GsaLocations';
import { createSeparation, separationDetail, updateSeparation } from '../../../../actions/assignment';

const Separation = (props) => {
  const { perdet, data, isNew, setNewAsgSep, toggleModal } = props;

  const dispatch = useDispatch();

  // ====================== Data Retrieval ======================

  const assignmentDetails = useSelector(state => state.altAssignmentDetail);
  const assignmentsDetailsErrored = useSelector(state => state.altAssignmentDetailHasErrored);
  const assignmentsDetailsLoading = useSelector(state => state.altAssignmentDetailIsLoading);

  const statusOptions = assignmentDetails?.QRY_LSTASGS_REF;
  const actionOptions = assignmentDetails?.QRY_LSTLAT_REF;
  const travelOptions = assignmentDetails?.QRY_LSTTF_REF;
  const waiverOptions = assignmentDetails?.QRY_LSTWRT_REF;

  // Asg Detail Data (Not to be confused with the Asg List)
  const asgDetail = isNew ? {} : assignmentDetails?.QRY_GETASGDTL_REF?.[0];

  useEffect(() => {
    const asgId = data?.ASG_SEQ_NUM;
    const revision_num = data?.ASGD_REVISION_NUM;
    dispatch(altAssignmentDetailFetchData(perdet, asgId, revision_num));
    dispatch(separationDetail(perdet, asgId, revision_num));
    return () => {
      dispatch(resetPositionsFetchData());
    };
  }, []);

  // ====================== View Mode ======================

  const sections = {
    /* eslint-disable quote-props */
    bodyPrimary: [
      { 'Status': getResult(data, 'ASGS_CODE') || NO_STATUS },
      { 'Bureau': getResult(data, 'ORGS_SHORT_DESC') || NO_BUREAU },
      { 'Location': getResult(data, 'POS_LOCATION_CODE') || NO_POST },
      { 'ETA': get(data, 'ASGD_ETA_DATE') || NO_VALUE },
      { 'DIP': getResult(data, 'DIPLOMATIC_TITLE') || NO_POSITION_TITLE },
      { 'Memo Sent': getResult(data, 'MEMO_LAST_SENT_DATE') || NO_VALUE },
      { 'Note Sent': getResult(data, 'NOTE_LAST_SENT_DATE') || NO_VALUE },
      { 'TED': get(data, 'ASGD_ETD_TED_DATE') || NO_TOUR_END_DATE },
      { 'Grade': getResult(data, 'GRD_CD') || NO_GRADE },
      { 'Pay Plan': getResult(data, 'PPL_CODE') || NO_VALUE },
    ],
    /* eslint-enable quote-props */
  };

  if (!isNew) {
    /* eslint-disable quote-props */
    sections.subheading = [
      { 'Name': asgDetail?.name || NO_VALUE },
      { 'SSN': asgDetail?.ssn || NO_VALUE },
    ];
    /* eslint-enable quote-props */
  }

  // ====================== Edit Mode ======================

  const [editMode, setEditMode] = useState(isNew);
  const [showLocationSearch, setShowLocationSearch] = useState(false);

  const [status, setStatus] = useState('');
  const [action, setAction] = useState('');
  const [waiver, setWaiver] = useState('');
  const [travel, setTravel] = useState('');
  const [separationDate, setSeparationDate] = useState(null);
  const [usIndicator, setUsIndicator] = useState(false);
  const [panelMeetingDate, setPanelMeetingDate] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    setStatus(asgDetail?.ASGS_CODE || '');
    setAction(asgDetail?.LAT_CODE || '');
    setWaiver(asgDetail?.WRT_CODE_RR_REPAY || '');
    setTravel(asgDetail?.TF_CD || '');
    // setSeparationDate(asgDetail?.ASGD_ETD_TED_DATE || null);
    setUsIndicator(asgDetail?.ASGD_TRIANING_IND === 'Y');
    // setPanelMeetingDate(asgDetail?.ASGD_ETA_DATE || null);
    setLocation(null);
  }, []);

  const locationString = () => {
    let displayText;
    if (location) {
      const { city, country, code } = location;
      displayText = (city && country) ? `${city}, ${country}` : city || country || code || '';
    }
    return displayText;
  };

  const onSubmitForm = () => {
    const { state, country } = location;
    const formValues = {
      emp_seq_nbr: null,
      dsc_cd: null,
      separation_date: separationDate,
      city_text: location?.city || null,
      country_state_text: (state && country) ? `${state}, ${country}` : state || country || null,
      us_ind: usIndicator ? 'Y' : 'N',
      status_code: status,
      lat_code: action,
      travel_code: travel,
      rr_repay_ind: waiver,
      note: null,
    };
    if (isNew) {
      dispatch(createSeparation({
        ...formValues,
      }, perdet));
    } else {
      dispatch(updateSeparation({
        ...formValues,
      }, perdet));
    }
    if (isNew) toggleModal(false);
    setNewAsgSep('default');
  };

  const form = {
    /* eslint-disable quote-props */
    inputBody:
      <div className="position-form">
        <div className="position-form--inputs">
          <div className="position-form--label-input-container">
            <label htmlFor="assignment-statuses">Status</label>
            <select
              id="assignment-statuses"
              value={status}
              onChange={(e) => setStatus(e?.target.value)}
            >
              <option value="" disabled>
                Select Status
              </option>
              {statusOptions?.map(s => (
                <option value={s.ASGS_CODE}>
                  {s.ASGS_DESC_TEXT}
                </option>
              ))}
            </select>
          </div>
          <div className="position-form--label-input-container">
            <label htmlFor="assignment-actions">Action</label>
            <select
              id="assignment-actions"
              value={action}
              onChange={(e) => setAction(e?.target.value)}
            >
              <option value="" disabled>
                Select Action
              </option>
              {actionOptions?.map(a => (
                <option value={a.LAT_CODE}>
                  {a.LAT_ABBR_DESC_TEXT}
                </option>
              ))}
            </select>
          </div>
          <div className="position-form--label-input-container">
            <label htmlFor="assignment-waiver">Waiver</label>
            <select
              id="assignment-waiver"
              value={waiver}
              onChange={(e) => setWaiver(e?.target.value)}
            >
              <option value="" disabled>
                Select Waiver
              </option>
              {waiverOptions?.map(w => (
                <option value={w.WRT_CODE}>
                  {w.WRT_DESC}
                </option>
              ))}
            </select>
          </div>
          <div className="position-form--label-input-container">
            <label htmlFor="assignment-travel">Travel</label>
            <select
              id="assignment-travel"
              value={travel}
              onChange={(e) => setTravel(e?.target.value)}
            >
              <option value="" disabled>
                Select Travel
              </option>
              {travelOptions?.map(t => (
                <option value={t.TF_CODE}>
                  {t.TF_SHORT_DESC_TEXT}
                </option>
              ))}
            </select>
          </div>
          <div className="position-form--label-input-container">
            <label htmlFor="separation-date">Separation Date</label>
            <TMDatePicker
              selected={separationDate}
              onChange={setSeparationDate}
              showMonthDropdown
              showYearDropdown
              isClearable
              type="form"
            />
          </div>
          <div className="position-form--label-input-container height-80">
            <CheckBox
              id={`training-${data.id ?? 'create'}`}
              label="US Indicator"
              value={usIndicator}
              className="mt-40"
              excludeTmCheckboxClass
              onChange={() => setUsIndicator(!usIndicator)}
            />
          </div>
          <div className="position-form--label-input-container">
            <label htmlFor="panel-meeting-date">Panel Meeting Date</label>
            <TMDatePicker
              selected={panelMeetingDate}
              onChange={setPanelMeetingDate}
              showMonthDropdown
              showYearDropdown
              isClearable
              type="form"
            />
          </div>
          <div className="position-form--label-input-container gsa-location-input">
            <label htmlFor="location">Location</label>
            <input value={locationString() || ''} placeholder="Select Location" readOnly />
            {location &&
              <InteractiveElement
                title="Remove Selected Location"
                role="button"
                type="span"
                className="remove-location"
                onClick={() => setLocation(null)}
              >
                <FA name="times" />
              </InteractiveElement>
            }
            <InteractiveElement
              title="Search Location"
              role="button"
              type="span"
              className="search-location"
              onClick={() => setShowLocationSearch(!showLocationSearch)}
            >
              <FA name="globe" />
            </InteractiveElement>
          </div>
        </div>
        {showLocationSearch &&
          <GsaLocations
            setLocation={(loc) => { setLocation(loc); setShowLocationSearch(false); }}
            activeAIL
          />
        }
      </div>,
    cancelText: 'Are you sure you want to discard all changes made to this Assignment?',
    handleSubmit: () => onSubmitForm(),
    handleCancel: () => { if (isNew) toggleModal(false); },
    handleEdit: {
      editMode,
      setEditMode: isNew ? null : setEditMode,
    },
    // TO-DO: DIP, MEMO, NOTE
    /* eslint-enable quote-props */
  };

  const getOverlay = () => {
    let overlay;
    if (assignmentsDetailsLoading) {
      overlay = <Spinner type="standard-center" size="small" />;
    } else if (assignmentsDetailsErrored) {
      overlay = <Alert type="error" title="Error loading data" messages={[{ body: 'Please try again.' }]} />;
    } else {
      return false;
    }
    return overlay;
  };

  return (
    <div className="position-content--container min-height-100">
      {getOverlay() ||
        <PositionExpandableContent
          sections={sections}
          form={form}
          useCancelModal={false}
          saveText={isNew ? 'Create Separation' : 'Save Separation'}
        />
      }
    </div>
  );
};

Separation.propTypes = {
  data: POSITION_DETAILS.isRequired,
  isNew: PropTypes.bool,
  setNewAsgSep: PropTypes.func,
  toggleModal: PropTypes.func,
  perdet: PropTypes.string,
};

Separation.defaultProps = {
  data: {},
  isNew: false,
  setNewAsgSep: EMPTY_FUNCTION,
  toggleModal: EMPTY_FUNCTION,
  perdet: '',
};

export default Separation;
