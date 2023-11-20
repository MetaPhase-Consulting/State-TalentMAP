import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import FA from 'react-fontawesome';
import InteractiveElement from 'Components/InteractiveElement';
import { formatDate } from 'utilities';
import { POS_LANGUAGES } from 'Constants/PropTypes';
import { checkFlag } from 'flags';
import { dateTernary } from '../Constants';
import AgendaItemLegs from '../AgendaItemLegs';
import RemarksPill from '../RemarksPill';
import SkillCodeList from '../../SkillCodeList';

const useAgendaItemMaintenance = () => checkFlag('flags.agenda_item_maintenance');

const AgendaItemRow = props => {
  const {
    isCreate,
    agenda,
    isCDO,
    perdet,
    isPanelMeetingView,
  } = props;

  const showAgendaItemMaintenance = useAgendaItemMaintenance();
  const clientData = get(agenda, 'user');

  const userRole = isCDO ? 'cdo' : 'ao';
  const perdet$ = perdet || get(agenda, 'perdet');
  const publicProfileLink = `/profile/public/${perdet$}${!isCDO ? '/ao' : ''}`;

  const userSkill = <SkillCodeList skillCodes={get(clientData, 'skills') || []} />;
  const userLanguage = get(clientData, 'languages') || [];
  const userBureau = get(clientData, 'current_assignment.position.bureau') || 'None Listed';
  const userGrade = get(clientData, 'grade') || 'None Listed';
  const cdo = get(clientData, 'cdos[0].cdo_fullname') || 'None Listed';
  const agendaStatus = get(agenda, 'status_short') || 'None Listed';
  const remarks = get(agenda, 'remarks') || [];

  const createdByLast = agenda?.creators?.last_name ? `${agenda.creators.last_name},` : '';
  const createDate = dateTernary(agenda?.creator_date);
  const updateByLast = agenda?.updaters?.last_name ? `${agenda.updaters.last_name},` : '';
  const updateDate = dateTernary(agenda?.modifier_date);
  const [show, setShow] = useState(false);
  const isValidScore = (score) => {
    if (score === null || score === undefined || score === '--' || score === 'None') {
      return '-';
    }
    return score;
  };

  const isValidDate = (currentDate) => {
    if (formatDate(currentDate) !== null) {
      return formatDate(currentDate, 'MM/YYYY');
    }
    return 'Date N/A';
  };

  const pmi = (<>
    {
      agenda?.pmi_official_item_num && isPanelMeetingView &&
      <>{agenda?.pmi_official_item_num}</>
    }
    <FA name="sticky-note" />
  </>);
  const showLanguages = (e) => {
    e.preventDefault();
    setShow(!show);
  };

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
              {
                showAgendaItemMaintenance ?
                  <Link
                    className="ai-id-link"
                    to={`/profile/${userRole}/createagendaitem/${perdet$}/${agenda?.id}`}
                  >
                    {pmi}
                  </Link>
                  :
                  pmi
              }
            </div>
            <div className={`status-tag agenda-tag--${agendaStatus}`}>
              {get(agenda, 'status_full') || 'Default'}
            </div>
            <div className={`poly-slash agenda-tag--${agendaStatus}`}>_</div>
          </div>
          <div className="ai-history-row-panel-date">
            {
              !isPanelMeetingView ?
                `Panel Date: ${agenda.panel_date ? formatDate(agenda.panel_date) : 'N/A'}`
                : ''
            }
          </div>
          {
            isPanelMeetingView &&
            <div className="panel-meeting-person-data">
              <div className="panel-meeting-agendas-profile-link">
                <Link to={publicProfileLink}>{get(clientData, 'shortened_name')}</Link>
              </div>
              <div className="panel-meeting-agendas-user-info">
                <div className="item"><span className="label">CDO: </span> {cdo}</div>
                <div className="item"><span className="label">Bureau: </span> {userBureau}</div>
                <div className="item"><span className="label">Grade: </span> {userGrade}</div>
                <div className="item">
                  <span className="label">Languages:</span>
                  <span>
                    {
                      // eslint-disable-next-line arrow-body-style
                      userLanguage.map((l, index) => {
                        if (index < 2) {
                          return (
                            `${l.code} ${isValidScore(l.reading_score)}/${isValidScore(l.speaking_score)} (${isValidDate(l.test_date)}) `
                          );
                        }
                        return (
                          <span style={{ display: !show && 'none' }}>{`${l.code} ${isValidScore(l.reading_score)}/${isValidScore(l.speaking_score)} (${isValidDate(l.test_date)}) `}</span>
                        );
                      },
                      )}
                    {userLanguage.length > 2 &&
                      <Link to="#" className="extra-data" onClick={showLanguages}>
                        {show ? '...Show Less' : '...Show More'}
                      </Link>
                    }
                  </span>
                </div>
                <div className="item"><span className="label">Skill: </span> {userSkill}</div>
              </div>
            </div>
          }
          <AgendaItemLegs legs={agenda.legs} isPanelMeetingView={isPanelMeetingView} />

          { agenda.aiCombinedTodDescText &&
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
              {
                remarks.map(remark => (
                  <RemarksPill key={remark.text} remark={remark} />
                ))
              }
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

AgendaItemRow.propTypes = {
  isCreate: PropTypes.bool,
  agenda: PropTypes.shape({
    id: PropTypes.number,
    creator_date: PropTypes.string,
    modifier_date: PropTypes.string,
    aiCombinedTodCode: PropTypes.string,
    aiCombinedTodDescText: PropTypes.string,
    aiCombinedTodOtherText: PropTypes.string,
    remarks: PropTypes.arrayOf(
      PropTypes.shape({
        seq_num: PropTypes.number,
        rc_code: PropTypes.string,
        order_num: PropTypes.number,
        short_desc_text: PropTypes.string,
        text: PropTypes.string,
        active_ind: PropTypes.string,
        type: null,
      }),
    ),
    panel_date: PropTypes.string,
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
        languages: POS_LANGUAGES,
        pay_plan: PropTypes.string,
      }),
    ),
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
  perdet: PropTypes.string,
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
