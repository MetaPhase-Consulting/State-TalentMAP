import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import InteractiveElement from '../InteractiveElement';
import { ifEnter } from '../../utilities';

const EditContentButton = ({ onToggle, ...rest }) => (
  <InteractiveElement
    type="span"
    className="description-edit"
    role="button"
    onClick={onToggle}
    onKeyUp={(e) => { if (ifEnter(e)) { onToggle(); } }}
    title="edit banner content"
    {...rest}
  >
    <FontAwesome
      name="pencil"
    />
  </InteractiveElement>
);

EditContentButton.propTypes = {
  onToggle: PropTypes.func.isRequired,
};

export default EditContentButton;
