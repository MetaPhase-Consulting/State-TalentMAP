import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FA from 'react-fontawesome';
import Fuse from 'fuse.js';
import InteractiveElement from 'Components/InteractiveElement';
import FieldSet from 'Components/FieldSet/FieldSet';
import TextInput from 'Components/TextInput';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';
import { useSelector } from 'react-redux';

const fuseOptions = {
  shouldSort: false,
  findAllMatches: true,
  tokenize: true,
  includeScore: false,
  threshold: 0.25,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    'pos_org_short_desc', 'pos_num_text', 'pos_title_desc',
  ],
};

const FrequentPositions = (props) => {
  const headers = ['', 'Organization', 'Position Number', 'Position Title'];

  const { positions, addFrequentPosition, disabled } = props;
  const isLoading = useSelector(state => state.frequentPositionsIsLoading);

  const [positions$, setPositions$] = useState(positions);
  const [term, setTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');

  const addFrequentPosition$ = pos => {
    setSelectedPosition(pos);
    addFrequentPosition(pos);
  };

  const fuse$ = new Fuse(positions, fuseOptions);
  const search = a => setPositions$(fuse$.search(a).map(({ item }) => item));

  useEffect(() => {
    setPositions$(positions);
  }, [positions]);

  const positions$$ = term ? positions$ : positions;

  return (
    <div className="frequent-positions-table">
      <div className="filter">
        <FieldSet
          className="glossary-fieldset"
          legend="Enter a keyword to search"
          legendSrOnly
        >
          <TextInput
            changeText={e => { search(e); setTerm(e); }}
            value={term}
            id={'frequent-positions-search'}
            labelSrOnly
            placeholder="Search for Frequent Positions"
            inputProps={{
              autoComplete: 'off',
            }}
          />
        </FieldSet>
        <FA name={term && 'close'} onClick={() => setTerm('')} />
      </div>
      <table>
        <thead>
          <tr>
            {headers.map(h => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {
            positions$$.map(m => (
              <tr key={`${m.pos_num_text}-${m.pos_org_short_desc}`}>
                <td>
                  <InteractiveElement
                    onClick={disabled ? () => {} : () => addFrequentPosition$(m)}
                    title="Add to Agenda Item"
                  >
                    {
                      (isLoading && (selectedPosition === m)) ?
                        <span className="ds-c-spinner spinner-blue" />
                        :
                        <FA
                          name="plus-circle"
                          className={`${disabled ? 'fa-disabled' : 'fa-enabled'}`}
                        />
                    }
                  </InteractiveElement>
                </td>
                <td>{m.pos_org_short_desc}</td>
                <td>{m.pos_num_text}</td>
                <td>{m.pos_title_desc}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

FrequentPositions.propTypes = {
  positions: PropTypes.arrayOf(PropTypes.shape({
    pos_org_short_desc: PropTypes.string,
    pos_num_text: PropTypes.string,
    pos_title_desc: PropTypes.string,
  })),
  addFrequentPosition: PropTypes.func,
  disabled: PropTypes.bool,
};

FrequentPositions.defaultProps = {
  positions: [],
  addFrequentPosition: EMPTY_FUNCTION,
  disabled: false,
};

export default FrequentPositions;
