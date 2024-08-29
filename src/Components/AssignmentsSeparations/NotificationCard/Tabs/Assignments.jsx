import Linkify from 'react-linkify';
import TextareaAutosize from 'react-textarea-autosize';
import FA from 'react-fontawesome';
import { Tooltip } from 'react-tippy';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { Row } from 'Components/Layout';
import InputActions from '../Common/InputActions';

const Assignments = (props) => {
  const { getCableValue, modCableValue, assignments } = props;


  // Have to get the assignments array into correct format for DnD
  const orderedAssignmentsDnd = assignments.map((a) => ({
    id: `item-${a.NMAS_SEQ_NUM}`,
    content:
      <div className="ordered-assignment">
        <span>{a.POS_TITLE_TXT}</span>
        <FA name="fa-regular fa-arrows" />
      </div>,
  }));

  // TODO: create a state 'ordered array' of assignments to send to BE
  // which will be updated in this function (probably going to be a LOT of code)
  // see PositionManagerBidders for reference
  const onDragEnd = result => {
    // eslint-disable-next-line no-unused-vars
    const { destination } = result;
    // dropped outside the list
    // if (!destination) {
    // }
  };

  const getListStyle = () => ({
    maxHeight: 1000,
    overflowY: 'scroll',
  });

  const getItemStyle = (isDragging, draggableStyle) => {
    const height = isDragging ? '130px' : '';
    const overflowY = isDragging ? 'hidden' : '';
    return {
      // some basic styles to make the items look a bit nicer
      userSelect: 'none',

      height,
      overflowY,

      // styles we need to apply on draggables
      ...draggableStyle,
    };
  };

  return (
    <div className="position-content position-form">
      <div className="mb-20">
        <span className="section-title">Ordered Assignments</span>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle()}
              >
                {orderedAssignmentsDnd.map((o, index) => (
                  <Draggable key={o.id} draggableId={o.id} index={index}>
                    {(provided$, snapshot$) => (
                      <div
                        className="ordered-assignment"
                        ref={provided$.innerRef}
                        {...provided$.draggableProps}
                        {...provided$.dragHandleProps}
                        style={getItemStyle(
                          snapshot$.isDragging,
                          provided$.draggableProps.style,
                        )}
                      >
                        {o.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )
            }
          </Droppable>
        </DragDropContext>
      </div>
      <div className="content-divider" />
      <div className="input-container">
        <InputActions
          keys={['ASSIGNMENTS', 'COMBINED TOD']}
          getCableValue={getCableValue}
          modCableValue={modCableValue}
        />
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
                value={getCableValue('ASSIGNMENTS')}
                className="enabled-input"
                draggable={false}
                disabled
              />
            </Linkify>
          </Tooltip>
          <div className="word-count">
            {getCableValue('ASSIGNMENTS')?.length} / 500
          </div>
        </Row>
        <Row fluid className="position-content--description">
          <span className="definition-title">Combined TOD</span>
          <Linkify properties={{ target: '_blank' }}>
            <TextareaAutosize
              maxRows={4}
              minRows={4}
              maxLength="500"
              name="combined-tod"
              placeholder="No Description"
              value={getCableValue('COMBINED TOD')}
              onChange={(e) => modCableValue('COMBINED TOD', e.target.value)}
              className="enabled-input"
              draggable={false}
            />
          </Linkify>
          <div className="word-count">
            {getCableValue('COMBINED TOD')?.length} / 500
          </div>
        </Row>
      </div>
    </div>
  );
};

Assignments.propTypes = {
  getCableValue: PropTypes.func,
  modCableValue: PropTypes.func,
  assignments: PropTypes.arrayOf(PropTypes.shape({})),
};

Assignments.defaultProps = {
  getCableValue: undefined,
  modCableValue: undefined,
  assignments: undefined,
};

export default Assignments;
