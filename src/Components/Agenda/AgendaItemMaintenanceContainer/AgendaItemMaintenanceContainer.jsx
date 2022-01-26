import { useState } from 'react';
import FontAwesome from 'react-fontawesome';
import InteractiveElement from 'Components/InteractiveElement';
import { Tooltip } from 'react-tippy';
import BackButton from '../../BackButton';

const AgendaItemMaintenanceContainer = () => {
  const [expandContainer, setExpandContainer] = useState(true);

  function toggleExpand() {
    setExpandContainer(!expandContainer);
  }

  const rotate = expandContainer ? 'rotate(-180deg)' : 'rotate(0)';

  return (
    <div className="agenda-item-maintenace-container">
      <BackButton />
      <div>
        <div className={`maintenance-container-left${expandContainer ? '' : '-expanded'}`}>
          Left Maintenance Container
          <InteractiveElement onClick={toggleExpand}>
            <Tooltip
              title={expandContainer ? 'Expand container' : 'Collapse container'}
              arrow
            >
              <FontAwesome
                style={{ transform: rotate, transition: 'all 0.65s linear' }}
                name="arrow-circle-left"
              />
            </Tooltip>
          </InteractiveElement>
        </div>
        {
          expandContainer &&
          <div className="maintenance-container-right">
            Right Maintenance Container
          </div>
        }
      </div>
    </div>
  );
};

export default AgendaItemMaintenanceContainer;
