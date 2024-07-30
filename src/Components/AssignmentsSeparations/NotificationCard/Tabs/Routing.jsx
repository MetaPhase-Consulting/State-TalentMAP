import Linkify from 'react-linkify';
import TextareaAutosize from 'react-textarea-autosize';
import PropTypes from 'prop-types';
import { Row } from 'Components/Layout';

const Routing = (props) => {
  const {
    getCableValue,
    modCableValue,
    postOptions,
    precedenceOptions,
    organizationOptions,
  } = props;

  const postDropdown = (key) => (
    <div className="position-form--label-input-container width-300">
      <label htmlFor={`post-${key}`}>Cable Post</label>
      <select
        id={`post-${key}`}
        value=""
        onChange={() => { }}
      >
        <option value="" disabled>Select Post</option>
        {postOptions.map(b => (
          <option key={b.CP_SEQ_NUM} value={b.CP_SEQ_NUM}>{b.CP_DESC}</option>
        ))}
      </select>
    </div>
  );

  const precedenceDropdown = (key) => (
    <div className="position-form--label-input-container width-300">
      <label htmlFor={`precedence-${key}`}>Precedence</label>
      <select
        id={`precedence-${key}`}
        value=""
        onChange={() => { }}
      >
        <option value="" disabled>Select Precedence</option>
        {precedenceOptions.map(b => (
          <option key={b.PT_CODE} value={b.PT_CODE}>{b.PT_DESC}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="position-content position-form input-container">
      <div className="notification-card__sub-section">
        <span className="sub-header">Action</span>
        <div className="display-flex justify-space-between width-700 mt-20">
          {postDropdown()}
          {precedenceDropdown()}
        </div>
        <Row fluid className="position-content--textArea width-700  mt-20">
          <span className="definition-title">Slug Text</span>
          <Linkify properties={{ target: '_blank' }}>
            <TextareaAutosize
              maxRows={4}
              minRows={1}
              maxLength="500"
              name="subject"
              placeholder="No Description"
              defaultValue=""
              onChange={() => { }}
              draggable={false}
            />
          </Linkify>
          <div className="word-count">
            0 / 500
          </div>
        </Row>
        <a href="tbd" rel="PMD" target="_blank">Add Another Action</a>
        <div className="content-divider mt-40" />
      </div>
      <div className="notification-card__sub-section">
        <span className="sub-header">Information</span>
        <div className="display-flex justify-space-between width-700 mt-20">
          {postDropdown()}
          {precedenceDropdown()}
        </div>
        <Row fluid className="position-content--textArea width-700  mt-20">
          <span className="definition-title">Slug Text</span>
          <Linkify properties={{ target: '_blank' }}>
            <TextareaAutosize
              maxRows={4}
              minRows={1}
              maxLength="500"
              name="subject"
              placeholder="No Description"
              defaultValue=""
              onChange={() => { }}
              draggable={false}
            />
          </Linkify>
          <div className="word-count">
            0 / 500
          </div>
        </Row>
        <a href="tbd" rel="PMD" target="_blank">Add More Information</a>
        <div className="content-divider mt-40" />
      </div>
      <div className="notification-card__sub-section">
        <span className="sub-header">Distribution</span>
        <div className="position-form--label-input-container width-200">
          <label htmlFor="organization">Organization</label>
          <select
            id="organization"
            value={getCableValue('DISTRIBUTION')}
            onChange={() => modCableValue('DISTRIBUTION', '')}
          >
            <option value="" disabled>Select Organization</option>
            {organizationOptions.map(b => (
              <option key={b.ORG_CODE} value={b.ORG_CODE}>{b.ORGS_SHORT_DESC}</option>
            ))}
          </select>
        </div>
        <a href="tbd" rel="PMD" target="_blank">Add Another Distribution</a>
        <div className="content-divider" />
      </div>
    </div>
  );
};

Routing.propTypes = {
  getCableValue: PropTypes.func,
  modCableValue: PropTypes.func,
  postOptions: PropTypes.arrayOf(PropTypes.shape({})),
  precedenceOptions: PropTypes.arrayOf(PropTypes.shape({})),
  organizationOptions: PropTypes.arrayOf(PropTypes.shape({})),
};

Routing.defaultProps = {
  getCableValue: undefined,
  modCableValue: undefined,
  postOptions: undefined,
  precedenceOptions: undefined,
  organizationOptions: undefined,
};

export default Routing;
