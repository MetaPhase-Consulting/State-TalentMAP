import { useState } from 'react';
import NavTabs from 'Components/NavTabs';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import MediaQuery from 'Components/MediaQuery';
import Spinner from 'Components/Spinner';
import { useDataLoader } from 'hooks';
import Alert from 'Components/Alert';
import Languages from 'Components/ProfileDashboard/Languages/Languages';
import AssignmentHistory from './AssignmentHistory';
import FrequentPositions from './FrequentPositions';
import api from '../../../api';

/* TODO replace with real data */
let positions = [
  { org: 'ORG NAME',
    position_number: '0000000000',
    position_title: 'ECONOMIC OFFICER LONGER NAME HERE (' },
  { org: 'A',
    position_number: '0000100000',
    position_title: 'ECONOMIC OFFICER' },
  { org: 'ORG NAME',
    position_number: '0000000000',
    position_title: 'TRAINING' },
];
positions = [...positions, ...positions, ...positions, ...positions];
/* end TODO */

const ASGH = 'asgh';
const FP = 'fp';
const L = 'l';
const RG = 'RG';
const TP = 'TP';
const AO = 'AO';
const AA = 'AA';
const tabs = [
  { text: 'Assignment History', value: ASGH },
  { text: 'Frequent Positions', value: FP },
  { text: 'Languages', value: L },
  { text: 'Remarks Glossary', value: RG },
  { text: 'Classifications', value: TP },
  { text: 'another one', value: AO },
  { text: 'another another', value: AA },
];

const AgendaItemResearchPane = props => {
  const { perdet } = props;

  const [selectedNav, setSelectedNav] = useState(get(tabs, '[0].value') || '');

  // assignments
  // eslint-disable-next-line max-len
  // const { data, error, loading /* , retry */ } = useDataLoader(api().get, `/fsbid/client/${perdet}/`);
  const { data, error, loading } = useDataLoader(api().get, `/fsbid/assignment_history/${perdet}/`);
  const assignments = get(data, 'data.results') || [];
  const languages = get(data, 'data.languages') || [];

  const onFPClick = pos => {
    // TODO - do something with this
    // eslint-disable-next-line
    console.log(pos);
  };

  return (
    <div className="ai-research-pane">
      <MediaQuery breakpoint="screenSmMax" widthType="max">
        {matches => (
          <NavTabs
            passNavValue={setSelectedNav}
            tabs={tabs}
            collapseToDd={matches}
            value={tabs[0].value}
          />
        )}
      </MediaQuery>
      <div className="ai-research-content">
        {
          loading && !error &&
            <Spinner type="homepage-position-results" size="small" />
        }
        {
          !loading && error &&
            <Alert type="error" title="Error loading data" messages={[{ body: 'This data may not be available.' }]} />
        }
        {
          selectedNav === ASGH && !loading && !error &&
            <AssignmentHistory
              assignments={assignments}
            />
        }
        {
          selectedNav === L && !loading && !error &&
            <Languages
              languagesArray={languages}
              useWrapper
            />
        }
        {
          selectedNav === FP && !loading && !error &&
            <FrequentPositions
              positions={positions}
              onClick={onFPClick}
            />
        }
      </div>
    </div>
  );
};

AgendaItemResearchPane.propTypes = {
  perdet: PropTypes.string.isRequired,
};

export default AgendaItemResearchPane;
