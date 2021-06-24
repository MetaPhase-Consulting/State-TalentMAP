import PropTypes from 'prop-types';
import { BID_OBJECT } from 'Constants/PropTypes';
import { NO_GRADE, NO_POSITION_TITLE, NO_SKILL } from 'Constants/SystemMessages';
import { get } from 'lodash';

const HandshakeRegisterAnotherClientAlert = ({ bid, condensedView }) => {
  const position = get(bid, 'position_info.position');
  const positionTitle = get(position, 'title') || NO_POSITION_TITLE;
  const skillCode = get(position, 'skill') || NO_SKILL;
  const grade = get(position, 'grade') || NO_GRADE;

  const classes = [
    'bid-tracker-alert-container',
    'bid-tracker-alert-container--register',
  ];

  const classes$ = classes.join(' ');

  const overlayClasses = condensedView ?
    ['register-submission-container', 'sub-submission-text'] : ['register-another-client-container', 'register-position-details'];

  const overlayClasses$ = overlayClasses.join(' ');

  const text = 'A HANDSHAKE HAS BEEN REGISTERED WITH ANOTHER BIDDER:';

  return (
    <div className={classes$}>
      <div className="usa-grid-full" style={{ display: 'flex' }}>
        <div className={overlayClasses$}>
          {text}
          <div>
            {positionTitle}
          </div>
          <div>
            <span className="title">Skill: </span>
            {skillCode}
          </div>
          <div>
            <span className="title">Grade: </span>
            {grade}
          </div>
        </div>
      </div>
    </div>
  );
};

HandshakeRegisterAnotherClientAlert.contextTypes = {
  readOnly: PropTypes.bool,
};

HandshakeRegisterAnotherClientAlert.propTypes = {
  bid: BID_OBJECT.isRequired,
  condensedView: PropTypes.bool,
  // userName: PropTypes.string,
};

HandshakeRegisterAnotherClientAlert.defaultProps = {
  condensedView: false,
//   userName: '',
};

export default HandshakeRegisterAnotherClientAlert;
