import PropTypes from 'prop-types';
import FA from 'react-fontawesome';
import { clone, get, take, takeRight } from 'lodash';
import { formatDate, shortenString } from 'utilities';
import InteractiveElement from 'Components/InteractiveElement';
import AgendaItemLegs from '../AgendaItemLegs';
import { pillColors } from '../Constants';

const AgendaItemCard = props => {
  const {
    isCreate,
    agenda,
    showEdit,
  } = props;

  const legs = get(agenda, 'legs') || [];
  let legs$ = clone(legs);
  let legsLength = 0;
  if (legs$.length > 2) {
    legs$ = [take(legs$)[0], takeRight(legs$)[0]];
    legsLength = legs.length - 2;
    if (legsLength < 0) {
      legsLength = 0;
    }
  }

  const formatStr = (a) => shortenString(a, 15);

  // eslint-disable-next-line no-console
  const createAI = () => { console.log('placeholder create AI'); };
  // eslint-disable-next-line no-console
  const editAI = () => { console.log('placeholder create AI'); };
  const status_full = get(agenda, 'status_full') || 'Default';
  const pillColor = pillColors[status_full];

  return (
    <>
      {
        isCreate &&
          <div className="ai-history-card first-card">
            <div className="plusIcon">
              <InteractiveElement title="Create Agenda" onClick={createAI()}>
                <FA name="plus-circle" />
              </InteractiveElement>
            </div>
          </div>
      }
      {
        <div className="ai-history-card" style={{ borderLeftColor: pillColor }}>
          <div className="ai-history-status">
            <div className="status-tag" style={{ backgroundColor: pillColor }}>
              {get(agenda, 'status_full') || 'Default'}
            </div>
            <div className="poly-slash" style={{ backgroundColor: pillColor, color: pillColor }} >_</div>
          </div>
          {
            !showEdit &&
            <div className="ai-history-edit">
              <InteractiveElement title="Edit Agenda" onClick={editAI()}>
                <FA name="pencil" />
              </InteractiveElement>
            </div>
          }
          <h3 className="ai-history-card-title">
            { formatStr(get(legs$, '[0].pos_title') || 'N/A') }
            <div className="arrow">
              <div className="arrow-tail" />
              {legsLength}
              <div className="arrow-tail" />
              <div className="arrow-right" />
            </div>
            { formatStr(get(legs$, '[1].pos_title') || 'N/A') }
          </h3>
          <AgendaItemLegs legs={agenda.legs} isCard />
          <div className="ai-history-card-date">
            Panel Date: {agenda.panel_date ? formatDate(agenda.panel_date) : 'N/A'}
          </div>
        </div>
      }
    </>
  );
};


AgendaItemCard.propTypes = {
  isCreate: PropTypes.bool,
  agenda: PropTypes.shape({
    id: PropTypes.number,
    remarks: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        type: null,
      }),
    ),
    panel_date: PropTypes.string,
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
      }),
    ),
    update_date: PropTypes.string,
    modifier_name: PropTypes.number,
    creator_name: PropTypes.number,
  }),
  showEdit: PropTypes.bool,
};


AgendaItemCard.defaultProps = {
  isCreate: false,
  agenda: {},
  showEdit: false,
};

export default AgendaItemCard;
