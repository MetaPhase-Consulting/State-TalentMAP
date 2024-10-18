import PropTypes from 'prop-types';
import CheckBox from '../CheckBox';

const CheckboxRenderer = (props) => {
  const { colDef, node, value } = props;

  const onCheckBoxClick = (checked) => {
    node.setDataValue(colDef.field, checked);
  };

  return (
    <CheckBox {...props} value={value} onCheckBoxClick={onCheckBoxClick} />
  );
};

CheckboxRenderer.propTypes = {
  colDef: PropTypes.shape({
    field: PropTypes.string.isRequired,
  }).isRequired,
  node: PropTypes.shape({
    setDataValue: PropTypes.func.isRequired,
  }).isRequired,
  value: PropTypes.bool.isRequired,
};

export default CheckboxRenderer;
