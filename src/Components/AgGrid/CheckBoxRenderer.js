import PropTypes from 'prop-types';
import CheckBox from '../CheckBox';

const CheckboxRenderer = (props) => {
  const onCheckBoxClick = (checked) => {
    props.node.setDataValue(props.colDef.field, checked);
  };

  return (
    <CheckBox {...props} value={props.value} onCheckBoxClick={onCheckBoxClick} />
  );
};

CheckboxRenderer.propTypes = {
  value: PropTypes.bool.isRequired,
  node: PropTypes.shape({
    setDataValue: PropTypes.func.isRequired,
  }).isRequired,
  colDef: PropTypes.shape({
    field: PropTypes.string.isRequired,
  }).isRequired,
};

export default CheckboxRenderer;
