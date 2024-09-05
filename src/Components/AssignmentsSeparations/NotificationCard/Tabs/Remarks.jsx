import Linkify from 'react-linkify';
import TextareaAutosize from 'react-textarea-autosize';
import PropTypes from 'prop-types';
import { Row } from 'Components/Layout';
import InputActions from '../Common/InputActions';

const Remarks = (props) => {
  const { getCableValue, modCableValue } = props;

  return (
    <div className="position-content position-form input-container">
      <InputActions
        keys={['REMARKS']}
        getCableValue={getCableValue}
        modCableValue={modCableValue}
      />
      <Row fluid className="position-content--description">
        <span className="definition-title">Remarks</span>
        <Linkify properties={{ target: '_blank' }}>
          <TextareaAutosize
            maxRows={4}
            minRows={4}
            maxLength="500"
            name="remarks"
            placeholder="No Description"
            value={getCableValue('REMARKS')}
            onChange={(e) => modCableValue('REMARKS', e.target.value)}
            className="enabled-input"
            draggable={false}
          />
        </Linkify>
        <div className="word-count">
          {getCableValue('REMARKS')?.length} / 500
        </div>
      </Row>
    </div>
  );
};

Remarks.propTypes = {
  getCableValue: PropTypes.func,
  modCableValue: PropTypes.func,
};

Remarks.defaultProps = {
  getCableValue: undefined,
  modCableValue: undefined,
};

export default Remarks;
