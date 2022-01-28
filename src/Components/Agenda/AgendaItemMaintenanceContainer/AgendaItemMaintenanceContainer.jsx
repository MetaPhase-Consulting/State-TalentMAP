import { useState } from 'react';
import FontAwesome from 'react-fontawesome';
import InteractiveElement from 'Components/InteractiveElement';
import { Tooltip } from 'react-tippy';
import AgendaItemResearchPane from '../AgendaItemResearchPane';
import BackButton from '../../BackButton';

const AgendaItemMaintenanceContainer = () => {
  const [containerExpanded, setContainerExpanded] = useState(true);

  function toggleExpand() {
    setContainerExpanded(!containerExpanded);
  }

  const rotate = containerExpanded ? 'rotate(-180deg)' : 'rotate(0)';

  return (
    <div className="agenda-item-maintenance-container">
      <BackButton />
      <div className="ai-maintenance-containers">
        <div className={`maintenance-container-left${containerExpanded ? '' : '-expanded'}`}>
          Left Maintenance Container
          <div className="expand-arrow">
            <InteractiveElement onClick={toggleExpand}>
              <Tooltip
                title={containerExpanded ? 'Collapse container' : 'Expand container'}
                arrow
              >
                <FontAwesome
                  style={{ transform: rotate, transition: 'all 0.65s linear' }}
                  name="arrow-circle-left"
                  size="lg"
                />
              </Tooltip>
            </InteractiveElement>
          </div>
        </div>
        {
          containerExpanded &&
          <div className="maintenance-container-right">
            <AgendaItemResearchPane />
          </div>
        }
      </div>
    </div>
  );
};

export default AgendaItemMaintenanceContainer;
