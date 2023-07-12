import { useState } from 'react';
import { get } from 'lodash';
import { getDifferentials, getResult } from 'Components/ResultsCard/ResultsCard';
import { getPostName } from 'utilities';
import { POSITION_DETAILS } from 'Constants/PropTypes';
import {
  NO_BUREAU, NO_DATE, NO_GRADE, NO_ORG, NO_POSITION_NUMBER, NO_POSITION_TITLE, NO_POST,
  NO_SKILL, NO_STATUS, NO_TOUR_OF_DUTY, NO_UPDATE_DATE, NO_USER_LISTED,
} from 'Constants/SystemMessages';
import CheckBox from 'Components/CheckBox';
import TabbedCard from 'Components/TabbedCard';
import LanguageList from 'Components/LanguageList';
import ToggleButton from 'Components/ToggleButton';
import PositionExpandableContent from 'Components/PositionExpandableContent';


const ProjectedVacancyCard = ({ result }) => {
  const [included, setIncluded] = useState(true);

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
      'Bureau': getResult(pos, 'bureau_short_desc') || NO_BUREAU,
      'Location': getPostName(get(pos, 'post') || NO_POST),
      'Org/Code': getResult(pos, 'bureau_code') || NO_ORG,
      'Grade': getResult(pos, 'grade') || NO_GRADE,
      'Status': getResult(pos, 'status') || NO_STATUS,
      '': <CheckBox id="deto" label="DETO" value disabled />,
    },
    bodySecondary: {
      'Bid Cycle': getResult(pos, 'latest_bidcycle.name', 'None Listed'),
      'TED': getResult(result, 'ted') || NO_DATE,
      'Incumbent': getResult(pos, 'current_assignment.user') || NO_USER_LISTED,
      'Language': <LanguageList languages={getResult(pos, 'languages', [])} propToUse="representation" />,
      'Tour of Duty': getResult(pos, 'post.tour_of_duty') || NO_TOUR_OF_DUTY,
      'Pay Plan': '---',
      'Assignee': '---',
      'Post Differential | Danger Pay': getDifferentials(pos),
    },
    textarea: get(pos, 'description.content') || 'No description.',
    metadata: {
      'Position Posted': getResult(pos, 'description.date_created') || NO_UPDATE_DATE,
      'Last Updated': (updateDate && updateUser) ? `${updateUser} ${updateDate}` : (updateDate || NO_UPDATE_DATE),
    },
    /* eslint-enable quote-props */
  };

  return (
    <TabbedCard
      tabs={[{
        text: 'Projected Vacancy Overview',
        value: 'OVERVIEW',
        content: (
          <div className="position-content--container">
            <PositionExpandableContent sections={sections} />
            <div className="toggle-include">
              <ToggleButton
                labelTextRight="Included"
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
