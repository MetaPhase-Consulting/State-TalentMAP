import Linkify from 'react-linkify';
import TextareaAutosize from 'react-textarea-autosize';
import PropTypes from 'prop-types';
import { Row } from 'Components/Layout';

const Routing = (props) => {
  const {
    routingValue,
    modRoutingValue,
    postOptions,
    precedenceOptions,
    organizationOptions,
  } = props;

  const postDropdown = (nmdSeqNum, value) => (
    <div className="position-form--label-input-container width-300">
      <label htmlFor={`post-${nmdSeqNum}`}>Cable Post</label>
      <select
        id={`post-${nmdSeqNum}`}
        value={value || ''}
        onChange={(e) => modRoutingValue(nmdSeqNum, 'CP_SEQ_NUM', e.target.value)}
      >
        <option value="" disabled>Select Post</option>
        {postOptions.map(b => (
          <option key={b.CP_SEQ_NUM} value={b.CP_SEQ_NUM}>{b.CP_DESC}</option>
        ))}
      </select>
    </div>
  );

  const precedenceDropdown = (nmdSeqNum, value) => (
    <div className="position-form--label-input-container width-300">
      <label htmlFor={`precedence-${nmdSeqNum}`}>Precedence</label>
      <select
        id={`precedence-${nmdSeqNum}`}
        value={value || ''}
        onChange={(e) => modRoutingValue(nmdSeqNum, 'PT_CODE', e.target.value)}
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
        {routingValue.filter(v => v.DT_CODE === 'A').map(action => (
          <div className="routing-sub-section">
            <div className="display-flex justify-space-between width-700">
              {postDropdown(action?.NMD_SEQ_NUM, action?.CP_SEQ_NUM)}
              {precedenceDropdown(action?.NMD_SEQ_NUM, action?.PT_CODE)}
            </div>
            <Row fluid className="position-content--textArea width-700 mt-10">
              <span className="definition-title">Slug Text</span>
              <Linkify properties={{ target: '_blank' }}>
                <TextareaAutosize
                  maxRows={4}
                  minRows={1}
                  maxLength="500"
                  name="subject"
                  placeholder="No Description"
                  value={action?.NMD_SLUG_TEXT}
                  onChange={(e) => modRoutingValue(action?.NMD_SEQ_NUM, 'NMD_SLUG_TEXT', e.target.value)}
                  draggable={false}
                />
              </Linkify>
              <div className="word-count">
                {action?.NMD_SLUG_TEXT?.length} / 500
              </div>
            </Row>
          </div>
        ))}
        <div className="standard-add-button pt-12">
          <a
            role="button"
            tabIndex={0}
            onClick={() => modRoutingValue(null, 'DT_CODE', 'A')}
          >
            Add Another Action
          </a>
        </div>
        <div className="content-divider mt-40" />
      </div>
      <div className="notification-card__sub-section">
        <span className="sub-header">Information</span>
        {routingValue.filter(v => v.DT_CODE === 'I').map(info => (
          <div className="routing-sub-section">
            <div className="display-flex justify-space-between width-700">
              {postDropdown(info?.NMD_SEQ_NUM, info?.CP_SEQ_NUM)}
              {precedenceDropdown(info?.NMD_SEQ_NUM, info?.PT_CODE)}
            </div>
            <Row fluid className="position-content--textArea width-700 mt-10">
              <span className="definition-title">Slug Text</span>
              <Linkify properties={{ target: '_blank' }}>
                <TextareaAutosize
                  maxRows={4}
                  minRows={1}
                  maxLength="500"
                  name="subject"
                  placeholder="No Description"
                  value={info?.NMD_SLUG_TEXT}
                  onChange={(e) => modRoutingValue(info?.NMD_SEQ_NUM, 'NMD_SLUG_TEXT', e.target.value)}
                  draggable={false}
                />
              </Linkify>
              <div className="word-count">
                {info?.NMD_SLUG_TEXT?.length} / 500
              </div>
            </Row>
          </div>
        ))}
        <div className="standard-add-button pt-12">
          <a
            role="button"
            tabIndex={0}
            onClick={() => modRoutingValue(null, 'DT_CODE', 'I')}
          >
            Add More Information
          </a>
        </div>
        <div className="content-divider mt-40" />
      </div>
      <div className="notification-card__sub-section">
        <span className="sub-header">Distribution</span>
        {routingValue.filter(v => v.DT_CODE === 'D').map(dist => (
          <div className="position-form--label-input-container width-200">
            <label htmlFor="organization">Organization</label>
            <select
              id="organization"
              value={dist?.ORG_CODE}
              onChange={(e) => modRoutingValue(dist?.NMD_SEQ_NUM, 'ORG_CODE', e.target.value)}
            >
              <option value="" disabled>Select Organization</option>
              {organizationOptions.map(b => (
                <option key={b.ORG_CODE} value={b.ORG_CODE}>{b.ORGS_SHORT_DESC}</option>
              ))}
            </select>
          </div>
        ))}
        <div className="standard-add-button pt-12">
          <a
            role="button"
            tabIndex={0}
            onClick={() => modRoutingValue(null, 'DT_CODE', 'D')}
          >
            Add Another Distribution
          </a>
        </div>
        <div className="content-divider" />
      </div>
    </div>
  );
};

Routing.propTypes = {
  routingValue: PropTypes.arrayOf(PropTypes.shape({})),
  modRoutingValue: PropTypes.func,
  postOptions: PropTypes.arrayOf(PropTypes.shape({})),
  precedenceOptions: PropTypes.arrayOf(PropTypes.shape({})),
  organizationOptions: PropTypes.arrayOf(PropTypes.shape({})),
};

Routing.defaultProps = {
  routingValue: undefined,
  modRoutingValue: undefined,
  postOptions: undefined,
  precedenceOptions: undefined,
  organizationOptions: undefined,
};

export default Routing;
