import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get, mapValues } from 'lodash';
import queryString from 'query-string';
import { CSVLink } from '../CSV';
import { POSITION_SEARCH_SORTS } from '../../Constants/Sort';
import { fetchResultData } from '../../actions/results';
import { formatDate, getFormattedNumCSV, spliceStringForCSV } from '../../utilities';
import ExportButton from '../ExportButton';

// Mapping columns to data fields
// Use custom delimiter of flattened data
const HEADERS = [
  { label: 'Position', key: 'position.title' },
  { label: 'Position number', key: 'position.position_number' },
  { label: 'Skill', key: 'position.skill' },
  { label: 'Grade', key: 'position.grade' },
  { label: 'Bureau', key: 'position.bureau' },
  { label: 'Post city', key: 'position.post.location.city' },
  { label: 'Post country', key: 'position.post.location.country' },
  { label: 'Tour of duty', key: 'position.post.tour_of_duty' },
  { label: 'Language', key: 'position.languages[0].representation' },
  { label: 'Post differential', key: 'position.post.differential_rate' },
  { label: 'Danger pay', key: 'position.post.danger_pay' },
  { label: 'TED', key: 'position.estimated_end_date' },
  { label: 'Incumbent', key: 'position.current_assignment.user' },
];

// Processes results before sending to the download component to allow for custom formatting.
// Flatten data with custom delimiter.
export const processData = data => (
  data.map((entry) => {
    const endDate = get(entry, 'position.current_assignment.estimated_end_date');
    const formattedEndDate = endDate ? formatDate(endDate) : null;
    return {
      ...mapValues(entry, x => !x ? '' : x), // eslint-disable-line no-confusing-arrow
      position_number: getFormattedNumCSV(entry.position.position_number),
      grade: getFormattedNumCSV(entry.position.grade),
      estimated_end_date: formattedEndDate,
    };
  })
);


class SearchResultsExportLink extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.state = {
      isLoading: false,
      data: '',
      query: { value: window.location.search.replace('?', '') || '' },
    };
  }

  componentWillReceiveProps() {
    const query = window.location.search.replace('?', '') || '';
    if (this.state.query.value !== query) {
      this.setState({ query: { value: query } });
    }
  }

  onClick() {
    const { isLoading } = this.state;
    if (!isLoading) {
      // reset the state to support multiple clicks
      this.setState({ data: '', isLoading: true });
      const query = {
        ordering: POSITION_SEARCH_SORTS.defaultSort,
        ...queryString.parse(this.state.query.value),
        limit: this.props.count,
        page: 1,
      };
      fetchResultData(queryString.stringify(query))
      .then((results) => {
        const data = processData(results.results);
        this.setState({ data, isLoading: false }, () => {
          // click the CSVLink component to trigger the CSV download
          // This is needed for the download to work in Edge.
          if (this.csvLink) { this.csvLink.link.click(); }
        });
      })
      .catch(() => {
        this.setState({ isLoading: false });
      });
    }
  }

  render() {
    const { data, isLoading } = this.state;
    return (
      <div className="export-button-container">
        <ExportButton onClick={this.onClick} isLoading={isLoading} />
        <CSVLink
          tabIndex="-1"
          transform={spliceStringForCSV}
          ref={(x) => { this.csvLink = x; }}
          target="_blank"
          filename={this.props.filename}
          data={data}
          headers={HEADERS}
        />
      </div>
    );
  }
}

SearchResultsExportLink.propTypes = {
  count: PropTypes.number,
  filename: PropTypes.string,
};

SearchResultsExportLink.defaultProps = {
  count: 0,
  filename: 'TalentMap_search_export.csv',
};

export default SearchResultsExportLink;
