import { useEffect, useRef, useState } from 'react';
import FontAwesome from 'react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'react-tippy';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import InteractiveElement from 'Components/InteractiveElement';
import { drop, filter, find, get, has, isEmpty } from 'lodash';
import MediaQuery from 'Components/MediaQuery';
import Spinner from 'Components/Spinner';
import { HISTORY_OBJECT } from 'Constants/PropTypes';
import { Link } from 'react-router-dom';
import { fetchAI, modifyAgenda, removeAgenda, resetAIValidation, resetCreateAI, validateAI } from 'actions/agendaItemMaintenancePane';
import { useDataLoader, usePrevious } from 'hooks';
import { isAfter } from 'date-fns';
import shortid from 'shortid';
import Alert from 'Components/Alert';
import AgendaItemResearchPane from '../AgendaItemResearchPane';
import AgendaItemMaintenancePane from '../AgendaItemMaintenancePane';
import AgendaItemTimeline from '../AgendaItemTimeline';
import { RG as RemarksGlossaryTabID } from '../AgendaItemResearchPane/AgendaItemResearchPane';
import api from '../../../api';

const AgendaItemMaintenanceContainer = (props) => {
  const dispatch = useDispatch();
  const researchPaneRef = useRef();

  // Route parameters
  const routeAgendaID = props?.match.params.agendaID || '';
  const routeEmployeeID = props?.match.params.id;

  // Validation States
  const AIvalidationHasErrored = useSelector(state => state.validateAIHasErrored);
  const AIvalidationIsLoading = useSelector(state => state.validateAIIsLoading);
  const AIvalidation = useSelector(state => state.aiValidation);

  // Agenda Data States
  const agendaItemData = useSelector(state => state.fetchAISuccess);
  const agendaItemLoading = useSelector(state => state.fetchAIIsLoading);
  const agendaItemError = useSelector(state => state.fetchAIHasErrored);
  const blankAgendaItem = {};
  // Only use Agenda Item state if route is edit, otherwise blank for create
  const agendaItemData$ = routeAgendaID ? agendaItemData : blankAgendaItem;

  // Create/Edit - False or returns an ID on success
  const aiModifySuccessID = useSelector(state => state.ai);
  const aiModifyIsLoading = useSelector(state => state.aiModifyIsLoading);
  const aiModifyHasErrored = useSelector(state => state.aiModifyHasErrored);
  const prevAIModifySuccessID = usePrevious(aiModifySuccessID);

  const isCDO = get(props, 'isCDO');

  // Employee Meta Data Handling
  const { data: employeeData, error: employeeDataError, loading: employeeDataLoading } = useDataLoader(api().get, `/fsbid/client/${routeEmployeeID}/`);
  const { data: employeeDataFallback, error: employeeDataFallbackError, loading: employeeDataFallbackLoading } = useDataLoader(api().get, `/fsbid/persons/${routeEmployeeID}`);
  const employeeLoading = employeeDataLoading || employeeDataFallbackLoading;
  const employeeError = employeeDataError && employeeDataFallbackError;
  const employeeData$ = employeeData?.data || employeeDataFallback?.data?.results?.[0];
  const employeeName = employeeLoading ? '' : employeeData$?.name;

  // handles error where some employees have no Profile
  const employeeHasCDO = employeeLoading ? false : !!(employeeData$?.cdo?.name);

  // Employee Asg, Sep, and Bids
  const { data: asgSepBidResults, error: asgSepBidError, loading: asgSepBidLoading } = useDataLoader(api().get, `/fsbid/employee/assignments_separations_bids/${routeEmployeeID}/`);
  const asgSepBidResults$ = get(asgSepBidResults, 'data') || [];
  const asgSepBidData = { asgSepBidResults$, asgSepBidError, asgSepBidLoading };

  // Legs Form Data
  const { data: todData, loading: TODLoading } = useDataLoader(api().get, '/fsbid/reference/toursofduty/');
  const { data: legATData, loading: legATLoading } = useDataLoader(api().get, '/fsbid/agenda/leg_action_types/');
  const { data: travelFData, loading: travelFLoading } = useDataLoader(api().get, '/fsbid/reference/travelfunctions/');
  const legsData = { todData, TODLoading, legATData, legATLoading, travelFData, travelFLoading };
  const legsFormLoading = TODLoading || legATLoading || travelFLoading;

  // if there is no Client data, then we have to make an additional call for the hru_id
  const empData = !employeeData?.data && !employeeDataLoading;
  const { data: userInfoData, error: userInfoError, loading: userInfoLoading } = useDataLoader(api().get, `/fsbid/employee/${routeEmployeeID}/user_info/`, empData);
  if (userInfoData?.data && !userInfoError && !userInfoLoading) {
    employeeData$.user_info = { ...userInfoData?.data };
  }

  // Utility to find employee's most recent effective detail on which agenda is based
  const findEffectiveAsgOrSep = (asgAndSep) => {
    let max;
    asgAndSep.forEach(a => {
      if (a?.status === 'Effective') {
        if (!max) max = a;
        if (isAfter(new Date(a?.eta), new Date(max?.eta))) {
          max = a;
        }
      }
    });
    return max;
  };

  // Effective Position is the first 'leg' from TMAP API (if agenda already exists)
  // Otherwise use utility to find most recent to use in create form
  const efPosition = get(agendaItemData$, 'legs[0]') || findEffectiveAsgOrSep(asgSepBidResults$) || {};

  const agendaItemLegs = drop(get(agendaItemData$, 'legs')) || [];
  const agendaItemLegs$ = agendaItemLegs.map(ail => ({
    ...ail,
    ail_seq_num: get(ail, 'ail_seq_num') || shortid.generate(),
  }));

  const agendaItemRemarks = get(agendaItemData$, 'remarks') || [];
  const [legsContainerExpanded, setLegsContainerExpanded] = useState(false);
  const [agendaItemMaintenancePaneLoading, setAgendaItemMaintenancePaneLoading] = useState(true);
  const [agendaItemTimelineLoading, setAgendaItemTimelineLoading] = useState(true);
  const [legs, setLegs] = useState([]);
  const [maintenanceInfo, setMaintenanceInfo] = useState([]);
  const [asgSepBid, setAsgSepBid] = useState({}); // pass through from AIMPane to AITimeline
  const [isNewSeparation, setIsNewSeparation] = useState(false);
  const [userRemarks, setUserRemarks] = useState(agendaItemRemarks);
  const [spinner, setSpinner] = useState(true);
  const [location, setLocation] = useState();
  const [activeAIL, setActiveAIL] = useState();
  const [readMode, setReadMode] = useState(true);


  const updateSelection = (remark, textInputs) => {
    const userRemarks$ = [...userRemarks];

    const found = find(userRemarks$, { seq_num: remark.seq_num });
    if (!found) {
      const remark$ = { ...remark };

      if (has(remark$, 'remark_inserts')) {
        const tempKey = (remark$.seq_num).toString();
        if (!remark$.ari_insertions) {
          remark$.ari_insertions = {};
        }
        remark$.ari_insertions = textInputs[tempKey];
      }

      remark$.user_remark_inserts = [];
      remark$.remark_inserts.forEach(ri => (remark$.user_remark_inserts.push({
        airiinsertiontext: textInputs[ri.rirmrkseqnum][ri.riseqnum],
        airirmrkseqnum: ri.rirmrkseqnum,
        aiririseqnum: ri.riseqnum,
      })));

      userRemarks$.push(remark$);
      setUserRemarks(userRemarks$);
    } else {
      setUserRemarks(filter(userRemarks$, (r) => r.seq_num !== remark.seq_num));
    }
  };

  const submitAI = () => {
    const personId = employeeData$?.id || routeEmployeeID;
    const efInfo = {
      assignmentId: get(efPosition, 'asg_seq_num'),
      assignmentVersion: get(efPosition, 'revision_num'),
    };
    dispatch(modifyAgenda(maintenanceInfo, legs, personId, efInfo, agendaItemData$));
  };

  const removeAI = () => {
    const data = {
      aiseqnum: agendaItemData$?.id,
      aiupdatedate: agendaItemData$?.modifier_date,
    };
    dispatch(removeAgenda(data));
  };

  const updateFormMode = () => {
    setReadMode(false);
  };

  function toggleExpand() {
    setLegsContainerExpanded(!legsContainerExpanded);
  }

  const rotate = legsContainerExpanded ? 'rotate(0)' : 'rotate(-180deg)';

  const updateResearchPaneTab = tabID => {
    researchPaneRef.current.setSelectedNav(tabID);
  };

  const openRemarksResearchTab = () => {
    setLegsContainerExpanded(false);
    updateResearchPaneTab(RemarksGlossaryTabID);
  };

  // Reset AI edit/create state on first render
  // First render does not need success state since user is starting create/edit
  useEffect(() => {
    dispatch(resetCreateAI());
    return () => dispatch(resetCreateAI()); // On unmount
  }, []);

  useEffect(() => {
    if (routeAgendaID) {
      // Hydrate the agenda data if our route includes an agenda id
      // Re-hydrate on successful modify agenda calls
      dispatch(fetchAI(routeAgendaID));
    } else if (aiModifySuccessID && !prevAIModifySuccessID &&
      !aiModifyIsLoading && !aiModifyHasErrored) {
      // Replace the create route with edit route if AI create state is truthy
      // and previous state was empty aka in create form
      props.history.replace(`/profile/${isCDO ? 'cdo' : 'ao'}/editagendaitem/${routeEmployeeID}/${aiModifySuccessID}`);
    }
  }, [routeAgendaID, aiModifySuccessID]);

  useEffect(() => {
    if (!readMode) {
      const personId = employeeData$?.id || routeEmployeeID;
      const efInfo = {
        assignmentId: get(efPosition, 'asg_seq_num'),
        assignmentVersion: get(efPosition, 'revision_num'),
      };
      dispatch(validateAI(maintenanceInfo, legs, personId, efInfo));
    } else {
      dispatch(resetAIValidation());
    }
  }, [maintenanceInfo, legs, readMode]);

  useEffect(() => {
    if (!agendaItemMaintenancePaneLoading && !agendaItemTimelineLoading && !legsFormLoading) {
      setSpinner(false);
    }
  }, [agendaItemMaintenancePaneLoading, agendaItemTimelineLoading, legsFormLoading]);

  useEffect(() => {
    if (!agendaItemLoading) {
      // If not creating a new AI, then we default initial mode to Read
      setReadMode(!isEmpty(agendaItemData$));
    }
  }, [agendaItemLoading]);

  useEffect(() => {
    // Update user remarks state anytime agenda item data changes
    setUserRemarks(agendaItemRemarks);
  }, [agendaItemData]);

  return (
    <>
      <div className="aim-header-container">
        <div className="aim-title-container">
          <FontAwesome
            name="user-circle-o"
            size="lg"
          />
          Agenda Item Maintenance
          {
            employeeHasCDO ?
              <span className="aim-title-dash">
                {'- '}
                <Link to={`/profile/public/${routeEmployeeID}${isCDO ? '' : '/ao'}`}>
                  <span className="aim-title">
                    {`${employeeName}`}
                  </span>
                </Link>
              </span>
              :
              <span>
                {` - ${employeeName}`}
              </span>
          }
        </div>
      </div>
      <MediaQuery breakpoint="screenXlgMin" widthType="max">
        {matches => (
          <div className={`ai-maintenance-container${matches ? ' stacked' : ''} ${readMode ? 'aim-disabled' : ''}`}>
            <div className={`maintenance-container-left${(legsContainerExpanded || matches) ? '-expanded' : ''}`}>
              {
                spinner &&
                <Spinner type="left-pane" size="small" />
              }
              {
                !agendaItemLoading &&
                <>
                  {
                    (agendaItemError && routeAgendaID !== '') ?
                      <Alert type="error" title="Error loading Agenda Item Maintenance Data" messages={[{ body: 'Please try again.' }]} /> :
                      <>
                        <AgendaItemMaintenancePane
                          onAddRemarksClick={openRemarksResearchTab}
                          perdet={routeEmployeeID}
                          unitedLoading={spinner}
                          setParentLoadingState={setAgendaItemMaintenancePaneLoading}
                          updateSelection={readMode ? () => { } : updateSelection}
                          sendMaintenancePaneInfo={setMaintenanceInfo}
                          sendAsgSepBid={setAsgSepBid}
                          asgSepBidData={asgSepBidData}
                          setIsNewSeparation={() => setIsNewSeparation(!isNewSeparation)}
                          userRemarks={userRemarks}
                          legCount={legs.length}
                          saveAI={submitAI}
                          removeAI={removeAI}
                          updateFormMode={updateFormMode}
                          agendaItem={agendaItemData$}
                          readMode={readMode}
                          updateResearchPaneTab={updateResearchPaneTab}
                          setLegsContainerExpanded={setLegsContainerExpanded}
                          AIvalidation={AIvalidation}
                          AIvalidationIsLoading={AIvalidationIsLoading}
                          AIvalidationHasErrored={AIvalidationHasErrored}
                          employee={{
                            employeeData: employeeData$,
                            employeeDataError,
                            employeeDataLoading,
                          }}
                        />
                        <AgendaItemTimeline
                          unitedLoading={spinner}
                          setParentLoadingState={setAgendaItemTimelineLoading}
                          updateLegs={setLegs}
                          asgSepBid={asgSepBid}
                          activeAIL={activeAIL}
                          setActiveAIL={setActiveAIL}
                          location={location}
                          setLocation={setLocation}
                          efPos={efPosition}
                          agendaItemLegs={agendaItemLegs$}
                          isNewSeparation={isNewSeparation}
                          updateResearchPaneTab={updateResearchPaneTab}
                          setLegsContainerExpanded={setLegsContainerExpanded}
                          fullAgendaItemLegs={agendaItemData$?.legs || []}
                          readMode={readMode}
                          AIvalidation={AIvalidation}
                          legsData={legsData}
                        />
                      </>
                  }
                </>
              }
            </div>
            <div className={`expand-arrow${matches ? ' hidden' : ''}`}>
              <InteractiveElement onClick={toggleExpand}>
                <Tooltip
                  title={legsContainerExpanded ? 'Expand Research' : 'Collapse Research'}
                  arrow
                >
                  <FontAwesome
                    style={{ transform: rotate, transition: 'all 0.65s linear' }}
                    name="arrow-circle-left"
                    size="lg"
                  />
                </Tooltip>
              </InteractiveElement>
            </div>
            <div className={`maintenance-container-right${(legsContainerExpanded && !matches) ? ' hidden' : ''}`}>
              <AgendaItemResearchPane
                updateLegs={setLegs}
                activeAIL={activeAIL}
                location={location}
                setLocation={setLocation}
                clientData={employeeData$}
                clientError={employeeError}
                clientLoading={employeeLoading}
                perdet={routeEmployeeID}
                ref={researchPaneRef}
                updateSelection={readMode ? () => { } : updateSelection}
                userSelections={userRemarks}
                legCount={legs.length}
                readMode={readMode}
                employee={{
                  employeeData: employeeData$,
                  employeeDataError,
                  employeeDataLoading,
                }}
              />
            </div>
          </div>
        )}
      </MediaQuery>
    </>
  );
};

AgendaItemMaintenanceContainer.propTypes = {
  history: HISTORY_OBJECT.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      agendaID: PropTypes.string,
    }),
  }).isRequired,

};

export default withRouter(AgendaItemMaintenanceContainer);
