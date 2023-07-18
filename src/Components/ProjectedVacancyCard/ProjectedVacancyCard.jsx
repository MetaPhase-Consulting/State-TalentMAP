/* eslint-disable */
import { useState, useRef } from 'react';
import { get } from 'lodash';
import DatePicker from 'react-datepicker';
import { getDifferentials, getPostName, getResult } from 'utilities';
import { POSITION_DETAILS } from 'Constants/PropTypes';
import {
  NO_BUREAU, NO_DATE, NO_GRADE, NO_ORG, NO_POSITION_NUMBER, NO_POSITION_TITLE, NO_POST,
  NO_SKILL, NO_STATUS, NO_TOUR_END_DATE, NO_TOUR_OF_DUTY, NO_UPDATE_DATE, NO_USER_LISTED,
} from 'Constants/SystemMessages';
import TabbedCard from 'Components/TabbedCard';
import LanguageList from 'Components/LanguageList';
import ToggleButton from 'Components/ToggleButton';
import { Row } from 'Components/Layout';
import PositionExpandableContent from 'Components/PositionExpandableContent';
import Linkify from "react-linkify";
import TextareaAutosize from "react-textarea-autosize";
import FA from "react-fontawesome";


const ProjectedVacancyCard = ({ result }) => {
  // Start: fake temp data
  const bidSeasons = [
    'Winter 2010', 'Summer 2010', 'Winter 2011',
    'Summer 2011', 'Winter 2012', 'Summer 2012',
    'Winter 2013', 'Summer 2013', 'Winter 2014',
    'Summer 2014', 'Winter 2015', 'Summer 2015',
    'Winter 2016', 'Summer 2016', 'Winter 2017',
    'Summer 2017', 'Winter 2018', 'Summer 2018',
    'Winter 2019', 'Summer 2019', 'Winter 2020',
    'Summer 2020', 'Winter 2021', 'Summer 2021',
    'Winter 2022', 'Summer 2022', 'Winter 2023',
    'Summer 2023', 'Winter 2024', 'Summer 2024',
    'Winter 2025', 'Summer 2025', 'Winter 2026',
    'Summer 2026', 'Winter 2027', 'Summer 2027',
    'Winter 2028', 'Summer 2028', 'Winter 2029',
    'Summer 2029', 'Winter 2030', 'Summer 2030',
    'Winter 2031', 'Summer 2031', 'Winter 2032',
    'Summer 2032', 'Winter 2033', 'Summer 2033',
    'Winter 2034', 'Summer 2034'
  ];
  const bidSeasons$ = bidSeasons.map((b, i) => ({'code': i + 1, 'name': b}));
  const statusOptions = [
    { code: 1, name: 'Active' },
    { code: 2, name: 'Inactive' },
  ];
  const languageOffset = [
    { code: 1, name: '1 Month' },
    { code: 2, name: '2 Months' },
    { code: 3, name: '3 Months' },
    { code: 4, name: '4 Months' },
    { code: 5, name: '5 Months' },
    { code: 6, name: '6 Months' },
    { code: 7, name: '12 Months' },
    { code: 8, name: '18 Months' },
    { code: 9, name: '24 Months' },
    { code: 10, name: '30 Months' },
    { code: 11, name: '36 Months' },
  ];
  // End: fake temp data

  const datePickerRef = useRef(null);
  const openDatePicker = () => {
    datePickerRef.current.setOpen(true);
  }
  const [included, setIncluded] = useState(true);
  const [season, setSeason] = useState();
  const [status, setStatus] = useState();
  const [overrideTED, setOverrideTED] = useState();
  const [langOffsetSummer, setLangOffsetSummer] = useState();
  const [langOffsetWinter, setLangOffsetWinter] = useState();
  const [textArea, setTextArea] = useState(pos?.description?.content || 'No description.');


  const pos = get(result, 'position') || result;
  // const description$ = get(pos, 'description.content') || 'No description.';
  const updateUser = getResult(pos, 'description.last_editing_user');
  const updateDate = getResult(pos, 'description.date_updated');


  const sections = {
    /* eslint-disable quote-props */
    subheading: {
      'Position Number': getResult(pos, 'position_number', NO_POSITION_NUMBER),
      'Skill': getResult(pos, 'skill_code') || NO_SKILL,
      'Position Title': getResult(pos, 'title') || NO_POSITION_TITLE,
    },
    bodyPrimary: {
      'Assignee TED': getResult(pos, 'assignee') || NO_USER_LISTED,
      'Incumbent TED': getResult(pos, 'current_assignment.user') || NO_USER_LISTED,
      'Bid Season': getResult(pos, 'latest_bidcycle.name', 'None Listed'),
      'Tour of Duty': getResult(pos, 'post.tour_of_duty') || NO_TOUR_OF_DUTY,
      'Language': <LanguageList languages={getResult(pos, 'languages', [])} propToUse="representation" />,
    },
    bodySecondary: {
      'Bureau': getResult(pos, 'bureau_short_desc') || NO_BUREAU,
      'Location': getPostName(get(pos, 'post') || NO_POST),
      'Status': getResult(pos, 'status') || NO_STATUS,
      'Organization': getResult(pos, 'organization') || NO_ORG,
      'TED': getResult(result, 'ted') || NO_DATE,
      'Incumbent': getResult(pos, 'current_assignment.user') || NO_USER_LISTED,
      'Tour of Duty': getResult(pos, 'post.tour_of_duty') || NO_TOUR_OF_DUTY,
      'Language Offset Summer': '12 Months',
      'Language Offset Winter': '3 Months',
      'Skill': getResult(pos, 'skill_code') || NO_SKILL,
      'Grade': getResult(pos, 'grade') || NO_GRADE,
      'Pay Plan': '---',
      'Post Differential | Danger Pay': getDifferentials(pos),
    },
    textarea: get(pos, 'description.content') || 'No description.',
    metadata: {
      'Position Posted': getResult(pos, 'description.date_created') || NO_UPDATE_DATE,
      'Last Updated': (updateDate && updateUser) ? `${updateUser} ${updateDate}` : (updateDate || NO_UPDATE_DATE),
    },
    /* eslint-enable quote-props */
  };
  const form = {
    /* eslint-disable quote-props */
    staticBody: {
      'Assignee TED': getResult(pos, 'assignee') || NO_USER_LISTED,
      'Incumbent TED': getResult(pos, 'current_assignment.user') || NO_USER_LISTED,
      'Tour of Duty': getResult(pos, 'post.tour_of_duty') || NO_TOUR_OF_DUTY,
      'Language': <LanguageList languages={getResult(pos, 'languages', [])} propToUse="representation" />,
      'Bureau': getResult(pos, 'bureau_short_desc') || NO_BUREAU,
      'Location': getPostName(get(pos, 'post') || NO_POST),
      'Organization': getResult(pos, 'organization') || NO_ORG,
      'Incumbent': getResult(pos, 'current_assignment.user') || NO_USER_LISTED,
      'Skill': getResult(pos, 'skill_code') || NO_SKILL,
      'Grade': getResult(pos, 'grade') || NO_GRADE,
      'Pay Plan': '---',
      'Post Differential | Danger Pay': getDifferentials(pos),
    },
    inputBody: <div className="position-form">
      <div className="elsa">
        <div className="position-form--label-input-container">
          <label htmlFor="status">Bid Season</label>
          <select
            id="season"
            defaultValue={season}
            onChange={(e) => setSeason(e.target.name)}
          >
            {
              bidSeasons$.map(b => (
                <option value={b.code}>{b.name}</option>
              ))
            }
          </select>
        </div>
        <div  className="position-form--label-input-container">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            defaultValue={status}
            onChange={(e) => setStatus(e.target.name)}
          >
            {
              statusOptions.map(b => (
                <option value={b.code}>{b.name}</option>
              ))
            }
          </select>
        </div>
        <div  className="position-form--label-input-container">
          <label htmlFor="overrideTED">Override TED <small>(optional)</small></label>
          <div className="date-wrapper-react larger-date-picker">
            <FA name="fa fa-calendar" onClick={() => openDatePicker()} />
            <FA name="times" className={`${overrideTED ? '' : 'hide'}`} onClick={() => setOverrideTED(null)} />
            <DatePicker
              selected={overrideTED}
              onChange={setOverrideTED}
              dateFormat="MM/dd/yyyy"
              placeholderText={'MM/DD/YYY'}
              ref={datePickerRef}
            />
          </div>
        </div>
        <div  className="position-form--label-input-container">
          <label htmlFor="status">Language Offset Summer</label>
          <select
            id="langOffsetSummer"
            defaultValue={langOffsetSummer}
            onChange={(e) => setLangOffsetSummer(e.target.name)}
          >
            {
              languageOffset.map(b => (
                <option value={b.code}>{b.name}</option>
              ))
            }
          </select>
        </div>
        <div  className="position-form--label-input-container">
          <label htmlFor="status">Language Offset Winter</label>
          <select
            id="langOffsetWinter"
            defaultValue={langOffsetWinter}
            onChange={(e) => setLangOffsetWinter(e.target.name)}
          >
            {
              languageOffset.map(b => (
                <option value={b.code}>{b.name}</option>
              ))
            }
          </select>
        </div>
      </div>
      <div  className="position-form--label-input-container">
        <Row fluid className="position-form--description">
          <span className="definition-title">Position Details</span>
          <Linkify properties={{ target: '_blank' }}>
            <TextareaAutosize
              maxRows={6}
              minRows={6}
              maxlength="4000"
              name="position-description"
              placeholder="No Description"
              defaultValue={textArea}
              onChange={(e) => setTextArea(e.target.value)}
              draggable={false}
            />
          </Linkify>
          <div className="word-count">
            {textArea.length} / 4,000
          </div>
        </Row>
      </div>
    </div>,
    /* eslint-enable quote-props */
  };

  return (
    <TabbedCard
      tabs={[{
        text: 'Projected Vacancy Overview',
        value: 'OVERVIEW',
        content: (
          <div className="position-content--container">
            <PositionExpandableContent
              sections={sections}
              form={form}
            />
            <div className="toggle-include">
              <ToggleButton
                labelTextRight={!included ? 'Excluded' : 'Included'}
                checked={included}
                onChange={() => setIncluded(!included)}
                onColor="#0071BC"
              />
            </div>
          </div>
        ),
      }]}
    />
  );
};

ProjectedVacancyCard.propTypes = {
  result: POSITION_DETAILS.isRequired,
};

export default ProjectedVacancyCard;
