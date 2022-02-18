import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import FA from 'react-fontawesome';
import InteractiveElement from 'Components/InteractiveElement';
import { formatDate } from 'utilities';
import AgendaItemLegs from '../AgendaItemLegs';
import { pillColors } from '../Constants';

const AgendaItemRow = props => {
  const {
    isCreate,
    agenda,
    showEdit,
    isCDO,
  } = props;

  const userRole = isCDO ? 'cdo' : 'ao';
  const perdet = get(agenda, 'perdet');

  // eslint-disable-next-line no-console
  const editAI = () => { console.log('placeholder edit AI'); };
  const pillColor = pillColors[get(agenda, 'status') || 'Default'];
  return (
    <>
      {
        isCreate &&
        <div className="ai-history-row first-row">
          <div className="plusIcon">
            <InteractiveElement title="Create Agenda">
              <Link className="create-ai-link" to={`/profile/${userRole}/createagendaitem/${perdet}`}>
                <FA name="plus-circle" />
              </Link>
            </InteractiveElement>
          </div>
        </div>
      }
      {
        <div className="ai-history-row" style={{ borderLeftColor: pillColor }}>
          <div className="ai-history-row-status">
            <div className="status-tag" style={{ backgroundColor: pillColor }}>
              {get(agenda, 'status') || 'Default'}
            </div>
            <div className="poly-slash" style={{ backgroundColor: pillColor, color: pillColor }} >_</div>
          </div>
          <div className="ai-history-row-panel-date">
            Panel Date: {agenda.panel_date ? formatDate(agenda.panel_date) : 'N/A'}
          </div>
          <AgendaItemLegs legs={agenda.legs} remarks={agenda.remarks} />
          {
            showEdit &&
            <div className="ai-history-footer">
              <InteractiveElement title="Edit Agenda" onClick={editAI()}>
                <FA name="pencil" />
              </InteractiveElement>
            </div>
          }
        </div>
      }
    </>
  );
};

AgendaItemRow.propTypes = {
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
  isCDO: PropTypes.bool,
};


AgendaItemRow.defaultProps = {
  isCreate: false,
  agenda: {},
  showEdit: false,
  isCDO: false,
};

export default AgendaItemRow;
