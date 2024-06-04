import { useEffect, useRef, useState } from 'react';
import FA from 'react-fontawesome';
import Linkify from 'react-linkify';
import DatePicker from 'react-datepicker';
import TextareaAutosize from 'react-textarea-autosize';
import { Tooltip } from 'react-tippy';
import PropTypes from 'prop-types';
import { useDidMountEffect } from 'hooks';
import { formatDate, getDifferentials } from 'utilities';
import { EMPTY_FUNCTION, POSITION_DETAILS } from 'Constants/PropTypes';
import {
  DEFAULT_TEXT, NO_BUREAU, NO_GRADE, NO_LANGUAGES, NO_ORG, NO_POSITION_NUMBER, NO_POSITION_TITLE,
  NO_POST, NO_SKILL, NO_STATUS, NO_TOUR_END_DATE, NO_TOUR_OF_DUTY, NO_UPDATE_DATE,
} from 'Constants/SystemMessages';
import { Row } from 'Components/Layout';
import CheckBox from 'Components/CheckBox';
import TabbedCard from 'Components/TabbedCard';
import PositionExpandableContent from 'Components/PositionExpandableContent';

// eslint-disable-next-line
const ProjectedVacancyCard = (props) => {
  const {
    result,
    languageOffsets,
    updateIncluded,
    disableIncluded,
    updateImport,
    disableImport,
    disableEdit,
    onEditModeSearch,
    onSubmit,
    selectOptions,
  } = props;

  const id = result?.future_vacancy_seq_num || undefined;

  const bidSeasons = selectOptions?.bidSeasons?.length ? selectOptions.bidSeasons : [];
  const statuses = selectOptions?.statuses?.length ? selectOptions.statuses : [];
  const summerLanguageOffsets = selectOptions?.languageOffsets?.summer_language_offsets?.length
    ? selectOptions.languageOffsets.summer_language_offsets : [];
  const winterLanguageOffsets = selectOptions?.languageOffsets?.winter_language_offsets?.length
    ? selectOptions.languageOffsets.winter_language_offsets : [];

  const datePickerRef = useRef(null);
  const openDatePicker = () => {
    datePickerRef.current.setOpen(true);
  };

  const [cycleImport, setCycleImport] = useState(result?.future_vacancy_exclude_import_indicator === 'N');
  const [included, setIncluded] = useState(result?.future_vacancy_exclude_import_indicator === 'N');
  const [season, setSeason] = useState(result?.bid_season_code);
  const [status, setStatus] = useState(result?.future_vacancy_status_code);
  const [overrideTED, setOverrideTED] =
    useState(
      result?.future_vacancy_override_tour_end_date ?
        new Date(result.future_vacancy_override_tour_end_date) :
        null,
    );
  const [langOffsetSummer, setLangOffsetSummer] =
    useState(languageOffsets?.language_offset_summer || '');
  const [langOffsetWinter, setLangOffsetWinter] =
    useState(languageOffsets?.language_offset_winter || '');
  const [textArea, setTextArea] = useState(result?.capsule_description || '');

  const differentials = {
    post: {
      danger_pay: result?.bidding_tool_danger_rate_number,
      differential_rate: result?.bidding_tool_differential_rate_number,
      post_bidding_considerations_url: result?.obc_url,
    },
  };

  useDidMountEffect(() => {
    updateIncluded(id, included);
  }, [included]);

  useDidMountEffect(() => {
    updateImport(id, cycleImport);
  }, [cycleImport]);

  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    onEditModeSearch(editMode, id);
    if (editMode) {
      setIncluded(result?.future_vacancy_exclude_import_indicator === 'N');
      // TODO: Use real field applicable to cycle import
      setCycleImport(result?.future_vacancy_exclude_import_indicator === 'N');
      setSeason(result?.bid_season_code);
      setStatus(result?.future_vacancy_status_code);
      setOverrideTED(
        result?.future_vacancy_override_tour_end_date ?
          new Date(result.future_vacancy_override_tour_end_date) :
          null,
      );
      setLangOffsetSummer(languageOffsets?.language_offset_summer || '');
      setLangOffsetWinter(languageOffsets?.language_offset_winter || '');
      setTextArea(result?.capsule_description || '');
    }
  }, [editMode]);
  useEffect(() => {
    if (!disableEdit) {
      setIncluded(result?.future_vacancy_exclude_import_indicator === 'N');
      // TODO: Use real field applicable to cycle import
      setCycleImport(result?.future_vacancy_exclude_import_indicator === 'N');
    }
  }, [disableEdit]);

  const onSubmitForm = () => {
    const editData = {
      projected_vacancy: [{
        ...result,
        bid_season_code: season,
        future_vacancy_status_code: status,
        future_vacancy_override_tour_end_date: overrideTED ?
          overrideTED.toISOString().substring(0, 10) : null,
        future_vacancy_exclude_import_indicator: status === 'A' ? 'N' :
          result?.future_vacancy_exclude_import_indicator,
      }],
      language_offsets: {
        position_seq_num: result?.position_seq_num,
        language_offset_summer: langOffsetSummer || null,
        language_offset_winter: langOffsetWinter || null,
      },
      capsule_description: {
        position_seq_num: result?.position_seq_num,
        capsule_description: textArea,
        updater_id: result?.position_updater_id,
        updated_date: result?.position_updated_date.replace(/\D/g, ''),
      },
    };
    onSubmit(editData, setEditMode(false));
  };

  const displayTedEmp = (ted, employee) => {
    if (!ted) {
      if (!employee) {
        return NO_TOUR_END_DATE;
      }
      return employee;
    }
    return `${formatDate(ted)} ${employee}`;
  };

  const displayLangs = () => {
    let displayText = '';
    const langs = result?.position_language_proficiency_description?.split(';');
    if (langs && langs.length) {
      langs.forEach((lang, i) => {
        const langCodeAttr = `position_language_${i + 1}_code`;
        const langCode = result?.[langCodeAttr] || undefined;
        if (langCode) {
          displayText += lang.replace(' ', ` (${langCode}) `);
        } else {
          displayText += lang;
        }
      });
    }
    return displayText || NO_LANGUAGES;
  };

  /* eslint-disable quote-props */
  const sections = {
    subheading: [
      { 'Position Number': result?.position_number || NO_POSITION_NUMBER },
      { 'Skill': result?.position_skill_code || NO_SKILL },
      { 'Position Title': result?.position_title || NO_POSITION_TITLE },
    ],
    bodyPrimary: [
      { 'Assignee TED': displayTedEmp(result?.assignee_tour_end_date, result?.assignee) },
      { 'Incumbent TED': displayTedEmp(result?.incumbent_tour_end_date, result?.incumbent) },
      { 'Bid Season': result?.bid_season_description || DEFAULT_TEXT },
      { 'Tour of Duty': result?.tour_of_duty_description || NO_TOUR_OF_DUTY },
      { 'Languages': displayLangs() },
    ],
    bodySecondary: [
      { 'Bureau': result?.bureau_short_description || NO_BUREAU },
      { 'Location': result?.location_description || NO_POST },
      { 'Status': result?.future_vacancy_status_description || NO_STATUS },
      { 'Organization': result?.organization_short_description || NO_ORG },
      { 'TED': formatDate(result?.future_vacancy_override_tour_end_date) || NO_TOUR_END_DATE },
      {
        'Language Offset Summer': summerLanguageOffsets?.find(o =>
          o.code === languageOffsets?.language_offset_summer)?.description || DEFAULT_TEXT,
      },
      {
        'Language Offset Winter': winterLanguageOffsets?.find(o =>
          o.code === languageOffsets?.language_offset_winter)?.description || DEFAULT_TEXT,
      },
      { 'Grade': result?.position_grade_code || NO_GRADE },
      { 'Pay Plan': result?.position_pay_plan_code || NO_GRADE },
      { 'Post Differential | Danger Pay': getDifferentials(differentials) },
    ],
    textarea: result?.capsule_description || 'No description.',
    metadata: [
      { 'Position Posted': formatDate(result?.created_date) || NO_UPDATE_DATE },
      { 'Last Updated': formatDate(result?.updated_date) || NO_UPDATE_DATE },
    ],
  };
  const form = {
    staticBody: [
      { 'Assignee TED': displayTedEmp(result?.assignee_tour_end_date, result?.assignee) },
      { 'Incumbent TED': displayTedEmp(result?.incumbent_tour_end_date, result?.incumbent) },
      { 'Tour of Duty': result?.tour_of_duty_description || NO_TOUR_OF_DUTY },
      { 'Languages': displayLangs() },
      { 'Bureau': result?.bureau_short_description || NO_BUREAU },
      { 'Location': result?.location_description || NO_POST },
      { 'Organization': result?.organization_short_description || NO_ORG },
      { 'Grade': result?.position_grade_code || NO_GRADE },
      { 'Pay Plan': result?.position_pay_plan_code || NO_GRADE },
      { 'Post Differential | Danger Pay': getDifferentials(differentials) },
    ],
    inputBody: <div className="position-form">
      <div className="position-form--inputs">
        <div className="position-form--label-input-container">
          <label htmlFor="season">Bid Season</label>
          <select
            id="season"
            defaultValue={season}
            onChange={(e) => setSeason(e.target.value)}
          >
            {bidSeasons?.map(b => (
              <option key={b.code} value={b.code}>{b.description}</option>
            ))}
          </select>
        </div>
        <div className="position-form--label-input-container">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            defaultValue={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statuses?.map(b => (
              <option key={b.code} value={b.code}>{b.description}</option>
            ))}
          </select>
        </div>
        <div className="position-form--label-input-container">
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
        <div className="position-form--label-input-container">
          <label htmlFor="langOffsetSummer">Language Offset Summer</label>
          <select
            id="langOffsetSummer"
            value={langOffsetSummer}
            onChange={(e) => setLangOffsetSummer(e.target.value)}
          >
            {summerLanguageOffsets?.map(b => (
              <option key={b.code || 'null'} value={b.code || ''}>{b.description || DEFAULT_TEXT}</option>
            ))}
          </select>
        </div>
        <div className="position-form--label-input-container">
          <label htmlFor="langOffsetWinter">Language Offset Winter</label>
          <select
            id="langOffsetWinter"
            value={langOffsetWinter}
            onChange={(e) => setLangOffsetWinter(e.target.value)}
          >
            {winterLanguageOffsets?.map(b => (
              <option key={b.code || 'null'} value={b.code || ''}>{b.description || DEFAULT_TEXT}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="position-form--label-input-container">
        <Row fluid className="position-form--description">
          <span className="definition-title">Position Details</span>
          <Linkify properties={{ target: '_blank' }}>
            <TextareaAutosize
              maxRows={6}
              minRows={6}
              maxLength="4000"
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
    cancelText: 'Are you sure you want to discard all changes made to this Projected Vacancy position?',
    handleSubmit: onSubmitForm,
    handleCancel: () => { },
    handleEdit: {
      editMode,
      setEditMode,
      disableEdit,
    },
  };
  /* eslint-enable quote-props */

  const includeCheckbox = (
    <CheckBox
      id={`included-checkbox-${id}`}
      label="Included"
      value={included}
      onCheckBoxClick={() => setIncluded(!included)}
      disabled={disableIncluded}
    />
  );

  const importCheckbox = (
    <CheckBox
      id={`imported-checkbox-${id}`}
      label="Import to Cycle"
      // TODO: Add cycle name to label
      value={cycleImport}
      onCheckBoxClick={() => setCycleImport(!cycleImport)}
      disabled={disableImport}
    />
  );

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
              {!disableIncluded ? includeCheckbox :
                <Tooltip
                  title="Bureau users must cancel other edit drafts before attempting to edit the include selections."
                  arrow
                >
                  {includeCheckbox}
                </Tooltip>
              }
              {!disableImport ? importCheckbox :
                <Tooltip
                  title="AO users must select a Cycle filter and cancel other edit drafts before attempting to edit the import selections."
                  arrow
                >
                  {importCheckbox}
                </Tooltip>
              }
            </div>
          </div>
        ),
      }]}
    />
  );
};

ProjectedVacancyCard.propTypes = {
  result: POSITION_DETAILS.isRequired,
  languageOffsets: PropTypes.shape({
    language_offset_summer: PropTypes.string,
    language_offset_winter: PropTypes.string,
  }),
  updateIncluded: PropTypes.func,
  disableIncluded: PropTypes.bool,
  updateImport: PropTypes.func,
  disableImport: PropTypes.bool,
  disableEdit: PropTypes.bool,
  onEditModeSearch: PropTypes.func,
  onSubmit: PropTypes.func,
  selectOptions: PropTypes.shape({
    languageOffsets: PropTypes.shape({
      summer_language_offsets: PropTypes.arrayOf(PropTypes.shape({})),
      winter_language_offsets: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    bidSeasons: PropTypes.arrayOf(PropTypes.shape({})),
    statuses: PropTypes.arrayOf(PropTypes.shape({})),
  }),
};

ProjectedVacancyCard.defaultProps = {
  languageOffsets: {
    language_offset_summer: null,
    language_offset_winter: null,
  },
  updateIncluded: EMPTY_FUNCTION,
  disableIncluded: false,
  updateImport: EMPTY_FUNCTION,
  disableImport: false,
  disableEdit: false,
  onEditModeSearch: EMPTY_FUNCTION,
  onSubmit: EMPTY_FUNCTION,
  selectOptions: {
    languageOffsets: [],
    bidSeasons: [],
    statuses: [],
  },
};

export default ProjectedVacancyCard;
