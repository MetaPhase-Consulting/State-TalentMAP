import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { get, isNull } from 'lodash';
import { offerHandshake, revokeHandshake } from 'actions/handshake';
import swal from '@sweetalert/with-react';
import { Tooltip } from 'react-tippy';
import FA from 'react-fontawesome';
import { useCloseSwalOnUnmount } from 'utilities';
import EditHandshake from '../EditHandshake';

const HandshakeBureauButton = props => {
  const { positionID, personID, bidCycle } = props;
  const [handshake, setHandshake] = useState(props.handshake);
  const [activePerdet, setActivePerdet] = useState(props.activePerdet);

  useCloseSwalOnUnmount();

  useEffect(() => {
    setHandshake(props.handshake);
    setActivePerdet(props.activePerdet);
  }, [props]);

  const dispatch = useDispatch();

  const {
    hs_status_code,
    hs_date_offered,
  } = handshake;

  const hsAllowed = get(bidCycle, 'handshake_allowed_date', null);
  const tooltipActive = isNull(hsAllowed);

  const buttonText = () => {
    if (hs_status_code === 'handshake_revoked') {
      return 'Re-offer';
    } else if (hs_status_code === 'handshake_offered') {
      return 'Revoke';
    }
    return 'Offer';
  };

  const submitAction = (data) => {
    if (!hs_status_code || (hs_status_code === 'handshake_revoked')) {
      dispatch(offerHandshake(personID, positionID, data));
    } else {
      dispatch(revokeHandshake(personID, positionID));
    }
    swal.close();
  };

  const handshakeModal = (infoOnly = false) => {
    swal({
      title: infoOnly ? 'Handshake Info' : `${buttonText()} Handshake`,
      button: false,
      content: (
        <EditHandshake
          submitAction={submitAction}
          bidCycle={bidCycle}
          handshake={handshake}
          infoOnly={infoOnly}
          submitText={buttonText()}
        />
      ),
    });
  };

  const disabled = () => {
    if ((!activePerdet && !isNull(activePerdet)) || tooltipActive) {
      return true;
    }
    return false;
  };

  return (
    tooltipActive ?
      <Tooltip
        html={
          <div className="status-tooltip-wrapper">
            <span>
              Not able to offer handshakes until administrator has set official
              handshake allowed date for this cycle. Please contact CDA for
              further assistance.
            </span>
          </div>
        }
        theme="hs-status"
        arrow
        tabIndex="0"
        interactive
        useContext
      >
        <div className="btn-hs-wrapper">
          <button
            className="btn-action"
            title={`${buttonText()} handshake`}
            onClick={() => handshakeModal(false)}
            disabled={disabled()}
          >
            {buttonText()}
          </button>
          <button
            className="btn-infoOnly"
            onClick={() => handshakeModal(true)}
            disabled={!hs_date_offered}
          >
            <FA name="info-circle" />
          </button>
        </div>
      </Tooltip>
      :
      <div className="btn-hs-wrapper">
        <button
          className="btn-action"
          title={`${buttonText()} handshake`}
          onClick={() => handshakeModal(false)}
          disabled={disabled()}
        >
          {buttonText()}
        </button>
        <button
          className="btn-infoOnly"
          onClick={() => handshakeModal(true)}
          disabled={!hs_date_offered}
        >
          <FA name="info-circle" />
        </button>
      </div>
  );
};

HandshakeBureauButton.propTypes = {
  handshake: PropTypes.shape({}),
  bidCycle: PropTypes.shape({}),
  positionID: PropTypes.string,
  personID: PropTypes.string,
  activePerdet: PropTypes.string,
};

HandshakeBureauButton.defaultProps = {
  handshake: {},
  bidCycle: {},
  positionID: '',
  personID: '',
  disabled: true,
  activePerdet: null,
};

export default HandshakeBureauButton;
