import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TotalResults from '../TotalResults/TotalResults';
import SelectForm from '../SelectForm/SelectForm';
import SearchResultsExportLink from '../SearchResultsExportLink';
import PreferenceWrapper from '../../Containers/PreferenceWrapper';
import { POSITION_SEARCH_RESULTS, SORT_BY_PARENT_OBJECT } from '../../Constants/PropTypes';
import { POSITION_PAGE_SIZES_TYPE } from '../../Constants/Sort';
import PermissionsWrapper from '../../Containers/PermissionsWrapper';
import { Trigger } from '../SaveNewSearch';

class ResultsControls extends Component {
  constructor(props) {
    super(props);
    this.onSelectOrdering = this.onSelectOrdering.bind(this);
    this.onSelectLimit = this.onSelectLimit.bind(this);
  }

  onSelectOrdering(e) {
    this.props.queryParamUpdate({ ordering: e.target.value });
  }

  onSelectLimit(e) {
    this.props.queryParamUpdate({ limit: e.target.value });
  }

  render() {
    const { results, hasLoaded, defaultSort, pageSizes,
            defaultPageSize, defaultPageNumber, sortBy } = this.props;
    const { isProjectedVacancy } = this.context;
    return (
      <div className="usa-grid-full results-controls">
        <div className="usa-width-one-fifth total-results">
          {
            // if results have loaded, display the total number of results
            hasLoaded &&
              <TotalResults
                total={results.count}
                pageNumber={defaultPageNumber}
                pageSize={defaultPageSize}
              />
          }
        </div>
        <div className="usa-width-four-fifths drop-downs">
          <div className="dropdowns-container">
            <div className="results-dropdown results-dropdown-sort">
              <SelectForm
                id="sort"
                label="Sort by:"
                onSelectOption={this.onSelectOrdering}
                options={sortBy.options}
                defaultSort={defaultSort}
                className="select-blue select-offset select-small"
              />
            </div>
            {
              !isProjectedVacancy &&
              <div className="results-dropdown results-dropdown-page-size">
                <PreferenceWrapper onSelect={this.onSelectLimit} keyRef={POSITION_PAGE_SIZES_TYPE}>
                  <SelectForm
                    id="pageSize"
                    label="Results:"
                    options={pageSizes.options}
                    defaultSort={defaultPageSize}
                    transformValue={n => parseInt(n, 10)}
                    className="select-blue select-offset select-small"
                  />
                </PreferenceWrapper>
              </div>
            }
            <div className="results-download">
              <PermissionsWrapper
                permissions="superuser"
                fallback={
                  <span>
                    {
                      !isProjectedVacancy &&
                      <SearchResultsExportLink count={results.count} />
                    }
                  </span>
                }
              >
                <SearchResultsExportLink count={results.count} />
              </PermissionsWrapper>
            </div>
            {
              !isProjectedVacancy &&
                <Trigger isPrimary>
                  <button className="usa-button">Save Search</button>
                </Trigger>
            }
          </div>
        </div>
      </div>
    );
  }
}

ResultsControls.contextTypes = {
  isProjectedVacancy: PropTypes.bool,
};

ResultsControls.propTypes = {
  results: POSITION_SEARCH_RESULTS,
  sortBy: SORT_BY_PARENT_OBJECT.isRequired,
  defaultSort: PropTypes.node,
  pageSizes: SORT_BY_PARENT_OBJECT.isRequired,
  defaultPageSize: PropTypes.number,
  hasLoaded: PropTypes.bool,
  defaultPageNumber: PropTypes.number,
  queryParamUpdate: PropTypes.func.isRequired,
};

ResultsControls.defaultProps = {
  results: { results: [] },
  hasErrored: false,
  isLoading: true,
  defaultSort: '',
  defaultPageSize: 10,
  defaultPageNumber: 0,
  hasLoaded: false,
};

export default ResultsControls;
