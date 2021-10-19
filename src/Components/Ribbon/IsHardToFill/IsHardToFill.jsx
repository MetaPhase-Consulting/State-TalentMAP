import PropTypes from 'prop-types';
import Ribbon from '../Ribbon';

const IsHardToFill = ({ shortName, ...props }) => {
  const text = shortName ? 'HTF' : 'Is Hard To Fill';
  return (
    <Ribbon icon="star-half-o" text={text} type="htf" {...props} />
  );
};

IsHardToFill.propTypes = {
  shortName: PropTypes.bool,
};

IsHardToFill.defaultProps = {
  shortName: false,
};

export default IsHardToFill;
