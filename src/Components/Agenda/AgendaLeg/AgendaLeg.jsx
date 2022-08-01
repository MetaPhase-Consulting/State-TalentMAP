import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';
import { get } from 'lodash';
import FA from 'react-fontawesome';
import InteractiveElement from 'Components/InteractiveElement';
import Calendar from 'react-calendar';
import { format, isDate } from 'date-fns-v2';

const AgendaLeg = props => {
  const {
    leg,
    legNum,
    onClose,
    TODs,
    legActionTypes,
    travelFunctions,
  } = props;

  // eslint-disable-next-line no-unused-vars
  const onClose$ = () => {
    onClose(leg);
  };

  const [calendarHidden, setCalendarHidden] = useState(true);
  const [TED, setTED] = useState(get(leg, 'ted'));
  const [TOD, setTOD] = useState(get(leg, 'tod'));
  const [action, setAction] = useState(get(leg, 'action'));
  const [travel, setTravel] = useState(get(leg, 'travel'));

  useEffect(() => {
  //  call parent and update leg to populate down the changes
  }, [TED, TOD, action, travel]);

  const updateDropdown = (dropdown, value) => {
    // eslint-disable-next-line default-case
    switch (dropdown) {
      case 'ted':
        setTED(value);
        setCalendarHidden(true);
        break;
      case 'TOD':
        setTOD(value);
        break;
      case 'action':
        setAction(value);
        break;
      case 'travel':
        setTravel(value);
        break;
    }
  };

  const getDropdown = (key, data, text) => (
    <select
      className="leg-dropdown"
      defaultValue={key}
      onChange={(e) => updateDropdown(key, e.target.value)}
    >
      {
        data.map(a => (
          <option key={get(a, key)} value={get(a, 'code')}>{get(a, text)}</option>
        ))
      }
    </select>
  );

  const formatDate = (d) => d && isDate(new Date(d)) ? format(new Date(d), 'MM/dd/yy') : '';

  const getCalendar = () => (
    <>
      {formatDate(TED)}
      <FA name="calendar" style={{ color: `${calendarHidden ? 'black' : 'red'}` }} onClick={() => setCalendarHidden(!calendarHidden)} />
      {
        !calendarHidden &&
            <div className="ted-calendar-container" id={`cal-${legNum}`}>
              <Calendar
                className="ted-react-calendar"
                onChange={(e) => updateDropdown('ted', e)}
                selected={TED}
              />
            </div>
      }
    </>
  );

  const getArrows = () => (
    <div className="arrow">
      <FA name="arrow-down" />
    </div>
  );

  const columnData = [
    {
      title: 'Position Title',
      content: (<div>{get(leg, 'pos_title')}</div>),
    },
    {
      title: 'Position Number',
      content: (<div>{get(leg, 'pos_num')}</div>),
    },
    {
      title: 'Grade',
      content: (<div>{get(leg, 'grade')}</div>),
    },
    {
      title: 'Language',
      content: (<div>{get(leg, 'language')}</div>),
    },
    {
      title: 'Org',
      content: (<div>{get(leg, 'org')}</div>),
    },
    {
      title: 'ETA',
      content: (<div>{formatDate(get(leg, 'eta'))}</div>),
    },
    {
      title: '',
      content: (getArrows()),
    },
    {
      title: 'TED',
      content: (getCalendar()),
    },
    {
      title: 'TOD',
      content: (getDropdown('TOD', TODs, 'short_description')),
    },
    {
      title: 'Action',
      content: (getDropdown('action', legActionTypes, 'abbr_desc_text')),
    },
    {
      title: 'Travel',
      content: (getDropdown('travel', travelFunctions, 'abbr_desc_text')),
    },
  ];

  return (
    <>
      <div className={`grid-col-${legNum} grid-row-1`}>
        <InteractiveElement className="remove-leg-button" onClick={() => onClose$(leg)} title="Remove leg">
          <FA name="times" />
        </InteractiveElement>
      </div>
      {
        columnData.map((cData, i) => (
          <div className={`grid-col-${legNum} grid-row-${i + 2}`}>
            {cData.content}
          </div>
        ))
      }
    </>
  );
};

AgendaLeg.propTypes = {
  leg: PropTypes.shape({}),
  legNum: PropTypes.number.isRequired,
  TODs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  legActionTypes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  travelFunctions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onClose: PropTypes.func.isRequired,
};

AgendaLeg.defaultProps = {
  leg: {},
  onClose: EMPTY_FUNCTION,
};

export default AgendaLeg;
