import { useState } from 'react';
import PropTypes from 'prop-types';
import FA from 'react-fontawesome';
import InteractiveElement from 'Components/InteractiveElement';
import { formatDate, formatLang } from 'utilities';
import { DEFAULT_TEXT } from 'Constants/SystemMessages';
import Alert from '../../Alert';
import { formatVice } from '../Constants';

const AgendaItemLegsFormReadOnly = props => {
  const { legs } = props;

  const showOverlay = !legs.length;
  const [rowHoverNum, setRowHoverNum] = useState();

  const onHover = row => {
    // to avoid highlighting the arrow row
    // Note: varies by -1 from the editable version bc of the row of Xs to remove legs
    if (row !== 7) {
      setRowHoverNum(row);
    }
  };

  const getArrows = (hide = false) => (
    <div className={`${hide ? 'hide' : ''} arrow`}>
      <FA name="arrow-down" />
    </div>
  );

  const columnData = [
    {
      title: 'Position Title',
      content: (a => <div>{a?.pos_title || DEFAULT_TEXT}</div>),
    },
    {
      title: 'Position Number',
      content: (a => <div>{a?.pos_num || DEFAULT_TEXT}</div>),
    },
    {
      title: 'Org',
      content: (a => <div>{a?.org || DEFAULT_TEXT}</div>),
    },
    {
      title: 'Lang',
      content: (a => <div>{formatLang(a?.languages) || DEFAULT_TEXT}</div>),
    },
    {
      title: 'Skills',
      content: (a => <div>{a?.custom_skills_description || DEFAULT_TEXT}</div>),
    },
    {
      title: 'ETA',
      content: (a => <div>{formatDate(a?.eta) || DEFAULT_TEXT}</div>),
    },
    {
      title: '',
      content: ((a) => getArrows(a?.is_separation)),
    },
    {
      title: 'TED',
      content: (a => <div>{ !a?.ted ? DEFAULT_TEXT : formatDate(a?.ted)}</div>),
    },
    {
      title: 'TOD',
      content: (a => <div>{a?.tod_long_desc || DEFAULT_TEXT}</div>),
    },
    {
      title: 'Action',
      content: (a => <div>{a?.action || DEFAULT_TEXT}</div>),
    },
    {
      title: 'Travel',
      content: (a => <div>{a?.travel || DEFAULT_TEXT}</div>),
    },
    {
      title: 'Vice',
      content: (a => formatVice(a?.vice)),
    },
    {
      title: 'PP/Grade',
      content: (a => <div>{a?.combined_pp_grade || DEFAULT_TEXT}</div>),
    },
  ];

  return (
    <>
      {
        showOverlay &&
        <Alert type="info" title="No Agenda Item Legs" />
      }
      {
        !showOverlay &&
          <div className="legs-form-container">
            <div className="legs-form">
              {
                columnData.map((cData, i) => (
                  <InteractiveElement
                    className={`grid-col-1-read-only grid-row-${i + 1}-read-only${rowHoverNum === (i + 1) ? ' grid-row-hover' : ''}`}
                    onMouseOver={() => onHover(i + 1)}
                    onMouseLeave={() => onHover('')}
                    key={cData.title}
                  >
                    {cData.title}
                  </InteractiveElement>
                ))
              }
              {
                legs.map((leg, i) => {
                  // css grid count starts at 1 and we have to offset by 1 for the title column
                  const colNum = i + 2;
                  return (
                    <>
                      {
                        columnData.map((cData, ii) => (
                          <InteractiveElement
                            className={`grid-col-${colNum}-read-only grid-row-${ii + 1}-read-only${rowHoverNum === (ii + 1) ? ' grid-row-hover' : ''}`}
                            onMouseOver={() => onHover(ii + 1)}
                            onMouseLeave={() => onHover('')}
                            key={cData.title}
                          >
                            {cData.content(leg)}
                          </InteractiveElement>
                        ))
                      }
                    </>
                  );
                })
              }
            </div>
          </div>
      }
    </>
  );
};

AgendaItemLegsFormReadOnly.propTypes = {
  legs: PropTypes.arrayOf(PropTypes.shape({})),
};

AgendaItemLegsFormReadOnly.defaultProps = {
  legs: [],
};

export default AgendaItemLegsFormReadOnly;
