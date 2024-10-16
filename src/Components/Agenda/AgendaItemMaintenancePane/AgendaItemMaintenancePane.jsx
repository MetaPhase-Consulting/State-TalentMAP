/* eslint-disable complexity */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InteractiveElement from 'Components/InteractiveElement';
import { filter, find, get, includes, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useDataLoader, useDidMountEffect } from 'hooks';
import BackButton from 'Components/BackButton';
import TodModal from 'Components/Agenda/AgendaLegFormEdit/TodModal';
import swal from '@sweetalert/with-react';
import FA from 'react-fontawesome';
import { AGENDA_ITEM, AI_VALIDATION, EMPTY_FUNCTION } from 'Constants/PropTypes';
import { formatDate } from 'utilities';
import { positionsFetchData } from 'actions/positions';
import { checkFlag } from 'flags';
import RemarksPill from '../RemarksPill';
import { dateTernary } from '../Constants';
import api from '../../../api';
import { FP as FrequentPositionsTabID } from '../AgendaItemResearchPane/AgendaItemResearchPane';
import SkillCodeList from '../../SkillCodeList';

const AgendaItemMaintenancePane = (props) => {
  const useAgendaItemMaintenanceCreate = () => checkFlag('flags.agenda_item_maintenance_create');

  const dispatch = useDispatch();

  const {
    onAddRemarksClick,
    perdet,
    setParentLoadingState,
    unitedLoading,
    userRemarks,
    updateSelection,
    sendMaintenancePaneInfo,
    legCount,
    saveAI,
    removeAI,
    updateFormMode,
    sendAsgSepBid,
    asgSepBidData,
    agendaItem,
    readMode,
    updateResearchPaneTab,
    setLegsContainerExpanded,
    AIvalidation,
    AIvalidationIsLoading,
    AIvalidationHasErrored,
    setIsNewSeparation,
    employee,
  } = props;

  const defaultText = '';

  const { data: statusData, error: statusError, loading: statusLoading } = useDataLoader(api().get, '/fsbid/agenda/statuses/');
  const { data: panelCatData, error: panelCatError, loading: panelCatLoading } = useDataLoader(api().get, '/fsbid/panel/reference/categories/');
  const { data: panelDatesData, error: panelDatesError, loading: panelDatesLoading } = useDataLoader(api().get, '/fsbid/panel/reference/dates/');
  const { data: todData, loading: TODLoading } = useDataLoader(api().get, '/fsbid/reference/toursofduty/');
  const { asgSepBidResults$, asgSepBidError, asgSepBidLoading } = asgSepBidData;
  const tempAsgSepBids = asgSepBidResults$ || [];
  const asgSepBids = tempAsgSepBids.filter((a) => a !== null);

  const pos_results = useSelector(state => state.positions);
  const pos_results_loading = useSelector(state => state.positionsIsLoading);
  const pos_results_errored = useSelector(state => state.positionsHasErrored);
  // local state just used for select animation
  const [validationButton, setValidationButton] = useState({});

  const statuses = get(statusData, 'data.results') || [];
  statuses.sort((a, b) => (a.desc_text > b.desc_text) ? 1 : -1);

  const TODs = todData?.data;
  const [combinedTod, setCombinedTod] = useState(agendaItem?.aiCombinedTodCode);
  const [combinedTodMonthsNum, setCombinedTodMonthsNum] =
    useState(agendaItem?.aiCombinedTodMonthsNum);
  const [combinedTodOtherText, setCombinedTodOtherText] =
    useState(agendaItem?.aiCombinedTodOtherText);

  const panelCategories = get(panelCatData, 'data.results') || [];
  const panelDates = get(panelDatesData, 'data.results') || [];

  const panelDatesML = filter(panelDates, (p) => p.pmt_code === 'ML');
  const panelDatesID = filter(panelDates, (p) => p.pmt_code === 'ID');

  const [asgSepBid, setAsgSepBid] = useState(''); // local state just used for select animation
  const [asgSepBidSelectClass, setAsgSepBidSelectClass] = useState('');

  const [selectedStatus, setStatus] = useState(agendaItem?.status_code || 'R');

  const [selectedPositionNumber, setPositionNumber] = useState('');
  const [posNumError, setPosNumError] = useState(false);
  const [inputClass, setInputClass] = useState('input-default');

  const [selectedPanelCat, setPanelCat] = useState(agendaItem?.report_category?.code || 'R');

  const calcPanelDates = () => {
    const isPanelTypeML = agendaItem?.pmt_code === 'ML';
    const isPanelTypeID = agendaItem?.pmt_code === 'ID';
    const panelMeetingSeqNum = agendaItem?.pmi_pm_seq_num || '';
    const agendaItemPanelMLSeqNum = isPanelTypeML ? panelMeetingSeqNum : '';
    const agendaItemPanelIDSeqNum = isPanelTypeID ? panelMeetingSeqNum : '';
    return { id: agendaItemPanelIDSeqNum, ml: agendaItemPanelMLSeqNum };
  };
  const [selectedPanelMLDate, setPanelMLDate] = useState(calcPanelDates()?.ml);
  const [selectedPanelIDDate, setPanelIDDate] = useState(calcPanelDates()?.id);
  const isLegacyPanelDate = () => {
    if (!panelDates.length || isEmpty(agendaItem)) return false;
    return !(panelDates.some(p => p?.pm_seq_num === agendaItem?.pmi_pm_seq_num));
  };
  const [showLegacyPanelMeetingDate, setShowLegacyPanelMeetingDate] = useState(isLegacyPanelDate());


  // ================ User Centric Data ================
  // Data is parsed differently depending on whether the data comes from agendaItem or employeeData
  // agendaItem is available during edit and employeeData is fallback used
  // on create for client users
  const { employeeData, employeeDataError, employeeDataLoading } = employee;

  const isCreate = agendaItem ? Object.keys(agendaItem).length === 0 : true;
  const userData = isCreate ? employeeData : agendaItem;

  const userLanguages = userData?.languages?.length ? userData.languages.map(
    (l) => `${l.custom_description} (${formatDate(l.test_date, 'MM/YYYY')})`).join(', ') : 'None Listed';
  const userSkill = isCreate ? <SkillCodeList skillCodes={userData?.skills} displayCodeFirst /> :
    (userData?.skills?.join(', ') || 'None Listed');
  const userCDOFirst = (isCreate ? userData?.cdos?.[0]?.cdo_first_name : userData?.cdo?.first_name) || '';
  const userCDOLast = (isCreate ? userData?.cdos?.[0]?.cdo_last_name : userData?.cdo?.last_name) || '';
  const userCDO = (userCDOFirst || userCDOLast) ? `${userCDOFirst} ${userCDOLast}` : 'None Listed';


  const createdByFirst = agendaItem?.creators?.first_name || '';
  const createdByLast = agendaItem?.creators?.last_name ? `${agendaItem.creators.last_name},` : '';
  const createDate = dateTernary(agendaItem?.creator_date);
  const modifiedByFirst = agendaItem?.updaters?.first_name || '';
  const modifiedByLast = agendaItem?.updaters?.last_name ? `${agendaItem.updaters.last_name},` : '';
  const modifyDate = dateTernary(agendaItem?.modifier_date);

  const legLimit = legCount >= 10;

  useEffect(() => {
    setParentLoadingState(includes([asgSepBidLoading,
      statusLoading, panelCatLoading, panelDatesLoading], true));
  }, [asgSepBidLoading,
    statusLoading,
    panelCatLoading,
    panelDatesLoading]);

  useDidMountEffect(() => {
    setPositionNumber('');
    if (!pos_results_loading && isEmpty(pos_results)) {
      setInputClass('input-error');
    }
  }, [pos_results, pos_results_loading]);

  useDidMountEffect(() => {
    if (pos_results_errored) {
      setPosNumError(true);
    }
  }, [pos_results_errored]);

  useEffect(() => {
    if (legLimit) {
      setInputClass('input-disabled');
    } else if (pos_results_loading) {
      setInputClass('loading-animation--3');
    } else if (posNumError) {
      setInputClass('input-error');
    } else {
      setInputClass('input-default');
    }
  }, [legCount, pos_results_loading, posNumError]);

  useEffect(() => {
    sendMaintenancePaneInfo({
      personDetailId: perdet,
      panelMeetingId: selectedPanelMLDate || selectedPanelIDDate,
      remarks: userRemarks || [],
      agendaStatusCode: selectedStatus || '',
      panelMeetingCategory: selectedPanelCat || '',
      combinedTod,
      combinedTodMonthsNum,
      combinedTodOtherText,
    });
  }, [selectedPanelMLDate,
    selectedPanelIDDate,
    userRemarks,
    selectedStatus,
    selectedPanelCat,
    combinedTod,
    combinedTodMonthsNum,
    combinedTodOtherText,
  ]);

  useEffect(() => {
    if (!isEmpty(agendaItem)) {
      // Reset form values when agenda loads
      setStatus(agendaItem?.status_code);
      setPanelCat(agendaItem?.report_category?.code);
      setPanelMLDate(calcPanelDates()?.ml);
      setPanelIDDate(calcPanelDates()?.id);
      setCombinedTod(agendaItem?.aiCombinedTodCode);
      setCombinedTodMonthsNum(agendaItem?.aiCombinedTodMonthsNum);
      setCombinedTodOtherText(agendaItem?.aiCombinedTodOtherText);
    }
  }, [agendaItem]);

  useEffect(() => {
    // Recalculate [legacy] panel meeting when agenda or dates load
    setShowLegacyPanelMeetingDate(isLegacyPanelDate());
  }, [agendaItem, panelDates]);

  useEffect(() => {
    const aiV = AIvalidation?.allValid;
    const buttonMetadata = {
      classNames: 'save-ai-btn',
      clickFunction: saveAI,
      disabled: readMode,
      text: 'Save Agenda Item',
      children: '',
    };

    if (!aiV || AIvalidationHasErrored) {
      buttonMetadata.classNames = 'ai-validation-errored';
      buttonMetadata.clickFunction = () => { };
      buttonMetadata.disabled = true;
      buttonMetadata.text = 'Item Not Saved';
    }

    if (AIvalidationIsLoading) {
      buttonMetadata.classNames = 'save-ai-btn button-tiny-loading-spinner min-width-155';
      buttonMetadata.clickFunction = () => { };
      buttonMetadata.disabled = true;
      buttonMetadata.text = 'Validating AI';
      buttonMetadata.children = (<span className="tiny-loading-spinner" />);
    }

    if (readMode) {
      buttonMetadata.classNames = 'save-ai-btn min-width-155';
      buttonMetadata.clickFunction = updateFormMode;
      buttonMetadata.disabled = !useAgendaItemMaintenanceCreate();
      buttonMetadata.text = 'Toggle to Edit Mode';
    }

    setValidationButton(buttonMetadata);
  }, [
    AIvalidation,
    AIvalidationIsLoading,
    AIvalidationHasErrored,
    readMode,
  ]);

  const addAsgSepBid = (k) => {
    setAsgSepBidSelectClass('asg-animation');
    setAsgSepBid(k);
    sendAsgSepBid(find(asgSepBids, { pos_num: k }));
    setTimeout(() => {
      setAsgSepBid('');
      sendAsgSepBid({});
      setAsgSepBidSelectClass('');
    }, 2000);
  };

  const addPositionNum = () => {
    if (!legLimit) {
      setPosNumError(false);
      if (selectedPositionNumber) {
        dispatch(positionsFetchData(`limit=50&page=1&position_num=${selectedPositionNumber}`));
      }
    }
  };

  const showPanelDatesDropdown = () => {
    setShowLegacyPanelMeetingDate(false);
    setPanelIDDate('');
    setPanelMLDate('');
  };

  const setDate = (seq_num, isML) => {
    if (isML) {
      setPanelIDDate('');
      setPanelMLDate(seq_num);
    } else {
      setPanelMLDate('');
      setPanelIDDate(seq_num);
    }
  };

  const onAddFPClick = () => {
    setLegsContainerExpanded(false);
    updateResearchPaneTab(FrequentPositionsTabID);
  };

  const submitCustomTod = (todArray, customTodMonths) => {
    const otherTodDisplaytext = todArray.map((tod, i, arr) => (i + 1 === arr.length ? tod : `${tod}/`)).join('').toString();
    setCombinedTod('X');
    setCombinedTodMonthsNum(customTodMonths);
    setCombinedTodOtherText(otherTodDisplaytext);
    swal.close();
  };

  const handleTodSelection = (value) => {
    if (value === 'X') {
      const cancel = (e) => {
        e.preventDefault();
        swal.close();
      };
      swal({
        title: 'Tour of Duty',
        closeOnEsc: true,
        button: false,
        className: 'swal-aim-custom-tod',
        content: (
          <TodModal
            cancel={cancel}
            submitCustomTod={submitCustomTod}
          />
        ),
      });
    } else {
      setCombinedTod(value);
      setCombinedTodMonthsNum('');
      setCombinedTodOtherText('');
    }
  };

  const clearOtherTod = () => {
    setCombinedTod('');
    setCombinedTodMonthsNum('');
    setCombinedTodOtherText('');
  };

  const combinedTodDropdown = () => (
    <>
      <div>
        <label className="select-label" htmlFor="ai-maintenance-combinedTOD">Combined TOD:</label>
        <select
          value={combinedTod || ''}
          disabled={readMode}
          className="aim-select aim-combined-tod"
          onChange={(e) => handleTodSelection(e.target.value)}
        >
          <option value={''}>Combined TOD</option>
          {
            TODs?.map(({ code, long_description }) => (
              <option value={code} >
                {long_description}
              </option>
            ))
          }
        </select>
      </div>
      {combinedTod === 'X' && (
        <>
          <div />
          <div className="aim-combined-tod-other-text">
            {!readMode && <FA name="times" className="other-tod-icon" onClick={clearOtherTod} />}
            {combinedTodOtherText}
          </div>
        </>
      )}
    </>
  );

  const handleAddSeparation = () => {
    setIsNewSeparation();
    setPanelCat('S');
  };
  return (
    <div className="ai-maintenance-header">
      {!unitedLoading &&
        <>
          <div className="back-save-btns-container">
            <BackButton />
            { agendaItem?.id &&
            <button
              className="delete-btn min-width-155"
              onClick={removeAI}
              disabled={agendaItem?.pmi_official_item_num}
            >
              Delete Agenda Item
            </button>
            }
            <button
              className={validationButton?.classNames}
              onClick={validationButton.clickFunction}
              disabled={validationButton?.disabled}
            >
              {validationButton?.children}
              {validationButton?.text}
            </button>
          </div>
          <div className="aim-timestamp-wrapper">
            <span className="aim-timestamp">
              {`Created: ${createdByLast} ${createdByFirst}`}
              <span className="date">{` ${agendaItem?.creator_date ? '-' : ''} ${createDate}`}</span>
            </span>
            <span className="aim-timestamp">
              {`Modified: ${modifiedByLast} ${modifiedByFirst}`}
              <span className="date">{` ${agendaItem?.modifier_date ? '-' : ''} ${modifyDate}`}</span>
            </span>
          </div>
          <div className="ai-maintenance-header-dd">
            {!statusLoading && !statusError &&
              <div>
                <label className="select-label" htmlFor="ai-maintenance-status">Status:</label>
                <div className="error-message-wrapper">
                  <div className="validation-error-message-label validation-error-message width-280">
                    {AIvalidation?.status?.errorMessage}
                  </div>
                  <select
                    className={`aim-select ${AIvalidation?.status?.valid ? '' : 'validation-error-border'}`}
                    id="ai-maintenance-status"
                    onChange={(e) => setStatus(get(e, 'target.value'))}
                    value={selectedStatus}
                    disabled={readMode}
                  >
                    <option value={''}>
                      Agenda Item Status
                    </option>
                    {
                      statuses.map(a => (
                        <option key={a.code} value={a.code}>{a.desc_text}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
            }
            {!panelCatLoading && !panelCatError &&
              <div>
                <label className="select-label" htmlFor="ai-maintenance-report-category">Report Category:</label>
                <div className="error-message-wrapper">
                  <div className="validation-error-message-label validation-error-message width-280">
                    {AIvalidation?.reportCategory?.errorMessage}
                  </div>
                  <select
                    className={`aim-select ${AIvalidation?.reportCategory?.valid ? '' : 'validation-error-border'}`}
                    id="ai-maintenance-category"
                    onChange={(e) => setPanelCat(get(e, 'target.value'))}
                    value={selectedPanelCat}
                    disabled={readMode}
                  >
                    <option value={''}>
                      Meeting Item Category
                    </option>
                    {
                      panelCategories.map(a => (
                        <option key={a.mic_code} value={get(a, 'mic_code')}>{get(a, 'mic_desc_text')}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
            }
            {!panelDatesLoading && !panelDatesError &&
              <div>
                <label className="select-label" htmlFor="ai-maintenance-date">Panel Date:</label>
                <div className="error-message-wrapper">
                  <div className="validation-error-message-label validation-error-message width-280">
                    {AIvalidation?.panelDate?.errorMessage}
                  </div>
                  {showLegacyPanelMeetingDate ?
                    <div className="read-only-pmd">
                      <span>{agendaItem?.pmt_code} {formatDate(agendaItem?.pmd_dttm)}</span>
                      {!readMode && <FA name="times" className="other-tod-icon" onClick={showPanelDatesDropdown} />}
                    </div> :
                    <div>
                      <select
                        className={`aim-select-small ${AIvalidation?.panelDate?.valid ? '' : 'validation-error-border'}`}
                        id="ai-maintenance-status"
                        onChange={(e) => setDate(get(e, 'target.value'), true)}
                        value={selectedPanelMLDate}
                        disabled={readMode}
                      >
                        <option value={''}>ML Dates</option>
                        {panelDatesML.map(a => (
                          <option
                            key={get(a, 'pm_seq_num')}
                            value={get(a, 'pm_seq_num')}
                          >
                            {get(a, 'pmt_code')} - {formatDate(get(a, 'pmd_dttm'))}
                          </option>
                        ))}
                      </select>
                      <select
                        className={`aim-select-small ${AIvalidation?.panelDate?.valid ? '' : 'validation-error-border'}`}
                        id="ai-maintenance-status"
                        onChange={(e) => setDate(get(e, 'target.value'), false)}
                        value={selectedPanelIDDate}
                        disabled={readMode}
                      >
                        <option value={''}>ID Dates</option>
                        {panelDatesID.map(a => (
                          <option
                            key={get(a, 'pm_seq_num')}
                            value={get(a, 'pm_seq_num')}
                          >
                            {get(a, 'pmt_code')} - {formatDate(get(a, 'pmd_dttm'))}
                          </option>
                        ))}
                      </select>
                    </div>
                  }
                </div>
              </div>
            }
            {!TODLoading && combinedTodDropdown()}
          </div>
          {((isCreate && !employeeDataLoading && !employeeDataError) || !isCreate) &&
            <div className="panel-meeting-agendas-user-info mt-20">
              <div className="item">
                <span className="label">Languages: </span>
                <span>{userLanguages}</span>
              </div>
              <div className="item">
                <span className="label">PP/Grade: </span>
                {userData?.combined_pp_grade}
              </div>
              <div className="item">
                <span className="label">Skill: </span>
                {userSkill}
              </div>
              <div className="item">
                <span className="label">CDO: </span>
                {userCDO}
              </div>
            </div>
          }
          <div className="remarks">
            <label htmlFor="remarks">Remarks:</label>
            <div className="remarks-container">
              <InteractiveElement
                onClick={onAddRemarksClick}
                type="span"
                role="button"
                className="save-ai-btn"
                title="Add remark"
                id="add-remark"
              >
                <FA name="plus" />
              </InteractiveElement>
              {userRemarks.map(remark => (
                <RemarksPill
                  isEditable={!readMode}
                  remark={remark}
                  key={remark.seq_num}
                  updateSelection={updateSelection}
                  fromAIM
                />
              ))}
            </div>
          </div>
          <div className="add-legs-container">
            <div className="add-legs-header">Add Legs
              <div className={`${AIvalidation?.legs?.allLegs?.valid ? 'hidden' : 'validation-error-message'}`}>
                {AIvalidation?.legs?.allLegs?.errorMessage}
              </div>
            </div>
            {!asgSepBidLoading && !asgSepBidError &&
              <select
                className={`${asgSepBidSelectClass}${legLimit ? ' asg-disabled' : ''} asg-dropdown`}
                onChange={(e) => addAsgSepBid(get(e, 'target.value'))}
                value={`${legLimit ? 'legLimit' : asgSepBid}`}
                disabled={legLimit || readMode}
              >
                <option value={''}>
                  Employee Assignments, Separations, and Bids
                </option>
                <option hidden value={'legLimit'}>
                  Leg Limit of 10 Reached
                </option>
                {asgSepBids.map((a, i) => {
                  const keyId = i;
                  return (
                    <option key={`${a.pos_title}-${keyId}`} value={a.pos_num}>
                      {/* eslint-disable-next-line react/no-unescaped-entities */}
                      '{a.status || defaultText}'
                      in {a.org || defaultText} -&nbsp;
                      {a.pos_title || defaultText}({a.pos_num || defaultText})
                    </option>
                  );
                })}
              </select>
            }
            <div className="position-number-container">
              <input
                name="add"
                className={`add-pos-num-input ${inputClass}`}
                onChange={value => setPositionNumber(value.target.value)}
                onKeyPress={e => (e.key === 'Enter' ? addPositionNum() : null)}
                type="add"
                value={`${legLimit ? 'Leg Limit of 10' : selectedPositionNumber}`}
                disabled={legLimit || readMode}
                placeholder="Add by Position Number"
              />
              <InteractiveElement
                className={`add-pos-num-icon ${(legLimit || readMode) ? 'icon-disabled' : ''}`}
                onClick={addPositionNum}
                role="button"
                title="Add position"
                type="span"
              >
                <FA name="plus" />
              </InteractiveElement>
            </div>
            <div>
              <a className="add-fp-link" aria-hidden="true" onClick={onAddFPClick}>Open Frequent Positions Tab</a>
            </div>
            <div>
              <a className="add-fp-link" aria-hidden="true" onClick={legLimit || readMode ? () => { } : handleAddSeparation}>Add New Separation</a>
            </div>
          </div>
        </>
      }
    </div>
  );
};

AgendaItemMaintenancePane.propTypes = {
  perdet: PropTypes.string.isRequired,
  asgSepBidData: PropTypes.shape({
    asgSepBidResults$: PropTypes.arrayOf(
      PropTypes.shape({}),
    ),
    asgSepBidError: PropTypes.bool,
    asgSepBidLoading: PropTypes.bool,
  }),
  onAddRemarksClick: PropTypes.func,
  setParentLoadingState: PropTypes.func,
  unitedLoading: PropTypes.bool,
  userRemarks: PropTypes.arrayOf(
    PropTypes.shape({
      seq_num: PropTypes.number,
      rc_code: PropTypes.string,
      order_num: PropTypes.number,
      short_desc_text: PropTypes.string,
      text: PropTypes.string,
      active_ind: PropTypes.string,
      remark_inserts: PropTypes.arrayOf(
        PropTypes.shape({
          rirmrkseqnum: PropTypes.number,
          riseqnum: PropTypes.number,
          riinsertiontext: PropTypes.string,
        }),
      ),
      ari_insertions: PropTypes.shape({}),
    }),
  ),
  updateSelection: PropTypes.func,
  sendMaintenancePaneInfo: PropTypes.func,
  sendAsgSepBid: PropTypes.func,
  setIsNewSeparation: PropTypes.func,
  saveAI: PropTypes.func,
  removeAI: PropTypes.func,
  legCount: PropTypes.number,
  agendaItem: AGENDA_ITEM.isRequired,
  readMode: PropTypes.bool,
  updateFormMode: PropTypes.func,
  updateResearchPaneTab: PropTypes.func,
  setLegsContainerExpanded: PropTypes.func,
  AIvalidation: AI_VALIDATION,
  AIvalidationIsLoading: PropTypes.bool,
  AIvalidationHasErrored: PropTypes.bool,
  employee: PropTypes.shape({
    employeeData: PropTypes.shape({
      user_info: PropTypes.shape({
        hru_id: PropTypes.number,
      }),
    }),
    employeeDataError: PropTypes.bool,
    employeeDataLoading: PropTypes.bool,
  }),
};

AgendaItemMaintenancePane.defaultProps = {
  asgSepBidData: {},
  onAddRemarksClick: EMPTY_FUNCTION,
  setParentLoadingState: EMPTY_FUNCTION,
  setIsNewSeparation: EMPTY_FUNCTION,
  unitedLoading: true,
  userRemarks: [],
  addToSelection: EMPTY_FUNCTION,
  updateSelection: EMPTY_FUNCTION,
  sendMaintenancePaneInfo: EMPTY_FUNCTION,
  sendAsgSepBid: EMPTY_FUNCTION,
  saveAI: EMPTY_FUNCTION,
  removeAI: EMPTY_FUNCTION,
  updateFormMode: EMPTY_FUNCTION,
  legCount: 0,
  readMode: true,
  updateResearchPaneTab: EMPTY_FUNCTION,
  setLegsContainerExpanded: EMPTY_FUNCTION,
  AIvalidation: {
    allValid: false,
  },
  AIvalidationIsLoading: false,
  AIvalidationHasErrored: false,
  employee: {},
};

export default AgendaItemMaintenancePane;
