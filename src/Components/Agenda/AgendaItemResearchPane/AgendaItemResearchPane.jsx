import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavTabs from 'Components/NavTabs';
import { get, includes } from 'lodash';
import PropTypes from 'prop-types';
import MediaQuery from 'Components/MediaQuery';
import Spinner from 'Components/Spinner';
import { useDataLoader } from 'hooks';
import Alert from 'Components/Alert';
import Languages from 'Components/ProfileDashboard/Languages/Languages';
import { fetchClassifications, fetchUserClassifications } from 'actions/classifications';
import { addFrequentPositionsData } from 'actions/positions';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';
import AssignmentHistory from './AssignmentHistory';
import FrequentPositions from './FrequentPositions';
import RemarksGlossary from './RemarksGlossary';
import Classifications from './Classifications';
import api from '../../../api';

export const ASGH = 'asgh';
export const FP = 'fp';
export const L = 'l';
export const RG = 'RG';
export const TP = 'TP';
export const AO = 'AO';
export const AA = 'AA';
const tabs = [
  { text: 'Assignment History', value: ASGH },
  { text: 'Frequent Positions', value: FP },
  { text: 'Languages', value: L },
  { text: 'Remarks Glossary', value: RG },
  { text: 'Classifications', value: TP },
];

const AgendaItemResearchPane = forwardRef((props = { perdet: '', clientData: {}, updateSelection: '', userSelection: [], legCount: 0, isReadOnly: false }, ref) => {
  const navTabRef = useRef();
  const dispatch = useDispatch();

  const { perdet, clientData, userSelections, updateSelection, legCount,
    isReadOnly, clientLoading } = props;

  const [selectedNav, setSelectedNav] = useState(get(tabs, '[0].value') || '');
  const classifications = useSelector(state => state.classifications);
  const clientClassifications = useSelector(state => state.userClassifications);

  const classificationsProps = { classifications, clientClassifications };

  const { data: asgHistory, error: asgHistError, loading: asgHistLoading } = useDataLoader(api().get, `/fsbid/assignment_history/${perdet}/`);
  const { data: remarks, error: remarksDataError, loading: remarksDataLoading } = useDataLoader(api().get, '/fsbid/agenda/remarks/');
  const { data: frequentPositionsResults, error: frequentPositionsError, loading: frequentPositionsLoading } = useDataLoader(api().get, '/fsbid/positions/frequent_positions/');
  const { data: remarkCategories, error: rmrkCatError, loading: rmrkCatLoading } = useDataLoader(api().get, '/fsbid/agenda/remark-categories/');
  const clientErrored = clientData ? false : true;

  const assignments = get(asgHistory, 'data') || [];
  const languages = get(clientData, 'data.data.languages') || [];
  const remarks_data = get(remarks, 'data.results') || [];
  const remarkCategories_data = get(remarkCategories, 'data.results') || [];
  const frequentPositions = get(frequentPositionsResults, 'data.results') || [];

  const groupLoading = includes([asgHistLoading, remarksDataLoading,
    frequentPositionsLoading, rmrkCatLoading, clientLoading], true);
  const groupError = includes([asgHistError, remarksDataError,
    frequentPositionsError, rmrkCatError, clientErrored], true);

  const legLimit = legCount >= 10;

  const addFrequentPosition = pos => {
    const posNumber = get(pos, 'pos_num_text') || '';
    if (!legLimit) {
      dispatch(addFrequentPositionsData(`limit=50&page=1&position_num=${posNumber}`));
    }
  };

  useImperativeHandle(ref, () => ({
    setSelectedNav: e => {
      navTabRef.current.setSelectedNav(e);
    },
  }));

  useEffect(() => {
    dispatch(fetchClassifications());
    dispatch(fetchUserClassifications(perdet));
  }, []);

  return (
    <div className="ai-research-pane">
      <MediaQuery breakpoint="screenSmMax" widthType="max">
        {matches => (
          <NavTabs
            passNavValue={setSelectedNav}
            tabs={tabs}
            collapseToDd={matches}
            value={selectedNav}
            ref={navTabRef}
          />
        )}
      </MediaQuery>
      <div className="ai-research-content">
        {
          groupLoading && !groupError &&
            <Spinner type="homepage-position-results" size="small" />
        }
        {
          !groupLoading && groupError &&
            <Alert type="error" title="Error loading data" messages={[{ body: 'This data may not be available.' }]} />
        }
        {/* headers should always be hidden in the nav view */}
        {
          selectedNav === ASGH && !groupLoading && !asgHistError &&
            <AssignmentHistory
              assignments={assignments}
            />
        }
        {
          selectedNav === L && !groupLoading && languages &&
            <Languages
              languagesArray={languages}
              useWrapper
              showHeader={false}
            />
        }
        {
          selectedNav === FP && !groupLoading && !frequentPositionsError &&
            <FrequentPositions
              positions={frequentPositions}
              addFrequentPosition={addFrequentPosition}
              disabled={((legCount >= 10) || isReadOnly)}
            />
        }
        {
          selectedNav === TP && !groupLoading && classifications &&
          <div id="aim-classifications"> {/* needed for css specificity */}
            <Classifications {...classificationsProps} />
          </div>
        }
        {
          selectedNav === RG && !groupLoading && !remarksDataError &&
            <RemarksGlossary
              remarks={remarks_data}
              remarkCategories={remarkCategories_data}
              userSelections={userSelections}
              updateSelection={updateSelection}
            />
        }
      </div>
    </div>
  );
});

AgendaItemResearchPane.propTypes = {
  perdet: PropTypes.string.isRequired,
  clientData: PropTypes.shape({}),
  updateSelection: PropTypes.func,
  userSelections: PropTypes.arrayOf(
    PropTypes.shape({
      seq_num: PropTypes.number,
      rc_code: PropTypes.string,
      order_num: PropTypes.number,
      short_desc_text: PropTypes.string,
      mutually_exclusive_ind: PropTypes.string,
      text: PropTypes.string,
      active_ind: PropTypes.string,
    }),
  ),
  legCount: PropTypes.number,
  isReadOnly: PropTypes.bool,
};

AgendaItemResearchPane.defaultProps = {
  clientData: {},
  updateSelection: EMPTY_FUNCTION,
  userSelections: [],
  legCount: 0,
  isReadOnly: false,
};

export default AgendaItemResearchPane;
