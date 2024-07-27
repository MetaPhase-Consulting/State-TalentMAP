import Linkify from 'react-linkify';
import TextareaAutosize from 'react-textarea-autosize';
import PropTypes from 'prop-types';
import { Row } from 'Components/Layout';
import InputActions from '../Common/InputActions';

const Training = (props) => {
  const { getCableValue, modCableValue } = props;

  return (
    <div className="position-content position-form input-container">
      <InputActions />
      <Row fluid className="position-content--description">
        <span className="definition-title">Training</span>
        <Linkify properties={{ target: '_blank' }}>
          <TextareaAutosize
            maxRows={4}
            minRows={4}
            maxLength="500"
            name="training"
            placeholder="No Description"
            value={getCableValue('TRAINING')}
            onChange={(e) => modCableValue('TRAINING', e.target.value)}
            disabled
            className="enabled-input"
            draggable={false}
          />
        </Linkify>
        <div className="word-count">
          {getCableValue('TRAINING')?.length} / 500
        </div>
      </Row>
      <div className="position-form--actions">
        <button onClick={() => { }}>Back</button>
        <button onClick={() => { }}>Next</button>
      </div>
    </div>
  );
};

Training.propTypes = {
  getCableValue: PropTypes.func,
  modCableValue: PropTypes.func,
};

Training.defaultProps = {
  getCableValue: undefined,
  modCableValue: undefined,
};


export default Training;
