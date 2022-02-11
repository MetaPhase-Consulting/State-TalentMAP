/* eslint-disable */
import { useState } from 'react';
import InteractiveElement from 'Components/InteractiveElement';
import { get, has } from 'lodash';
import PropTypes from 'prop-types';
import SelectForm from 'Components/SelectForm';
import BackButton from 'Components/BackButton';
import FA from 'react-fontawesome';
import RemarksPill from '../RemarksPill';

const AgendaItemMaintenancePane = (props) => {

  const width = get(props, 'leftExpanded') ? '50%' : '100%';

  const aiStatuses = [
    {text: "Approved", value: 'A'},
    {text: "Deferred - Proposed Position", value: 'C'},
    {text: "Disapproved", value: 'D'},
    {text: "Deferred", value: 'F'},
    {text: "Held", value: 'H'},
    {text: "Move to ML/ID", value: 'M'},
    {text: "Not Ready", value: 'N'},
    {text: "Out of Order", value: 'O'},
    {text: "PIP", value: 'P'},
    {text: "Ready", value: 'R'},
    {text: "Withdrawn", value: 'W'}
  ];

  const asg = [
    {text: "Employee Assignment Separations, and Bids", value: 'A'},
  ];
  const [selectedAIStatus, setAIStatus] = useState('A');

  const remarks = [{"title":"Critical Need Position","type":null},{"title":"High Differential Post","type":null},{"title":"Reassignment at post","type":null},{"title":"SND Post","type":null},{"title":"Continues SND eligibility","type":null},{"title":"Creator(s):Townpost, Jenny","type":"person"},{"title":"Modifier(s):WoodwardWA","type":"person"},{"title":"CDO: Rehman, Tarek S","type":"person"}];

  const saveAI = () => {
    // eslint-disable-next-line
    console.log('save AI');
  };

  return (
    <div className="ai-maintenance-pane">
      <div className="ai-maintenance-header">
        <div className="back-save-btns-container" style={{width: `${width}`}}>
          <BackButton />
          <InteractiveElement title="Save Agenda Item" type="div" onClick={saveAI} className="save-ai-btn">
            Save Agenda Item
          </InteractiveElement>
        </div>
        <div className="ai-maintenance-header-dd" style={{width: `${width}`}}>
          <SelectForm
            id="ai-maintenance-dd-asg"
            options={asg}
            defaultSort={asg[0]}
            onSelectOption={value => setAIStatus(value.target.value)}
            // disabled
          />
          <SelectForm
            id="ai-maintenance-status"
            options={aiStatuses}
            label="Status:"
            defaultSort={selectedAIStatus}
            onSelectOption={value => setAIStatus(value.target.value)}
            disabled={false}
          />
          <div className="usa-form">
            <label>Add Position Number:</label>
              <input
                id='add-pos-num-input'
                value={'1234578'}
                onChange={value => setAIStatus(value.target.value)}
                type="add"
                name="add"
                // disabled
              />
            <InteractiveElement onClick={saveAI} type="span" role="button"
                                title="Add position" id='add-pos-num-icon'>
                <FA name="plus" />
            </InteractiveElement>
          </div>
          <SelectForm
            id="ai-maintenance-status"
            options={aiStatuses}
            label="Report Category:"
            defaultSort={selectedAIStatus}
            onSelectOption={value => setAIStatus(value.target.value)}
            disabled={false}
          />
          <div className="usa-form">
            <label>Remarks:</label>
            <div className="remarks-container">
              {
                remarks.map(remark => (
                  <RemarksPill key={remark.title} {...remark} />
                ))
              }
            </div>
          </div>
          <SelectForm
            id="ai-maintenance-status"
            options={aiStatuses}
            label="Panel Date:"
            defaultSort={selectedAIStatus}
            onSelectOption={value => setAIStatus(value.target.value)}
            disabled={false}
          />
          <div className="usa-form">
            <label>Corrections:</label>
            Lorem ipsum dolor sit amet
          </div>
        </div>
      </div>
    </div>
  );
};

AgendaItemMaintenancePane.propTypes = {
  leftExpanded: PropTypes.bool,
};

AgendaItemMaintenancePane.defaultProps = {
  leftExpanded: false,
};

export default AgendaItemMaintenancePane;
