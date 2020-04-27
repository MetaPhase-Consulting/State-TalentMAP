import React from 'react';
import { isNil } from 'lodash';
import { NO_USER_SKILL_CODE } from '../../Constants/SystemMessages';
import { USER_SKILL_CODE_ARRAY } from '../../Constants/PropTypes';

const SkillCodeList = ({ skillCodes }) => {
  let skillCodeList = [];
  skillCodes.forEach((skill) => {
    if (isNil(skill.description)) skillCodeList.push(skill.code);
    else skillCodeList.push(`${skill.description} (${skill.code})`);
  });
  skillCodeList = skillCodeList.join(', ') || NO_USER_SKILL_CODE;
  return (
    <span>
      {skillCodeList}
    </span>
  );
};

SkillCodeList.propTypes = {
  skillCodes: USER_SKILL_CODE_ARRAY,
};

SkillCodeList.defaultProps = {
  skillCodes: [],
};

export default SkillCodeList;
