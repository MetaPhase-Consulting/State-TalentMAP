import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import queryString from 'query-string';
import { CSVLink } from '../CSV';
import { POSITION_SEARCH_SORTS } from '../../Constants/Sort';
import { fetchResultData } from '../../actions/results';
import { formatDate, getFormattedNumCSV, spliceStringForCSV } from '../../utilities';
import ExportButton from '../ExportButton';

// Mapping columns to data fields
const HEADERS = [
  { label: 'Position', key: 'title' },
  { label: 'Position number', key: 'position_number' },
  { label: 'Skill', key: 'skill' },
  { label: 'Grade', key: 'grade' },
  { label: 'Bureau', key: 'bureau' },
  { label: 'Post city', key: 'post.location.city' },
  { label: 'Post country', key: 'post.location.country' },
  { label: 'Tour of duty', key: 'post.tour_of_duty' },
  { label: 'Language', key: 'languages[0].representation' },
  { label: 'Post differential', key: 'post.differential_rate' },
  { label: 'Danger pay', key: 'post.danger_pay' },
  { label: 'TED', key: 'estimated_end_date' },
  { label: 'Incumbent', key: 'current_assignment.user' },
];

// Processes results before sending to the download component to allow for custom formatting.
export const processData = data => (
  data.map((entry) => {
    const endDate = get(entry, 'current_assignment.estimated_end_date');
    const formattedEndDate = endDate ? formatDate(endDate) : null;
    return {
      ...entry,
      position_number: getFormattedNumCSV(entry.position_number),
      grade: getFormattedNumCSV(entry.grade),
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
