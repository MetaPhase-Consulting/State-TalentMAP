import { useRef } from 'react';
import PropTypes from 'prop-types';
import FA from 'react-fontawesome';
import ReactPortal from 'Components/ReactPortal';
import InteractiveElement from 'Components/InteractiveElement';

const ReactModal = (props) => {
  const {
    open,
    setOpen,
    children,
    // TODO: Add show close button prop
  } = props;

  const ref = useRef();

  return (open &&
    <ReactPortal wrapperId="modal-portal">
      <div className="modal-background">
        <div ref={ref} className="modal-container">
          <InteractiveElement
            title="Close Modal"
            role="button"
            className="modal-close"
            onClick={() => setOpen(false)}
          >
            <FA name="close" />
          </InteractiveElement>
          {children}
        </div>
      </div>
    </ReactPortal>
  );
};

ReactModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

ReactModal.defaultProps = {
};

export default ReactModal;
