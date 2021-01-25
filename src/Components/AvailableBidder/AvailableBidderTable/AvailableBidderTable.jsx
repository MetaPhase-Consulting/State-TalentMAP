import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';
import { availableBiddersFetchData } from 'actions/availableBidders';
import { filtersFetchData } from 'actions/filters/filters';
import ToggleButton from 'Components/ToggleButton';
import ExportButton from 'Components/ExportButton';
import InteractiveElement from 'Components/InteractiveElement';
import { get } from 'lodash';
import AvailableBidderRow from 'Components/AvailableBidder/AvailableBidderRow';
import FA from 'react-fontawesome';
import { Tooltip } from 'react-tippy';
import shortid from 'shortid';


const AvailableBidderTable = (props) => {
  // CDO or Bureau version
  const { isCDO } = props;

  // Local state
  // Toggle view state within CDO version
  const [cdoView, setCdoView] = useState(true);
  const [sort, setSort] = useState('');

  // App state
  const biddersData = useSelector(state => state.availableBiddersFetchDataSuccess);
  const availableBiddersIsLoading = useSelector(state => state.availableBiddersFetchDataLoading);
  const filtersIsLoading = useSelector(state => state.filtersIsLoading);
  const filterData = useSelector(state => state.filters);

  const isLoading = availableBiddersIsLoading || filtersIsLoading;


  const bureaus = filterData.filters.find(f => f.item.description === 'region');

  const bidders = isLoading ? [...new Array(10)] : get(biddersData, 'results', []);

  // Actions
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(availableBiddersFetchData(isCDO));
    dispatch(filtersFetchData(filterData, {}));
  }, []);

  useEffect(() => {
    dispatch(availableBiddersFetchData(isCDO, sort));
  }, [sort]);

  const tableHeaders = isCDO ? [
    'Name',
    'Status',
    'Skill',
    'Grade',
    'TED',
    'Post',
    'OC Bureau',
    'OC Reason',
    'CDO',
    'Comments',
  ] : [
    'Name',
    'Skill',
    'Grade',
    'TED',
    'Post',
    'CDO',
  ];

  const getSortIcon = (header) => {
    if (header === sort) {
      return 'sort-desc';
    } else if (`-${header}` === sort) {
      return 'sort-asc';
    }
    return 'sort';
  };

  const handleSort = (header) => (
    // Dynamically set the sort asc or desc('-'). Requires updates with real data
    header === sort ? setSort(`-${header}`) : setSort(header)
  );

  let title = 'Bureau View';
  if (isCDO) {
    title = cdoView ? 'Internal CDA View' : 'External Bureau View';
  }

  return (
    <div className="usa-width-one-whole bidder-manager-bidders ab-lower-section">
      <div className="ab-table-title-row">
        <h3>{title}</h3>
        <div className="export-button-container">
          <ExportButton />
        </div>
      </div>
      {
        <table className="bidder-manager-bidders">
          <thead>
            <tr />
            <tr>
              {
                tableHeaders.map(item => (
                  <th
                    key={shortid.generate()}
                    className="ab-headers"
                    scope="col"
                  >
                    <InteractiveElement onClick={() => handleSort(item)}>
                      {item} <FA name={getSortIcon(item)} />
                    </InteractiveElement>
                  </th>
                ))
              }
              {
                isCDO &&
                  <th className="action-header">
                    <div className="bureau-view-toggle">
                      <ToggleButton
                        labelTextLeft={
                          <Tooltip
                            title="CDO View"
                            arrow
                            offset={-95}
                            position="top-end"
                            tabIndex="0"
                          >
                            <FA name="street-view" className={`fa-lg ${cdoView ? 'active' : ''}`} />
                          </Tooltip>
                        }
                        labelTextRight={
                          <Tooltip
                            title="Bureau View"
                            arrow
                            offset={-95}
                            position="top-end"
                            tabIndex="0"
                          >
                            <FA name="building" className={`fa-lg ${!cdoView ? 'active' : ''}`} />
                          </Tooltip>
                        }
                        checked={!cdoView}
                        onChange={() => setCdoView(!cdoView)}
                        onColor="#86d3ff"
                        onHandleColor="#2693e6"
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      />
                    </div>
                  </th>
              }
            </tr>
          </thead>
          <tbody>
            {
              bidders.map(bidder => (
                <AvailableBidderRow
                  key={get(bidder, 'bidder_perdet') || get(bidder, 'perdet_seq_number')}
                  bidder={bidder}
                  CDOView={cdoView}
                  isCDO={isCDO}
                  isLoading={isLoading}
                  bureaus={bureaus}
                />
              ))
            }
          </tbody>
        </table>
      }
    </div>
  );
};

AvailableBidderTable.propTypes = {
  isCDO: PropTypes.bool,
};

AvailableBidderTable.defaultProps = {
  bidders: [],
  onSort: EMPTY_FUNCTION,
  onFilter: EMPTY_FUNCTION,
  isCDO: false,
};

export default AvailableBidderTable;
