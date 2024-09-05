import { useEffect, useState } from 'react';
import Linkify from 'react-linkify';
import { Tooltip } from 'react-tippy';
import TextareaAutosize from 'react-textarea-autosize';
import FA from 'react-fontawesome';
import PropTypes from 'prop-types';
import { Row } from 'Components/Layout';
import InteractiveElement from 'Components/InteractiveElement';
import CheckBox from '../../../CheckBox/CheckBox';
import InputActions from '../Common/InputActions';

const Paragraphs = (props) => {
  const { paragraphs, getCableValue, modCableValue } = props;

  // Instead of making a ton of variables for tracking the various input data for all
  // paragraphs, I made a data object array that tracks all the important information
  // we need to both render the UI and to submit input data to the BE. To access the
  // data for any given paragraph, just do a simple .find

  const [paragraphDataObjects, setParagraphDataObjects] = useState([]);

  useEffect(() => {
    if (paragraphs) {
      const ordered = paragraphs.sort((a, b) => a.ORDER_NUM - b.ORDER_NUM);
      setParagraphDataObjects(ordered.map((p) => ({
        id: p.NOTP_CODE,
        paragraph_title: p.NOTP_SHORT_DESC_TEXT,
        input: p.NOTP_DESC_TEXT,
        checked: p.INC_IND === 1,
        open: false,
      })));
    }
  }, []);

  const handleCheck = id => {
    setParagraphDataObjects(paragraphDataObjects.map((item) => (
      item.id === id ? { ...item, checked: !item.checked } : item
    )));
  };

  const handleExpand = id => {
    setParagraphDataObjects(paragraphDataObjects.map((item) => (
      item.id === id ? { ...item, open: !item.open } : item
    )));
  };

  const handleTextInput = (e, id) => {
    setParagraphDataObjects(paragraphDataObjects.map((item) => (
      item.id === id ? { ...item, input: e.target.value } : item
    )));
  };

  return (
    <div className="position-content position-form input-container">
      <InputActions
        keys={['PARAGRAPHS']}
        getCableValue={getCableValue}
        modCableValue={modCableValue}
      />
      <div className="mb-20">
        <span className="section-title">Chosen Paragraphs</span>
        {paragraphDataObjects.map(o => (
          <div key={o.id}>
            <div className="chosen-paragraph">
              <div>
                <CheckBox
                  id={`ep-checkbox-${o.id}`}
                  name="exclusivePosition"
                  value={o.checked}
                  onChange={() => handleCheck(o.id)}
                />
                <span>{o.paragraph_title}</span>
              </div>
              <div>
                <InteractiveElement className="toggle-more" onClick={() => handleExpand(o.id)}>
                  <FA id={o.id} name={`chevron-${paragraphDataObjects?.find(item => item.id === o.id)?.open ? 'up' : 'down'}`} />
                </InteractiveElement>
              </div>
            </div>
            {paragraphDataObjects?.find(item => item.id === o.id)?.open &&
              <div>
                <TextareaAutosize
                  maxRows={6}
                  minRows={4}
                  maxLength="500"
                  name={`${o.title}-input`}
                  placeholder="No Description"
                  value={paragraphDataObjects?.find(item => item.id === o.id)?.input}
                  onChange={(e) => handleTextInput(e, o.id)}
                  className="enabled-input"
                />
              </div>
            }
          </div>
        ))}
      </div>
      <Row fluid className="position-content--description">
        <span className="definition-title">Preview Text</span>
        <Tooltip title="Save changes to generate new preview text.">
          <Linkify properties={{ target: '_blank' }}>
            <TextareaAutosize
              maxRows={8}
              minRows={4}
              maxLength="500"
              name="preview-text"
              placeholder="No Description"
              value={getCableValue('PARAGRAPHS')}
              className="enabled-input"
              draggable={false}
              disabled
            />
          </Linkify>
        </Tooltip>
        <div className="word-count">
          {getCableValue('PARAGRAPHS')?.length} / 500
        </div>
      </Row>
    </div>
  );
};

Paragraphs.propTypes = {
  paragraphs: PropTypes.arrayOf(PropTypes.shape({})),
  getCableValue: PropTypes.func,
  modCableValue: PropTypes.func,
};

Paragraphs.defaultProps = {
  paragraphs: undefined,
  getCableValue: PropTypes.func,
  modCableValue: undefined,
};

export default Paragraphs;
