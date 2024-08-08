import { useState } from 'react';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import LinkButton from 'Components/LinkButton';
import { PANEL_MEETING } from 'Constants/PropTypes';
import { get } from 'lodash';
import { checkFlag } from 'flags';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PanelMeetingTracker from 'Components/Panel/PanelMeetingTracker';
import { userHasPermissions } from '../../../utilities';
import RemarksPill from '../../Agenda/RemarksPill';

const FALLBACK = 'None listed';
const usePanelMeetingsAgendas = () => checkFlag('flags.panel_meeting_agendas');
const usePanelAdmin = () => checkFlag('flags.panel_admin');
const usePanelAdminPanelMeeting = () => checkFlag('flags.panel_admin_panel_meeting');
const showEditPanelMeeting = usePanelAdmin() && usePanelAdminPanelMeeting();

const PanelMeetingSearchRow = ({ isCDO, pm }) => {
  const pmSeqNum = get(pm, 'pmi_pm_seq_num') || FALLBACK;
  // TODO: replace fallback with [], once api portion is complete
  const remarks = get(pm, 'allRemarks') || [];
  const showPanelMeetingsAgendas = usePanelMeetingsAgendas();
  const userProfile = useSelector(state => state.userProfile);
  const isSuperUser = userHasPermissions(['superuser'], userProfile?.permission_groups);

  const userRole = isCDO ? 'cdo' : 'ao';

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="panel-meeting-row">
      <div className="main-row">
        <PanelMeetingTracker panelMeeting={pm} />
        <div className="button-box-container">
          {
            showPanelMeetingsAgendas &&
            <LinkButton className="button-box" toLink={`/profile/${userRole}/panelmeetingagendas/${pmSeqNum}`}>View</LinkButton>
          }
          {
            isSuperUser && showEditPanelMeeting &&
          <Link to={`/profile/administrator/panel/${pmSeqNum}`}>
            <button
              className="usa-button-secondary"
            >
              Edit
            </button>
          </Link>
          }
        </div>
      </div>
      <div className="remarks-container">
        <div className="remarks-text">Remarks:</div>
        <div className="remarks-pill-container">
          {
            remarks.slice(0, expanded ? remarks.length : 8).map(remark => (
              <RemarksPill key={remark.text} remark={remark} />
            ))
          }
        </div>
        {
          remarks.length > 8 && (
            <button className="expand-button" onClick={() => setExpanded(!expanded)}>
              {expanded ? <FontAwesome name={'minus'} /> : <FontAwesome name={'plus'} />}
            </button>
          )
        }
      </div>
    </div>
  );
};

PanelMeetingSearchRow.propTypes = {
  isCDO: PropTypes.bool,
  pm: PANEL_MEETING,
};

PanelMeetingSearchRow.defaultProps = {
  isCDO: false,
  pm: {},
};

export default PanelMeetingSearchRow;
