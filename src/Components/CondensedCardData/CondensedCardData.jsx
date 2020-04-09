import React from 'react';
import { get } from 'lodash';
import { POSITION_DETAILS } from '../../Constants/PropTypes';
import { NO_DATE, NO_GRADE, NO_SKILL } from '../../Constants/SystemMessages';
import LanguageList from '../LanguageList';
import CondensedCardDataPoint from './CondensedCardDataPoint';
import { formatDate, propOrDefault } from '../../utilities';

const CondensedCardData = ({ position }) => {
  const estimatedEndDate = propOrDefault(position, 'ted') ?
    formatDate(position.ted) : NO_DATE;
  return (
    <div className="usa-grid-full condensed-card-data">
      <CondensedCardDataPoint
        title="TED"
        content={estimatedEndDate}
        hasFixedTitleWidth
      />
      <CondensedCardDataPoint
        title="Skill"
        content={get(position, 'position.skill', NO_SKILL)}
        hasFixedTitleWidth
      />
      <CondensedCardDataPoint
        title="Grade"
        content={get(position, 'position.grade', NO_GRADE)}
        hasFixedTitleWidth
      />
      <CondensedCardDataPoint
        title="Language"
        content={<LanguageList languages={get(position, 'position.languages')} propToUse="representation" />}
        hasFixedTitleWidth
      />
    </div>
  );
};

CondensedCardData.propTypes = {
  position: POSITION_DETAILS.isRequired,
};

export default CondensedCardData;
