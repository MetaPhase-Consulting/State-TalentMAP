import { useRef } from 'react';
import PropTypes from 'prop-types';
import ReactPortal from 'Components/ReactPortal';

const ReactModal = (props) => {
  const {
    isOpen,
    children,
  } = props;

  const ref = useRef();

  return (isOpen &&
    <ReactPortal wrapperId="modal-portal">
      <div className="modal-background">
        <div ref={ref} className="modal-container">
          {children}
        </div>
      </div>
    </ReactPortal>
  );
};

ReactModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

ReactModal.defaultProps = {
};

export default ReactModal;
