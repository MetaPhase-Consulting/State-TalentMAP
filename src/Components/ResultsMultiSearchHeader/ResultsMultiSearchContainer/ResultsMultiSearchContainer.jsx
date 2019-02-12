import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withRouter } from 'react-router';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { setSelectedSearchbarFilters } from '../../../actions/selectedSearchbarFilters';
import { EMPTY_FUNCTION } from '../../../Constants/PropTypes';
import ResultsMultiSearchHeader from '../ResultsMultiSearchHeader';

class ResultsMultiSearchHeaderContainer extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.state = {
      query: {
        q: '',
      },
    };
  }

  onFilterChange(q) {
    const { setSearchFilters } = this.props;
    setSearchFilters({ ...q });
  }

  onSubmit(q) {
    const query = q;
    const stringifiedFilterValues = {};
    // Form query object by iterating through keys.
    Object.keys(query).forEach((key) => {
      // Is there a value for the key?
      if (query[key] && query[key].length) {
        // If it's an array, split it. Else, simply return the string.
        const isArray = Array.isArray(query[key]);
        if (isArray) {
          stringifiedFilterValues[key] = query[key].join();
        } else {
          stringifiedFilterValues[key] = query[key];
        }
      }
      // If there's no value for a key, delete it from the object.
      if (!stringifiedFilterValues[key] || !stringifiedFilterValues[key].length) {
        delete stringifiedFilterValues[key];
      }
    });
    // Stringify the object
    const qString = queryString.stringify(stringifiedFilterValues);
    // Navigate to results with the formed query.
    this.props.onNavigateTo(`/results?${qString}`);
  }

  render() {
    const { searchbarFilters } = this.props;
    return (
      <ResultsMultiSearchHeader
        onSubmit={this.onSubmit}
        onFilterChange={this.onFilterChange}
        defaultFilters={searchbarFilters}
      />
    );
  }
}

ResultsMultiSearchHeaderContainer.propTypes = {
  onNavigateTo: PropTypes.func.isRequired,
  setSearchFilters: PropTypes.func.isRequired,
  searchbarFilters: PropTypes.shape({}),
};

ResultsMultiSearchHeaderContainer.defaultProps = {
  setSearchFilters: EMPTY_FUNCTION,
  searchbarFilters: {},
};

const mapStateToProps = state => ({
  searchbarFilters: state.selectedSearchbarFilters,
});

export const mapDispatchToProps = dispatch => ({
  onNavigateTo: dest => dispatch(push(dest)),
  setSearchFilters: query => dispatch(setSelectedSearchbarFilters(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(ResultsMultiSearchHeaderContainer),
);
