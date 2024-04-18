import PropTypes from 'prop-types';
import { EMPTY_FUNCTION, POSITION_DETAILS } from 'Constants/PropTypes';
import TabbedCard from 'Components/TabbedCard';
import Assignment from './Assignment';
import Separation from './Separation';

const AssignmentSeparationCard = (props) => {
  const { isNew } = props;

  return (
    <TabbedCard
      tabs={[{
        text: isNew ? 'New Assignment' : 'Assignment Overview',
        value: 'ASSIGNMENT',
        content: <Assignment {...props} />,
      }, {
        text: isNew ? 'New Separation' : 'Separation Overview',
        value: 'SEPARATION',
        content: <Separation {...props} />,
      }]}
    />
  );
};

AssignmentSeparationCard.propTypes = {
  perdet: PropTypes.string,
  data: POSITION_DETAILS.isRequired,
  setNewAsgSep: PropTypes.func,
  toggleModal: PropTypes.func,
  isNew: PropTypes.bool,
};

AssignmentSeparationCard.defaultProps = {
  perdet: '',
  data: {},
  setNewAsgSep: EMPTY_FUNCTION,
  toggleModal: EMPTY_FUNCTION,
  isNew: false,
};

export default AssignmentSeparationCard;
