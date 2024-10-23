import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import FA from 'react-fontawesome';
import InteractiveElement from 'Components/InteractiveElement';
import { formatDate } from 'utilities';
import { POS_LANGUAGES } from 'Constants/PropTypes';
import { dateTernary } from '../Constants';
import AgendaItemLegs from '../AgendaItemLegs';
import RemarksPill from '../RemarksPill';

const AgendaItemRow = props => {
  const {
    isCreate,
    agenda,
    isCDO,
    perdet,
    isPanelMeetingView,
  } = props;

  const userRole = isCDO ? 'cdo' : 'ao';
  const perdet$ = perdet || get(agenda, 'perdet');
  const publicProfileLink = `/profile/public/${perdet$}${!isCDO ? '/ao' : ''}`;
  const userName = agenda?.full_name ?? '';
  const userSkill = agenda?.skills?.join(', ') || 'None Listed';
  const userLanguages = agenda?.languages?.length ? agenda.languages.map(
    (l) => `${l.custom_description} (${formatDate(l.test_date, 'MM/YYYY')})`).join(', ') : 'None Listed';
  const userCDOFirst = agenda?.cdo?.first_name ? `${agenda.cdo.first_name} ` : '';

  const agendaStatus = get(agenda, 'status_short') || 'None Listed';
  const remarks = get(agenda, 'remarks') || [];

  const createdByLast = agenda?.creators?.last_name ? `${agenda.creators.last_name},` : '';
  const createDate = dateTernary(agenda?.creator_date);
  const updateByLast = agenda?.updaters?.last_name ? `${agenda.updaters.last_name},` : '';
  const updateDate = dateTernary(agenda?.modifier_date);

  return (
    <>
      {
        isCreate &&
        <div className="ai-history-row first-row">
          <div className="plusIcon">
            <InteractiveElement title="Create Agenda">
              <Link className="create-ai-link" to={`/profile/${userRole}/createagendaitem/${perdet$}`}>
                <FA name="plus-circle" />
              </Link>
            </InteractiveElement>
          </div>
        </div>
      }
      {
        !isCreate &&
        <div className={`ai-history-row agenda-border-row--${agendaStatus} `}>
          <div className="ai-history-status">
            <div className={`agenda-tag--${agendaStatus} pmi-official-item-number`}>
              {isPanelMeetingView && agenda.pmi_official_item_num ? agenda.pmi_official_item_num : '-'}
            </div>
            <div className={`status-tag agenda-tag--${agendaStatus}`}>
              {get(agenda, 'status_full') || 'Default'}
            </div>
            <div className={`poly-slash agenda-tag--${agendaStatus}`}>_</div>
          </div>
          <div className="ai-history-row-panel-date">
            {
              !isPanelMeetingView ?
                <div className="ai-history-non-panel-meeting-view">
                  <Link
                    to={`/profile/${userRole}/editagendaitem/${perdet$}/${agenda?.id}`}
                  >
                    Edit Agenda Item
                  </Link>
                  Panel Date: {agenda.pmd_dttm ? formatDate(agenda.pmd_dttm) : 'N/A'}
                </div>
                : ''
            }
          </div>
          {
            isPanelMeetingView &&
            <div className="panel-meeting-person-data">
              <div className="panel-meeting-agendas-profile-link">
                <Link to={publicProfileLink}>{userName}</Link>
              </div>
              <div className="panel-meeting-agendas-user-info">
                <div className="item">
                  <span className="label">Languages: </span>
                  <span>{userLanguages}</span>
                </div>
                <div className="item"><span className="label">PP/Grade: </span>{agenda?.combined_pp_grade}</div>
                <div className="item"><span className="label">Skill: </span>{userSkill}</div>
                <div className="item"><span className="label">CDO: </span>{userCDOFirst} {agenda?.cdo?.last_name ?? ''}</div>
              </div>
              <div className="panel-meeting-maintenance-link-container">
                <Link
                  to={`/profile/${userRole}/editagendaitem/${perdet$}/${agenda?.id}`}
                >
                  Edit Agenda Item
                </Link>
              </div>
            </div>
          }
          <AgendaItemLegs legs={agenda.legs} isPanelMeetingView={isPanelMeetingView} />

          {agenda.aiCombinedTodDescText &&
            <div className="agenda-item-combined-tod">
              <span>
                <span className="agenda-item-combined-tod-text">{'Combined TOD: '}</span>
                {agenda.aiCombinedTodCode === 'X' ? agenda.aiCombinedTodOtherText : agenda.aiCombinedTodDescText}
              </span>
            </div>
          }

          <div className="agenda-bottom-row">
            <div className="remarks-container">
              <div className="remarks-text">Remarks:</div>
              <div className="remarks-pill-container">
                {
                  remarks.map(remark => (
                    <RemarksPill key={`${perdet$}-${remark.air_remark_text}`} remark={remark} />
                  ))
                }
                {agenda?.ahtCode &&
                <RemarksPill
                  key="hold-remark"
                  remark={{
                    text: `
                    ${agenda?.ahtDescText} 
                    #${agenda?.aihHoldNum}
                    ${agenda?.aihHoldComment ? ` ${agenda?.aihHoldComment}` : ''}
                    `,
                  }}
                />
                }
              </div>
            </div>
            <div className="ai-updater-creator">
              <div className="wrapper">
                <span className="ai-updater-creator-name">
                  Created: {createdByLast} {get(agenda, 'creators.first_name') || ''}
                </span>
                <span className="date">{createDate}</span>
              </div>
              <div className="wrapper">
                <span className="ai-updater-creator-name">
                  Modified: {updateByLast} {get(agenda, 'updaters.first_name') || ''}
                </span>
                <span className="date">{updateDate}</span>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

// @TODO: Double check all propTypes compared to Dev1
AgendaItemRow.propTypes = {
  isCreate: PropTypes.bool,
  agenda: PropTypes.shape({
    id: PropTypes.number,
    creator_date: PropTypes.string,
    modifier_date: PropTypes.string,
    aiCombinedTodCode: PropTypes.string,
    aiCombinedTodDescText: PropTypes.string,
    aiCombinedTodOtherText: PropTypes.string,
    ahtCode: PropTypes.string,
    ahtDescText: PropTypes.string,
    aihHoldNum: PropTypes.number,
    aihHoldComment: PropTypes.string,
    // @TODO: Possibly need to fix this
    remarks: PropTypes.arrayOf(
      PropTypes.shape({
        seq_num: PropTypes.number,
        rc_code: PropTypes.string,
        order_num: PropTypes.number,
        short_desc_text: PropTypes.string,
        text: PropTypes.string,
        active_ind: PropTypes.string,
        air_remark_text: PropTypes.string,
        type: null,
      }),
    ),
    pmd_dttm: PropTypes.string,
    pmi_official_item_num: PropTypes.number,
    status: PropTypes.string,
    perdet: PropTypes.number,
    legs: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        pos_title: PropTypes.string,
        pos_num: PropTypes.string,
        org: PropTypes.string,
        eta: PropTypes.string,
        ted: PropTypes.string,
        tod: PropTypes.string,
        grade: PropTypes.string,
        action: PropTypes.string,
        travel: PropTypes.string,
        languages: PropTypes.oneOfType([POS_LANGUAGES, PropTypes.string]),
        pay_plan: PropTypes.string,
      }),
    ),
    skills: PropTypes.arrayOf(
      PropTypes.string,
    ),
    languages: PropTypes.arrayOf(
      PropTypes.shape({
        lang_code: PropTypes.string,
        speaking_score: PropTypes.string,
        reading_score: PropTypes.string,
        test_date: PropTypes.string,
        custom_description: PropTypes.string,
      }),
    ),
    cdo: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
    }),
    pay_plan_code: PropTypes.string,
    grade: PropTypes.string,
    combined_pp_grade: PropTypes.string,
    org: PropTypes.shape({
      org_descr: PropTypes.string,
    }),
    full_name: PropTypes.string,
    update_date: PropTypes.string,
    modifier_name: PropTypes.number,
    creator_name: PropTypes.number,
    creators: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      hruempseqnbr: PropTypes.number,
      hruneuid: PropTypes.number,
      hruid: PropTypes.number,
      neuid: PropTypes.number,
      middle_name: PropTypes.string,
    }),
    updaters: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      hruempseqnbr: PropTypes.number,
      hruneuid: PropTypes.number,
      hruid: PropTypes.number,
      neuid: PropTypes.number,
      middle_name: PropTypes.string,
    }),
  }),
  isCDO: PropTypes.bool,
  perdet: PropTypes.number,
  isPanelMeetingView: PropTypes.bool,
};


AgendaItemRow.defaultProps = {
  isCreate: false,
  agenda: {},
  isCDO: false,
  perdet: null,
  isPanelMeetingView: false,
};

export default AgendaItemRow;
