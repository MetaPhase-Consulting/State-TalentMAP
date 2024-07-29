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
  const pmSeqNum = get(pm, 'pm_seq_num') || FALLBACK;
  const remarks = get(pm, 'remarks') || [{ text: '2nd Tour JO', rc_code: 'A' }, { text: 'ATA 03/03/2012', rc_code: 'T' }, { text: 'Approved off-panel on 03/03/2012', rc_code: 'M' }, { text: 'BOP', rc_code: 'E' }, { text: '123 BSAC', rc_code: 'B' }, { text: 'custom remark here', rc_code: 'M' }, { text: 'Breaks/curtails 2012 PSP/SIP link', rc_code: 'M' }, { text: 'CA EL LDP', rc_code: 'P' }, { text: '123 CA LNA Class', rc_code: 'B' }];
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
      <div className="panel-remarks-container">
        <div className="remarks-text">Remarks:</div>
        <div className="remarks-pill-container">
          {
            remarks.slice(0, expanded ? remarks.length : 5).map(remark => (
              <RemarksPill key={remark.text} remark={remark} />
            ))
          }
        </div>
        {
          remarks.length > 5 && (
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
