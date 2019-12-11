import { getPostName } from '../../utilities';
import { COMMON_PROPERTIES } from '../../Constants/EndpointParams';
import { checkFlag } from '../../flags';

const getUseAP = () => checkFlag('flags.available_positions');
// Attempt to map the non-numeric grade codes to a full description.
// If no match is found, return the unmodified code.
export function getCustomGradeDescription(gradeCode) {
  switch (gradeCode) {
    case 'CM':
      return 'CM Career Minister (FE-CM)';
    case 'MC':
      return 'MC Minister-Counselor (FE-MC)';
    case 'OC':
      return 'OC Counselor (FE-OC)';
    case 'OM':
      return 'Office Manager (OM)';
    default:
      return gradeCode;
  }
}

function getLanguageNameByIfNull(filterItemObject = {}) {
  return filterItemObject.code === COMMON_PROPERTIES.NULL_LANGUAGE ?
    filterItemObject.customDescription || filterItemObject.formal_description
    :
    `${filterItemObject.formal_description} (${filterItemObject.code})`;
}

function getFuncRegionCustomDescription(shortDescription, longDescription) {
  return getUseAP() ? `(${shortDescription}) ${longDescription}` : false;
}

function getRegionCustomDescription(shortDescription, longDescription) {
  return `(${shortDescription}) ${longDescription}`;
}

function getSkillCustomDescription(description, code) {
  return `${description} (${code})`;
}

// create a custom description based on the filter type
// eslint-disable-next-line complexity
export function getFilterCustomDescription(filterItem, filterItemObject) {
  const { item: { description: descriptionPrimary } } = filterItem;
  const { short_description: shortDescription, long_description: longDescription, description,
    code, name } = filterItemObject;
  switch (descriptionPrimary) {
    case 'region':
      return getRegionCustomDescription(shortDescription, longDescription);
    case 'functionalRegion':
      return getFuncRegionCustomDescription(shortDescription, longDescription);
    case 'skill':
      return getSkillCustomDescription(description, code);
    case 'post':
      return getPostName(filterItemObject);
    case 'bidCycle':
      return name;
    case 'language':
      // language code NONE gets displayed differently
      return getLanguageNameByIfNull(filterItemObject);
    case 'grade':
      return getCustomGradeDescription(code);
    case 'postDiff': case 'dangerPay': case 'bidSeason':
      return description;
    default:
      return false;
  }
}

// Our standard method for getting a pill description.
// Pass a customType string for special rendering.
export function getPillDescription(filterItemObject, customType) {
  switch (customType) {
    case 'dangerPay':
      return `Danger pay: ${filterItemObject.description}`;
    case 'postDiff':
      return `Post differential: ${filterItemObject.description}`;
    case 'language':
      return filterItemObject.custom_description;
    default:
      return filterItemObject.short_description ||
      filterItemObject.description ||
      filterItemObject.long_description ||
      filterItemObject.code ||
      filterItemObject.name ||
      '';
  }
}

// when getting pill descriptions for posts or missions, perform alternate method
export function getPostOrMissionDescription(data) {
  if (data.type === 'post') {
    return `${getPostName(data)}`;
  }
  return false;
}

export function doesCodeOrIdMatch(filterItem, filterItemObject, mappedObject) {
  const filterCode = filterItemObject.code;
  const filterRef = filterItem.item.selectionRef;
  const filterId = filterItemObject.id;

  const codeAndRefMatch = filterCode &&
    filterCode.toString() === mappedObject.codeRef.toString() &&
    filterRef === mappedObject.selectionRef;

  const idAndRefMatch = filterId &&
  filterItemObject.id.toString() === mappedObject.codeRef.toString() &&
  filterRef === mappedObject.selectionRef;

  if (codeAndRefMatch || idAndRefMatch) {
    return true;
  }
  return false;
}

export function isBooleanFilter(description) {
  if (
    description === 'COLA' ||
    description === 'available'
  ) {
    return true;
  }
  return false;
}

export function isPercentageFilter(description) {
  if (
    description === 'dangerPay' ||
    description === 'postDiff'
  ) {
    return true;
  }
  return false;
}
