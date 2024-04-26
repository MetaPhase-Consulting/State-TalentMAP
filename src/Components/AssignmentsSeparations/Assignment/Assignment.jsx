import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FA from 'react-fontawesome';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';
import { getResult } from 'utilities';
import { EMPTY_FUNCTION, POSITION_DETAILS } from 'Constants/PropTypes';
import {
  NO_BUREAU, NO_GRADE, NO_POSITION_NUMBER, NO_POSITION_TITLE, NO_POST,
  NO_STATUS, NO_TOUR_END_DATE, NO_VALUE,
} from 'Constants/SystemMessages';
import { altAssignmentDetailFetchData, createAssignment, updateAssignment } from 'actions/assignment';
import { positionsFetchData, resetPositionsFetchData } from 'actions/positions';
import Alert from 'Components/Alert';
import Spinner from 'Components/Spinner';
import CheckBox from 'Components/CheckBox';
import MonthYearInput from 'Components/MonthYearInput';
import InteractiveElement from 'Components/InteractiveElement';
import PositionExpandableContent from 'Components/PositionExpandableContent';

const Assignment = (props) => {
  const { perdet, data, isNew, setNewAsgSep, toggleModal } = props;

  const dispatch = useDispatch();

  // ====================== Data Retrieval ======================

  const assignmentDetails = useSelector(state => state.altAssignmentDetail);
  const assignmentsDetailsErrored = useSelector(state => state.altAssignmentDetailHasErrored);
  const assignmentsDetailsLoading = useSelector(state => state.altAssignmentDetailIsLoading);

  const statusOptions = assignmentDetails?.QRY_LSTASGS_REF;
  const actionOptions = assignmentDetails?.QRY_LSTLAT_REF;
  const todOptions = assignmentDetails?.QRY_LSTTOD_REF;
  const travelOptions = assignmentDetails?.QRY_LSTTF_REF;
  const fundingOptions = assignmentDetails?.QRY_LSTBUREAUS_REF;
  const waiverOptions = assignmentDetails?.QRY_LSTWRT_REF;

  // Asg Detail Data (Not to be confused with the Asg List)
  const asgDetail = isNew ? {} : assignmentDetails?.QRY_GETASGDTL_REF?.[0];

  useEffect(() => {
    const asgId = data?.ASG_SEQ_NUM;
    const revision_num = data?.ASGD_REVISION_NUM;
    dispatch(altAssignmentDetailFetchData(perdet, asgId, revision_num));
    return () => {
      dispatch(resetPositionsFetchData());
    };
  }, []);

  // ====================== View Mode ======================

  const sections = {
    /* eslint-disable quote-props */
    subheading: [
      { 'Position Number': getResult(data, 'POS_NUM_TXT') || NO_POSITION_NUMBER },
      { 'Position Title': getResult(data, 'POS_TITLE_TXT') || NO_POSITION_TITLE },
    ],
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

  // ====================== Edit Mode ======================

  const [editMode, setEditMode] = useState(isNew);
  const [inputClass, setInputClass] = useState('input-default');

  // ----- Position Number State Management -----

  // Position Number Search
  // For search pos results when creating new card
  const [selectedPositionNumber, setPositionNumber] = useState('');
  const pos_results = useSelector(state => state.positions);
  const pos_results_loading = useSelector(state => state.positionsIsLoading);
  const pos_results_errored = useSelector(state => state.positionsHasErrored);

  const getTOD = () => (
    pos_results?.todo_tod_code || pos_results?.bt_tod_code || ''
  );

  useEffect(() => {
    if (pos_results_loading) {
      setInputClass('loading-animation--3');
    } else if (pos_results_errored) {
      setInputClass('input-error');
    } else if (isEmpty(pos_results) && selectedPositionNumber.length) {
      setInputClass('input-error');
    } else {
      setInputClass('input-default');
    }
  }, [pos_results, pos_results_loading, pos_results_errored]);

  useEffect(() => {
    if (isNew) {
      /* eslint-disable quote-props */
      sections.subheading = [
        { 'Position Number': pos_results?.pos_num_text || NO_POSITION_NUMBER },
        { 'Position Title': pos_results?.pos_title_desc || NO_POSITION_TITLE },
        { 'Bureau': pos_results?.pos_bureau_short_desc || NO_BUREAU },
        { 'Location': pos_results?.pos_location_code || NO_POST },
        { 'Grade': pos_results?.pos_grade_code || NO_GRADE },
        { 'Pay Plan': pos_results?.pos_pay_plan_code || NO_GRADE },
      ];
      /* eslint-enable quote-props */
    }
  }, [pos_results]);

  const [status, setStatus] = useState(asgDetail?.ASGS_CODE || '');
  const [action, setAction] = useState(asgDetail?.LAT_CODE || '');
  const [ted, setTED] = useState(asgDetail?.ASGD_ETD_TED_DATE);
  const [eta, setETA] = useState(asgDetail?.ASGD_ETA_DATE);
  const [tod, setTOD] = useState(isNew ? getTOD() : (asgDetail?.TOD_CODE || ''));
  const [travel, setTravel] = useState(asgDetail?.TF_CD || '');
  const [funding, setFunding] = useState(asgDetail?.ASGD_ORG_CODE);
  const [adj, setAdj] = useState('');
  const [salaryReimbursement, setSalaryReimbursement] = useState(asgDetail?.ASGD_SALARY_REIMBURSE_IND === 'Y');
  const [travelReimbursement, setTravelReimbursement] = useState(asgDetail?.ASGD_TRAVEL_REIMBURSE_IND === 'Y');
  const [training, setTraining] = useState(asgDetail?.ASGD_TRIANING_IND === 'Y');
  const [criticalNeed, setCriticalNeed] = useState(asgDetail?.ASGD_CRITICAL_NEED_IND === 'Y');
  const [waiver, setWaiver] = useState(asgDetail?.WRT_CODE_RR_REPAY || '');
  const [sent, setSent] = useState(asgDetail?.NOTE_LAST_SENT_DATE);

  useEffect(() => {
    setStatus(asgDetail?.ASGS_CODE || '');
    setAction(asgDetail?.LAT_CODE || '');
    setTED(asgDetail?.ASGD_ETD_TED_DATE);
    setETA(asgDetail?.ASGD_ETA_DATE);
    setTOD(isNew ? getTOD() : (asgDetail?.TOD_CODE || ''));
    setTravel(asgDetail?.TF_CD || '');
    setFunding(asgDetail?.ASGD_ORG_CODE);
    setAdj('');
    setSalaryReimbursement(asgDetail?.ASGD_SALARY_REIMBURSE_IND === 'Y');
    setTravelReimbursement(asgDetail?.ASGD_TRAVEL_REIMBURSE_IND === 'Y');
    setTraining(asgDetail?.ASGD_TRIANING_IND === 'Y');
    setCriticalNeed(asgDetail?.ASGD_CRITICAL_NEED_IND === 'Y');
    setWaiver(asgDetail?.WRT_CODE_RR_REPAY || '');
    setSent(asgDetail?.NOTE_LAST_SENT_DATE);
  }, []);

  const onSubmitForm = () => {
    const formValues = {
      asg_seq_num: asgDetail?.ASG_SEQ_NUM,
      asgd_revision_num: asgDetail?.ASGD_REVISION_NUM,
      eta,
      etd: ted,
      tod,
      salary_reimburse_ind: salaryReimbursement,
      travel_reimburse_ind: travelReimbursement,
      training_ind: training,
      critical_need_ind: criticalNeed,
      org_code: funding,
      status_code: status,
      lat_code: action,
      travel_code: travel,
      rr_repay_ind: waiver,
      update_date: asgDetail?.ASGD_UPDATE_DATE,
    };
    if (isNew) {
      dispatch(createAssignment({
        ...formValues,
      }, perdet));
    } else {
      dispatch(updateAssignment({
        ...formValues,
      }, perdet));
    }
    if (isNew) toggleModal(false);
    setNewAsgSep('default');
  };

  const addPositionNum = () => {
    if (selectedPositionNumber) {
      dispatch(positionsFetchData(`limit=50&page=1&position_num=${selectedPositionNumber}`));
    }
  };

  const form = {
    /* eslint-disable quote-props */
    staticBody: [
      { 'Position Number': getResult(data, 'POS_NUM_TXT') || NO_POSITION_NUMBER },
      { 'Position Title': getResult(data, 'POS_TITLE_TXT') || NO_POSITION_TITLE },
      { 'Bureau': getResult(data, 'ORGS_SHORT_DESC') || NO_BUREAU },
      { 'Location': getResult(data, 'POS_LOCATION_CODE') || NO_POST },
      { 'Grade': getResult(data, 'GRD_CD') || NO_GRADE },
      { 'Pay Plan': getResult(data, 'PPL_CODE') || NO_GRADE },
    ],
    inputBody:
      <div className="position-form">
        <div className="position-form--inputs">
          {isNew &&
            <div className="position-form--label-input-container position-number-container">
              <label htmlFor="pos-num">Position Number</label>
              <input
                id="pos-num"
                name="add"
                className={inputClass}
                onChange={value => setPositionNumber(value.target.value)}
                onKeyPress={e => (e.key === 'Enter' ? addPositionNum() : null)}
                type="add"
                value={selectedPositionNumber}
                placeholder="Add by Position Number"
              />
              <InteractiveElement
                className="add-pos-num-icon"
                onClick={addPositionNum}
                role="button"
                title="Add position"
                type="span"
              >
                <FA name="plus" />
              </InteractiveElement>
            </div>
          }
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
            <label htmlFor="ETA">ETA</label>
            <MonthYearInput value={eta} onChange={setETA} />
          </div>
          <div className="position-form--label-input-container">
            <label htmlFor="TED">TED</label>
            <MonthYearInput value={ted} onChange={setTED} />
          </div>
          <div className="position-form--label-input-container">
            <label htmlFor="assignment-tod">Tour of Duty</label>
            <select
              id="assignment-tod"
              value={tod}
              onChange={(e) => setTOD(e?.target.value)}
            >
              <option value="" disabled>
                Select TOD
              </option>
              {todOptions?.map(t => (
                <option value={t.TOD_CODE}>
                  {t.TOD_DESC_TEXT}
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
            <label htmlFor="assignment-funding">Alt Funding</label>
            <select
              id="assignment-funding"
              value={funding}
              onChange={(e) => setFunding(e?.target.value)}
            >
              <option value="" disabled>
                Select Funding Org
              </option>
              {fundingOptions?.map(f => (
                <option value={f.ORG_CODE}>
                  {f.ORGS_SHORT_DESC}
                </option>
              ))}
            </select>
          </div>
          <div className="position-form--label-input-container">
            <label htmlFor="assignment-adj">ADJ</label>
            <input
              id="assignment-adj"
              value={adj}
              onChange={(e) => setAdj(e?.target.value)}
            />
          </div>
          <div className="position-form--label-input-container height-80">
            <CheckBox
              id={`salary-reimbursement-${data.id ?? 'create'}`}
              label="Salary Reimbursement"
              value={salaryReimbursement}
              className="mt-40"
              excludeTmCheckboxClass
              onChange={() => setSalaryReimbursement(!salaryReimbursement)}
            />
          </div>
          <div className="position-form--label-input-container height-80">
            <CheckBox
              id={`travel-reimbursement-${data.id ?? 'create'}`}
              label="Travel Reimbursement"
              value={travelReimbursement}
              className="mt-40"
              excludeTmCheckboxClass
              onChange={() => setTravelReimbursement(!travelReimbursement)}
            />
          </div>
          <div className="position-form--label-input-container height-80">
            <CheckBox
              id={`training-${data.id ?? 'create'}`}
              label="Training"
              value={training}
              className="mt-40"
              excludeTmCheckboxClass
              onChange={() => setTraining(!training)}
            />
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
            <label htmlFor="assignment-sent">Sent</label>
            <input
              id="assignment-sent"
              value={sent}
              onChange={(e) => setSent(e?.target.value)}
            />
          </div>
        </div>
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
    if (isNew && assignmentsDetailsLoading) {
      overlay = <Spinner type="standard-center" size="small" />;
    } else if (isNew && assignmentsDetailsErrored) {
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
          saveText={isNew ? 'Create Assignment' : 'Save Assigment'}
        />
      }
    </div>
  );
};

Assignment.propTypes = {
  data: POSITION_DETAILS.isRequired,
  isNew: PropTypes.bool,
  cycle: PropTypes.shape({
    cycle_name: PropTypes.string,
  }).isRequired,
  setNewAsgSep: PropTypes.func,
  toggleModal: PropTypes.func,
  perdet: PropTypes.string,
};

Assignment.defaultProps = {
  data: {},
  isNew: false,
  setNewAsgSep: EMPTY_FUNCTION,
  toggleModal: EMPTY_FUNCTION,
  perdet: '',
};

export default Assignment;