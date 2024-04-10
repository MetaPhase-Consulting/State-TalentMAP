import { useRef } from 'react';
import PropTypes from 'prop-types';
import ReactPortal from 'Components/ReactPortal';
import AssignmentCard from '../AssignmentCard';

const AssignmentModal = (props) => {
  const {
    // submitAsg,
    // cancel,
    isOpen,
    toggleModal,
    perdet,
    setCardMode,
  } = props;

  const ref = useRef();

  return (
    isOpen &&
    <ReactPortal wrapperId="react-portal-asg-create-container">
      <div className="modal-background">
        <div ref={ref} className="asg-modal-container">
          <AssignmentCard
            perdet={perdet}
            setNewAsgSep={() => setCardMode('default')}
            toggleModal={toggleModal}
            isNew
          />
        </div>
      </div>
    </ReactPortal>
  );
};

AssignmentModal.propTypes = {
  // submitAsg: PropTypes.func.isRequired,
  // cancel: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  perdet: PropTypes.number.isRequired,
  setCardMode: PropTypes.func.isRequired,
};

AssignmentModal.defaultProps = {
};

export default AssignmentModal;
