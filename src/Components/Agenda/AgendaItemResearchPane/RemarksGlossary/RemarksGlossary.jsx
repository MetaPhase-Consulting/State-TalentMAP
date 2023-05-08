import { useEffect, useState } from 'react';
import { find, get, isEqual, orderBy, uniqBy } from 'lodash';
import PropTypes from 'prop-types';
import FA from 'react-fontawesome';
import InteractiveElement from 'Components/InteractiveElement';
import TextInput from 'Components/TextInput';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';
import Fuse from 'fuse.js';

// eslint-disable-next-line no-unused-vars
const RemarksGlossary = ({ isReadOnly, remarks, remarkCategories,
  userSelections, updateSelection }) => {
  const [textInputs, setTextInputs] = useState({});
  const [exclusiveCategories, setExclusiveCategories] = useState({});

  const setTextInput = (rSeq, riSeq, value) => {
    const textInputs$ = { ...textInputs };

    if (!textInputs$[rSeq.toString()]) {
      textInputs$[rSeq.toString()] = {};
      textInputs$[rSeq.toString()][riSeq.toString()] = value;
    } else {
      textInputs$[rSeq.toString()][riSeq.toString()] = value;
    }
    setTextInputs(textInputs$);
  };

  const setTextInputBulk = () => {
    const remarksArr = remarks;
    const textInputs$ = {};

    remarksArr.forEach(r => {
      const userRemark = find(userSelections, { seq_num: r.seq_num });
      r.remark_inserts.forEach(ri => {
        const userRemarkInsert = find(userRemark?.user_remark_inserts,
          { aiririseqnum: ri.riseqnum });
        textInputs$[(r.seq_num).toString()] ??= {};
        textInputs$[(r.seq_num).toString()][(ri.riseqnum).toString()] =
          userRemarkInsert?.airiinsertiontext || ri.riinsertiontext;
      });
    });

    if (!isEqual(textInputs$, textInputs)) {
      setTextInputs(textInputs$);
    }
  };

  const getTextInputValue = (rSeq, riSeq) => textInputs?.[rSeq]?.[riSeq] || '';

  const renderText = (r, disabled) => {
    const rText = r?.text?.split(/(\s+)/) || '';
    const rInserts = r?.remark_inserts || [];

    rInserts.forEach((a) => {
      const rInsertionText = a?.riinsertiontext;
      const rTextI = rText.indexOf(rInsertionText);
      if (rTextI > -1) {
        let remarkInsertValue = getTextInputValue(get(a, 'rirmrkseqnum'), get(a, 'riseqnum'));
        remarkInsertValue = remarkInsertValue[0] === '{' ? '' : remarkInsertValue;

        rText.splice(rTextI, 1, <TextInput
          value={remarkInsertValue}
          changeText={v => setTextInput(get(a, 'rirmrkseqnum'), get(a, 'riseqnum'), v)}
          customContainerClass="remark-input"
          placeholder={rInsertionText.replace(/[{}\d]/g, '').replace(/#/g, 'number')}
          id="remarks-custom-input"
          key={a.riseqnum}
          inputProps={{ autoComplete: 'off' }}
          disabled={disabled}
        />);
      }
    });
    return (<>
      <div className="remark-input-container">{rText}</div>
    </>);
  };

  const renderExclusiveCats = () => {
    const localExclusiveCategories = { };
    // unfortunately we have to loop twice bc we can't trust all remarks in a category
    // to be consistent in their mutually_exclusive_ind status
    remarks.forEach(r => {
      if (r?.mutually_exclusive_ind === 'Y') {
        localExclusiveCategories[r?.rc_code] = { remarkCatSelected: false };
      }
    });
    remarks.forEach(r => {
      const exlusiveRCatCodes = Object.keys(localExclusiveCategories);
      if (exlusiveRCatCodes.includes(r?.rc_code)) {
        exclusiveCategories[r?.rc_code].seqNums ??= [];
        localExclusiveCategories[r?.rc_code].seqNums.push(r?.seq_num);
      }
    });
    setExclusiveCategories(localExclusiveCategories);
  };

  const updateExclusiveCats = () => {
    const exclusiveCats$ = { ...exclusiveCategories };

    // reset cats
    Object.keys(exclusiveCats$).forEach(c => {
      exclusiveCats$[c].remarkCatSelected = false;
    });

    userSelections.forEach(r => {
      if (exclusiveCats$[r.rc_code]) {
        exclusiveCats$[r.rc_code].remarkCatSelected = true;
      }
    });

    setExclusiveCategories(exclusiveCats$);
  };

  const remarkStatus = (r) => {
    let disabled = isReadOnly;
    let selected = false;

    if (find(userSelections, { seq_num: r.seq_num })) {
      selected = true;
    } else if (exclusiveCategories?.[r.rc_code]?.remarkCatSelected) {
      selected = false;
      disabled = true;
    }

    return { selected, disabled };
  };

  const [remarks$, setRemarks$] = useState(remarks);

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
      'text',
    ],
  };

  const fuse$ = new Fuse(remarks, fuseOptions);

  const search = a => setRemarks$(fuse$.search(a).map(({ item }) => item));
  const [term, setTerm] = useState('');

  const remarks$$ = term ? remarks$ : remarks;

  const remarkCategoriesCodes = uniqBy(remarkCategories, 'code');
  const remarkCategories$ = orderBy(remarkCategoriesCodes, 'desc_text');

  const processClick = remark => {
    const el = document.getElementById(`remark-category-${remark.code}`);
    el.scrollIntoView();
  };

  useEffect(() => {
    updateExclusiveCats();
  }, [userSelections]);

  useEffect(() => {
    renderExclusiveCats();
    setTextInputBulk();
  }, []);

  return (
    <div className="usa-grid-full remarks-glossary-container">
      <TextInput
        changeText={e => { search(e); setTerm(e); }}
        value={term}
        labelSrOnly
        placeholder="Search for Remarks"
        id="remarks-search"
        inputProps={{
          autoComplete: 'off',
        }}
      />
      <div className="remarks-glossary-container">
        <div className="usa-grid-full remarks-categories-container">
          {remarkCategories$.map(a => (
            <a key={a.desc_text} tabIndex={0} role="button" onClick={() => processClick(a)}>{a.desc_text}</a>))}
        </div>
        {remarkCategories$.map(category => {
          const remarksInCategory = orderBy(remarks$$.filter(f => f.rc_code === category.code), 'order_num');
          const isExclusiveCatText = exclusiveCategories?.[category.code] ? ' (one remark per this category)' : '';

          return (
            <div key={category.code}>
              <div id={`remark-category-${category.code}`} className={`remark-category remark-category--${category.code}`}>
                {category.desc_text}{isExclusiveCatText}
              </div>
              <ul>
                {remarksInCategory.map(r => {
                  const rStatus = remarkStatus(r);
                  return (<li key={r.seq_num}>
                    <InteractiveElement
                      onClick={() => rStatus.disabled ? {} : updateSelection(r, textInputs)}
                    >
                      <FA
                        name={`${rStatus.selected ? 'minus-circle' : 'plus-circle'}`}
                        className={`${rStatus.disabled ? 'fa-disabled' : ''}`}
                      />
                    </InteractiveElement>
                    {renderText(r, rStatus.disabled || rStatus.selected)}
                  </li>);
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

RemarksGlossary.propTypes = {
  isReadOnly: PropTypes.bool,
  userSelections: PropTypes.arrayOf(
    PropTypes.shape({
      seq_num: PropTypes.number,
      rc_code: PropTypes.string,
      order_num: PropTypes.number,
      short_desc_text: PropTypes.string,
      ari_insertions: PropTypes.shape({
        ri_seq_num: PropTypes.number,
        ari_insertion_text: PropTypes.string,
      }),
      mutually_exclusive_ind: PropTypes.string,
      text: PropTypes.string,
      active_ind: PropTypes.string,
    }),
  ),
  remarks: PropTypes.arrayOf(
    PropTypes.shape({
      seq_num: PropTypes.number,
      rc_code: PropTypes.string,
      order_num: PropTypes.number,
      short_desc_text: PropTypes.string,
      ri_insertions: PropTypes.arrayOf(
        PropTypes.shape({
          ri_seq_num: PropTypes.number,
          ri_insertion_text: PropTypes.string,
        }),
      ),
      mutually_exclusive_ind: PropTypes.string,
      text: PropTypes.string,
      ref_text: PropTypes.string,
      active_ind: PropTypes.string,
    }),
  ),
  remarkCategories: PropTypes.arrayOf(PropTypes.shape({})),
  updateSelection: PropTypes.func,
};

RemarksGlossary.defaultProps = {
  isReadOnly: false,
  remarks: [],
  remarkCategories: [],
  userSelections: [],
  updateSelection: EMPTY_FUNCTION,
};

export default RemarksGlossary;
