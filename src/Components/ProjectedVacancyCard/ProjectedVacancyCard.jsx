import { useEffect, useRef, useState } from 'react';
import FA from 'react-fontawesome';
import Linkify from 'react-linkify';
import DatePicker from 'react-datepicker';
import TextareaAutosize from 'react-textarea-autosize';
import { Tooltip } from 'react-tippy';
import PropTypes from 'prop-types';
import { checkFlag } from 'flags';
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

const enableCycleImport = () => checkFlag('flags.projected_vacancy_cycle_import');

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
    isAO,
    onEditModeSearch,
    onSubmit,
    selectOptions,
  } = props;

  const id = result?.fvseqnum || undefined;

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

  const [cycleImport, setCycleImport] = useState(result?.fvexclimportind === 'N');
  const [included, setIncluded] = useState(result?.fvexclimportind === 'N');
  const [season, setSeason] = useState(result?.fvbsnid);
  const [status, setStatus] = useState(result?.fvscode);
  const [overrideTED, setOverrideTED] =
    useState(
      result?.fvoverrideteddate ?
        new Date(result.fvoverrideteddate) :
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
      setCycleImport(result?.fvexclimportind === 'N');
      setIncluded(result?.fvexclimportind === 'N');
      setSeason(result?.fvbsnid);
      setStatus(result?.fvscode);
      setOverrideTED(
        result?.fvoverrideteddate ?
          new Date(result.fvoverrideteddate) :
          null,
      );
      setLangOffsetSummer(languageOffsets?.language_offset_summer || '');
      setLangOffsetWinter(languageOffsets?.language_offset_winter || '');
      setTextArea(result?.capsule_description || '');
    }
  }, [editMode]);
  useEffect(() => {
    if (!disableEdit) {
      setCycleImport(result?.fvexclimportind === 'N');
      setIncluded(result?.fvexclimportind === 'N');
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
          result?.fvexclimportind,
      }],
      language_offsets: {
        position_seq_num: result?.posseqnum,
        language_offset_summer: langOffsetSummer || null,
        language_offset_winter: langOffsetWinter || null,
      },
      capsule_description: {
        position_seq_num: result?.posseqnum,
        capsule_description: textArea,
        updater_id: result?.posupdateid,
        updated_date: result?.posupdatedate.replace(/\D/g, ''),
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
    const langs = result?.pospositionlangprofdesc?.split(';');
    if (langs && langs.length) {
      langs.forEach((lang, i) => {
        const langCodeAttr = `poslanguage${i + 1}code`;
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
      { 'Position Number': result?.posnumtext || NO_POSITION_NUMBER },
      { 'Skill': result?.posskillcode || NO_SKILL },
      { 'Position Title': result?.postitledesc || NO_POSITION_TITLE },
    ],
    bodyPrimary: [
      { 'Assignee TED': displayTedEmp(result?.assignee_tour_end_date, result?.assignee) },
      { 'Incumbent TED': displayTedEmp(result?.incumbent_tour_end_date, result?.incumbent) },
      { 'Bid Season': result?.fvbsnid || DEFAULT_TEXT },
      { 'Tour of Duty': result?.tour_of_duty_description || NO_TOUR_OF_DUTY },
      { 'Languages': displayLangs() },
    ],
    bodySecondary: [
      { 'Bureau': result?.posbureaushortdesc || NO_BUREAU },
      { 'Location': result?.poslocationcode || NO_POST },
      { 'Status': result?.fvsdescrtxt || NO_STATUS },
      { 'Organization': result?.posorgshortdesc || NO_ORG },
      { 'TED': formatDate(result?.fvoverrideteddate) || NO_TOUR_END_DATE },
      {
        'Language Offset Summer': summerLanguageOffsets?.find(o =>
          o.code === languageOffsets?.language_offset_summer)?.description || DEFAULT_TEXT,
      },
      {
        'Language Offset Winter': winterLanguageOffsets?.find(o =>
          o.code === languageOffsets?.language_offset_winter)?.description || DEFAULT_TEXT,
      },
      { 'Grade': result?.posgradecode || NO_GRADE },
      { 'Pay Plan': result?.pospayplancode || NO_GRADE },
      { 'Post Differential | Danger Pay': getDifferentials(differentials) },
    ],
    textarea: result?.capsule_description || 'No description.',
    metadata: [
      { 'Position Posted': formatDate(result?.fvcreatedate) || NO_UPDATE_DATE },
      { 'Last Updated': formatDate(result?.fvscreatedate) || NO_UPDATE_DATE },
    ],
  };
  const form = {
    staticBody: [
      { 'Assignee TED': displayTedEmp(result?.assignee_tour_end_date, result?.assignee) },
      { 'Incumbent TED': displayTedEmp(result?.incumbent_tour_end_date, result?.incumbent) },
      { 'Tour of Duty': result?.tour_of_duty_description || NO_TOUR_OF_DUTY },
      { 'Languages': displayLangs() },
      { 'Bureau': result?.posbureaushortdesc || NO_BUREAU },
      { 'Location': result?.poslocationcode || NO_POST },
      { 'Organization': result?.posorgshortdesc || NO_ORG },
      { 'Grade': result?.posgradecode || NO_GRADE },
      { 'Pay Plan': result?.pospayplancode || NO_GRADE },
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
              <CheckBox
                id={`included-checkbox-${id}`}
                label="Included"
                value={included}
                onCheckBoxClick={() => setIncluded(!included)}
                disabled={disableIncluded || isAO}
              />
              {!disableIncluded ? includeCheckbox :
                <Tooltip
                  title="Bureau users must cancel other edit drafts before attempting to edit the include selections."
                  arrow
                >
                  {includeCheckbox}
                </Tooltip>
              }
              {enableCycleImport() && (!disableImport ? importCheckbox :
                <Tooltip
                  title="AO users must select a Cycle filter and cancel other edit drafts before attempting to edit the import selections."
                  arrow
                >
                  {importCheckbox}
                </Tooltip>
              )}
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
  isAO: PropTypes.bool,
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
  isAO: false,
  onEditModeSearch: EMPTY_FUNCTION,
  onSubmit: EMPTY_FUNCTION,
  selectOptions: {
    languageOffsets: [],
    bidSeasons: [],
    statuses: [],
  },
};

export default ProjectedVacancyCard;
