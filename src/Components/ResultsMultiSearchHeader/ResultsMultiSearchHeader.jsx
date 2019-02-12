import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { EMPTY_FUNCTION } from '../../Constants/PropTypes';
import SearchBar from '../SearchBar/SearchBar';

class ResultsMultiSearchHeader extends Component {
  constructor(props) {
    super(props);
    this.onChangeText = this.onChangeText.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
    this.state = {
      q: this.props.defaultFilters.q || '',
      qWasUpdated: false,
    };
  }

  componentWillMount() {
    this.setupDefaultValues(this.props);
  }

  componentWillReceiveProps(props) {
    this.setupDefaultValues(props);
  }

  onChangeText(e) {
    this.setState({ q: e.target.value, qWasUpdated: true }, this.filterChange);
  }

  // We'll save state in redux so that the component can be
  // unmounted and remounted and maintain state. This is useful for responsively rendering this
  // component while maintaining the selected search query.
  setupDefaultValues(props) {
    const { qWasUpdated } = this.state;
    const { defaultFilters } = props;

    const defaultQuery = defaultFilters.q;

    // set keyword to correct state
    if (!qWasUpdated && defaultQuery) {
      this.setState({ q: defaultQuery, qWasUpdated: true });
    }
  }

  formatQuery() {
    const { q } = this.state;
    const query = { q };
    return query;
  }

  // return all the filters upon submission
  submitSearch(e) {
    // resolves “Form submission canceled because the form is not connected” warning
    e.preventDefault();
    const query = this.formatQuery();
    this.props.onSubmit(query);
  }

  // return all the filters as an object whenever any change is made
  filterChange() {
    const query = this.formatQuery();
    this.props.onFilterChange(query);
  }

  render() {
    const { placeholder } = this.props;
    const { q } = this.state;
    return (
      <div className="results-search-bar padded-main-content results-multi-search">
        <div className="usa-grid-full results-search-bar-container">
          <form className="usa-grid-full" onSubmit={this.submitSearch} >
            <fieldset className="usa-width-one-whole">
              <div className="usa-grid-full">
                <div className="usa-grid-full">
                  <div className="usa-width-five-sixths search-results-inputs search-keyword">
                    <legend className="usa-grid-full">Find your next position</legend>
                    <SearchBar
                      id="multi-search-keyword-field"
                      label="Keywords"
                      type="medium"
                      submitText="Search"
                      labelSrOnly
                      noForm
                      noButton
                      placeholder={placeholder}
                      onChangeText={this.onChangeText}
                      defaultValue={q}
                    />
                    <div className="search-sub-text">Example: Abuja, Nigeria, Political Affairs (5505), Russian...</div>
                  </div>
                  <div className="usa-width-one-sixth search-submit-button">
                    <button className="usa-button" type="submit">
                      <FontAwesome name="search" className="label-icon" />
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}

ResultsMultiSearchHeader.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  defaultFilters: PropTypes.shape({
    q: PropTypes.string,
  }),
  placeholder: PropTypes.string,
  onFilterChange: PropTypes.func,
};

ResultsMultiSearchHeader.defaultProps = {
  defaultFilters: {},
  placeholder: 'Location, Skill, Grade, Language, Position number',
  onFilterChange: EMPTY_FUNCTION,
};

export default ResultsMultiSearchHeader;
