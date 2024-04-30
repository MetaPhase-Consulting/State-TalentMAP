import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import FA from 'react-fontawesome';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { useDataLoader } from 'hooks';
import { getResult } from 'utilities';
import { EMPTY_FUNCTION, POSITION_DETAILS } from 'Constants/PropTypes';
import { NO_STATUS, NO_VALUE } from 'Constants/SystemMessages';
import { resetPositionsFetchData } from 'actions/positions';
import { assignmentSeparationAction } from 'actions/assignment';
import Alert from 'Components/Alert';
import Spinner from 'Components/Spinner';
import CheckBox from 'Components/CheckBox';
import TMDatePicker from 'Components/TMDatePicker';
import InteractiveElement from 'Components/InteractiveElement';
import PositionExpandableContent from 'Components/PositionExpandableContent';
import GsaLocations from 'Components/Agenda/AgendaItemResearchPane/GsaLocations';
import api from '../../../api';

const Separation = (props) => {
  const { perdet, data, isNew, setNewAsgSep, toggleModal, onEditMode, disableEdit } = props;

  const dispatch = useDispatch();

  // ====================== Data Retrieval ======================

  const sepId = data?.SEP_SEQ_NUM;
  const revision_num = data?.SEPD_REVISION_NUM;

  const [refetch, setRefetch] = useState(true);
  const { data: results, loading: isLoading, error: errored } = useDataLoader(
    api().get,
    `/fsbid/assignment_history/${perdet}/separations/${sepId}/?revision_num=${revision_num}`,
    true,
    undefined,
    refetch,
  );

  const separationDetails = results?.data;
  const separationDetailsErrored = errored;
  const separationDetailsLoading = isLoading;

  const statusOptions = separationDetails?.QRY_LSTASGS_REF;
  const actionOptions = separationDetails?.QRY_LSTLAT_REF;
  const travelOptions = separationDetails?.QRY_LSTTF_REF;
  const waiverOptions = separationDetails?.QRY_LSTWRT_REF;

  useEffect(() => {
    dispatch(resetPositionsFetchData());
  }, []);

  // ====================== View Mode ======================

  const sections = {
    /* eslint-disable quote-props */
    bodyPrimary: [
      { 'Status': getResult(data, 'ASGS_CODE') || NO_STATUS },
      { 'Action': getResult(data, 'LAT_CODE') || NO_VALUE },
      { 'Waiver': getResult(data, 'WRT_CODE_RR_REPAY') || NO_VALUE },
      { 'Travel': get(data, 'TF_CD') || NO_VALUE },
      { 'Separation Date': getResult(data, 'SEPD_SEPARATION_DATE') || NO_VALUE },
      { 'US Indicator': getResult(data, 'SEPD_US_IND') || NO_VALUE },
      { 'Panel Meeting Date': getResult(data, 'PMD_DTTM') || NO_VALUE },
      { 'Location': get(data, 'location') || NO_VALUE }, // TODO: format location string
    ],
    /* eslint-enable quote-props */
  };

  if (!isNew) {
    /* eslint-disable quote-props */
    sections.subheading = [
      { 'Name': data?.EMP_FULL_NAME || NO_VALUE },
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
    if (editMode) {
      onEditMode(editMode, sepId);
      setStatus(data?.ASGS_CODE || '');
      setAction(data?.LAT_CODE || '');
      setWaiver(data?.WRT_CODE_RR_REPAY || '');
      setTravel(data?.TF_CD || '');
      setSeparationDate(data?.SEPD_SEPARATION_DATE ?
        new Date(data?.SEPD_SEPARATION_DATE) : null);
      setUsIndicator(data?.SEPD_US_IND === 'Y');
      setPanelMeetingDate(data?.PMD_DTTM ? new Date(data?.PMD_DTTM) : null);
      setLocation(null);
    }
  }, [editMode]);

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
      location_code: null,
      separation_date: separationDate,
      city_text: location?.city || null,
      country_state_text: (state && country) ? `${state}, ${country}` : state || country || null,
      us_ind: usIndicator ? 'Y' : 'N',
      status_code: status,
      travel_code: travel,
      rr_repay_ind: waiver,
      note: null,
    };
    if (isNew) {
      dispatch(assignmentSeparationAction(
        {
          ...formValues,
          employee: null,
        },
        perdet,
        null, // Use Create Endpoint (No Seq Num)
        true, // Use Separation Endpoint
      ));
    } else {
      dispatch(assignmentSeparationAction(
        {
          ...formValues,
          sep_seq_num: null,
          updater_id: null,
          updated_date: null,
          sep_revision_number: null,
        },
        perdet,
        sepId, // Use Update Endpoint (Has Seq Num)
        true, // Use Separation Endpoint
        () => setRefetch(!refetch), // Refetch Details on Success
      ));
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
                <option key={s.ASGS_CODE} value={s.ASGS_CODE}>
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
                <option key={a.LAT_CODE} value={a.LAT_CODE}>
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
                <option key={w.WRT_CODE} value={w.WRT_CODE}>
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
                <option key={t.TF_CODE} value={t.TF_CODE}>
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
              disabled
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
      disableEdit,
    },
    // TO-DO: DIP, MEMO, NOTE
    /* eslint-enable quote-props */
  };

  const getOverlay = () => {
    let overlay;
    if (separationDetailsLoading) {
      overlay = <Spinner type="standard-center" size="small" />;
    } else if (separationDetailsErrored) {
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
  onEditMode: PropTypes.func,
  disableEdit: PropTypes.bool,
};

Separation.defaultProps = {
  data: {},
  isNew: false,
  setNewAsgSep: EMPTY_FUNCTION,
  toggleModal: EMPTY_FUNCTION,
  perdet: '',
  onEditMode: EMPTY_FUNCTION,
  disableEdit: false,
};

export default Separation;
