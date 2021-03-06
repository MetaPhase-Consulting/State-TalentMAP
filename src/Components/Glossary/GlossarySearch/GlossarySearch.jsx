import PropTypes from 'prop-types';
import FieldSet from '../../FieldSet/FieldSet';
import TextInput from '../../TextInput';
import { GLOSSARY_SEARCH_ID } from '../../../Constants/HtmlAttributes';

const GlossarySearch = ({ changeText, searchTextValue }) => (
  <FieldSet
    className="glossary-fieldset"
    legend="Enter a keyword to search"
    legendSrOnly
  >
    <TextInput
      id={GLOSSARY_SEARCH_ID}
      label="Search terms"
      changeText={changeText}
      value={searchTextValue}
      labelSrOnly={false}
      placeholder="Search for terms"
      inputProps={{
        autoComplete: 'off',
      }}
    />
    <div className="glossary-search-sub">Example: Tandem</div>
  </FieldSet>
);

GlossarySearch.propTypes = {
  changeText: PropTypes.func.isRequired,
  searchTextValue: PropTypes.string,
};

GlossarySearch.defaultProps = {
  searchTextValue: '',
};

export default GlossarySearch;
