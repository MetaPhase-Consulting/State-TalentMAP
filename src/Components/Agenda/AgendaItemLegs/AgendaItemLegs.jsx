import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import InteractiveElement from 'Components/InteractiveElement';
import { filter, get, includes } from 'lodash';
import PropTypes from 'prop-types';
import { useDataLoader } from 'hooks';
import BackButton from 'Components/BackButton';
import FA from 'react-fontawesome';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';
import { formatDate } from 'utilities';
import { aihAddLeg } from 'actions/agendaItemMaintenancePane';
import RemarksPill from '../RemarksPill';
import api from '../../../api';

const AgendaItemMaintenancePane = (props) => {
  const dispatch = useDispatch();

  const {
    onAddRemarksClick,
    perdet,
    setParentState,
    unitedLoading,
    userSelections,
    leftExpanded,
    updateSelection,
  } = props;

  const defaultText = 'Coming Soon';

  const { data: asgSepBidData, error: asgSepBidError, loading: asgSepBidLoading } = useDataLoader(api().get, `/fsbid/employee/assignments_separations_bids/${perdet}/`);
  const { data: statusData, error: statusError, loading: statusLoading } = useDataLoader(api().get, '/fsbid/agenda/statuses/');
  const { data: panelCatData, error: panelCatError, loading: panelCatLoading } = useDataLoader(api().get, '/panel/categories/');
  const { data: panelDatesData, error: panelDatesError, loading: panelDatesLoading } = useDataLoader(api().get, '/panel/dates/');

  useEffect(() => {
    setParentState(includes([asgSepBidLoading,
      statusLoading, panelCatLoading, panelDatesLoading], true));
  }, [asgSepBidLoading,
    statusLoading,
    panelCatLoading,
    panelDatesLoading]);

  const asgSepBids = get(asgSepBidData, 'data') || [];
  const statuses = get(statusData, 'data.results') || [];
  const panelCategories = get(panelCatData, 'data.results') || [];
  const panelDates = get(panelDatesData, 'data.results') || [];

  const panelDatesML = filter(panelDates, (p) => p.pmt_code === 'ML');
  const panelDatesID = filter(panelDates, (p) => p.pmt_code === 'ID');

  const [asgSepBid, setAsgSepBid] = useState(filter(asgSepBids, ['status', 'EF']));
  const [selectedStatus, setStatus] = useState(get(statuses, '[0].code'));
  const [selectedPositionNumber, setPositionNumber] = useState();
  const [selectedPanelCat, setPanelCat] = useState(get(panelCategories, '[0].mic_code'));
  const [selectedPanelMLDate, setPanelMLDate] = useState();
  const [selectedPanelIDDate, setPanelIDDate] = useState();

  const saveAI = () => {
    // eslint-disable-next-line
    console.log('save AI');
  };

  // special handling for position number
  const addPositionNum = () => {
    // eslint-disable-next-line no-console
    console.log('current: selectedPositionNumber', selectedPositionNumber);
    const aiseqnum = 12345;
    if (selectedPositionNumber) {
      dispatch(aihAddLeg(selectedPositionNumber, aiseqnum));
    }
    // send off request
    setPositionNumber('');
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

  return (
    <div className="ai-maintenance-header">
      { !unitedLoading &&
            <>
              <div className={`back-save-btns-container ${leftExpanded ? ' half-width' : ''}`}>
                <BackButton />
                <button className="save-ai-btn" onClick={saveAI}>
                  Save Agenda Item
                </button>
              </div>
              <div className={`ai-maintenance-header-dd ${leftExpanded ? ' half-width' : ''}`}>
                {
                  !asgSepBidLoading && !asgSepBidError &&
                    <select
                      id="ai-maintenance-dd-asgSepBids"
                      defaultValue={asgSepBids}
                      onChange={(e) => setAsgSepBid(get(e, 'target.pos_num'))}
                      value={asgSepBid}
                    >
                      <option selected hidden>
                        Employee Assignments, Separations, and Bids
                      </option>
                      {
                        asgSepBids.map(a => (
                          <option key={a.pos_num} value={a.pos_num}>
                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                            {a.name || defaultText} '{a.status || defaultText}'
                              in {a.org || defaultText} -
                            {a.pos_title || defaultText}({a.pos_num || defaultText})
                          </option>
                        ))
                      }
                    </select>
                }
                {
                  !statusLoading && !statusError &&
                    <div>
                      <label htmlFor="ai-maintenance-status">Status:</label>
                      <select
                        id="ai-maintenance-status"
                        defaultValue={selectedStatus}
                        onChange={(e) => setStatus(get(e, 'target.value'))}
                        value={selectedStatus}
                      >
                        {
                          statuses.map(a => (
                            <option key={a.code} value={a.code}>{a.desc_text}</option>
                          ))
                        }
                      </select>
                    </div>
                }
                <div>
                  <label htmlFor="position number">Add Position Number:</label>
                  <input
                    id="add-pos-num-input"
                    name="add"
                    onChange={value => setPositionNumber(value.target.value)}
                    type="add"
                    value={selectedPositionNumber}
                  />
                  <InteractiveElement
                    id="add-pos-num-icon"
                    onClick={addPositionNum}
                    role="button"
                    title="Add position"
                    type="span"
                  >
                    <FA name="plus" />
                  </InteractiveElement>
                </div>
                {
                  !panelCatLoading && !panelCatError &&
                    <div>
                      <label htmlFor="ai-maintenance-status">Report Category:</label>
                      <select
                        id="ai-maintenance-category"
                        defaultValue={selectedPanelCat}
                        onChange={(e) => setPanelCat(get(e, 'target.mic_code'))}
                        value={selectedPanelCat}
                      >
                        {
                          panelCategories.map(a => (
                            <option value={get(a, 'mic_code')}>{get(a, 'mic_desc_text')}</option>
                          ))
                        }
                      </select>
                    </div>
                }
                {
                  !panelDatesLoading && !panelDatesError &&
                    <div>
                      <label htmlFor="ai-maintenance-date">Panel Date:</label>
                      <select
                        id="ai-maintenance-status"
                        onChange={(e) => setDate(get(e, 'target.value'), true)}
                        value={selectedPanelMLDate}
                      >
                        <option>Panel Dates - ML</option>
                        {
                          panelDatesML.map(a => (
                            <option
                              key={get(a, 'pm_seq_num')}
                              value={get(a, 'pm_seq_num')}
                            >
                              {get(a, 'pmt_code')} - {formatDate(get(a, 'pmd_dttm'))}
                            </option>
                          ))
                        }
                      </select>
                      <select
                        id="ai-maintenance-status"
                        onChange={(e) => setDate(get(e, 'target.value'), false)}
                        value={selectedPanelIDDate}
                      >
                        <option>Panel Dates - ID</option>
                        {
                          panelDatesID.map(a => (
                            <option
                              key={get(a, 'pm_seq_num')}
                              value={get(a, 'pm_seq_num')}
                            >
                              {get(a, 'pmt_code')} - {formatDate(get(a, 'pmd_dttm'))}
                            </option>
                          ))
                        }
                      </select>
                    </div>
                }
              </div>
              <div className="usa-form remarks">
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
                  {
                    userSelections.map(remark => (
                      <RemarksPill
                        isEditable
                        remark={remark}
                        key={remark.seq_num}
                        updateSelection={updateSelection}
                      />
                    ))
                  }
                </div>
              </div>
              <div className="usa-form corrections">
                <label htmlFor="corrections">Corrections:</label>
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Ut tincidunt tincidunt imperdiet. Proin nisi diam, tincidunt rhoncus placerat
                  et, fringilla non ligula. Suspendisse sed nibh nisl. Cras varius lacinia
                </div>
              </div>
            </>
      }
    </div>
  );
};

AgendaItemMaintenancePane.propTypes = {
  leftExpanded: PropTypes.bool,
  onAddRemarksClick: PropTypes.func,
  perdet: PropTypes.string.isRequired,
  setParentState: PropTypes.func,
  unitedLoading: PropTypes.bool,
  userSelections: PropTypes.arrayOf(
    PropTypes.shape({
      seq_num: PropTypes.number,
      rc_code: PropTypes.string,
      order_num: PropTypes.number,
      short_desc_text: PropTypes.string,
      mutually_exclusive_ind: PropTypes.string,
      text: PropTypes.string,
      active_ind: PropTypes.string,
    }),
  ),
  updateSelection: PropTypes.func,
};

AgendaItemMaintenancePane.defaultProps = {
  leftExpanded: false,
  onAddRemarksClick: EMPTY_FUNCTION,
  setParentState: EMPTY_FUNCTION,
  unitedLoading: true,
  userSelections: [],
  addToSelection: EMPTY_FUNCTION,
  updateSelection: EMPTY_FUNCTION,
};

export default AgendaItemMaintenancePane;
