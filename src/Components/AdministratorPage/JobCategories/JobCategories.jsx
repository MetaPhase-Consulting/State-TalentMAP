import { withRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import swal from '@sweetalert/with-react';
import { useDispatch, useSelector } from 'react-redux';
import { jobCategoriesAdminFetchData, jobCategoriesDeleteCategory,
  jobCategoriesEditCategory, jobCategoriesFetchSkills } from 'actions/jobCategories';
import ToggleButton from 'Components/ToggleButton';
import CheckBox from 'Components/CheckBox';
import Alert from '../../Alert';
import Spinner from '../../Spinner';
import CreateJobCategoryModal from './CreateJobCategoryModal';
import ProfileSectionTitle from '../../ProfileSectionTitle';
import TabbedCard from '../../TabbedCard/TabbedCard';

const JobCategories = () => {
  const dispatch = useDispatch();

  const jobCategories = useSelector(state => state.jobCategoriesAdminFetchData);
  const jobCategoriesAdminFetchDataIsLoading = useSelector(
    state => state.jobCategoriesAdminFetchDataIsLoading);
  const jobCategoriesAdminFetchDataErrored = useSelector(
    state => state.jobCategoriesAdminFetchDataErrored);
  const jobCategorySkills = useSelector(state => state.jobCategoriesFetchSkills);
  const jobCategorySkillsIsLoading = useSelector(state => state.jobCategoriesFetchSkillsIsLoading);
  const jobCategoriesFetchSkillsHasErrored = useSelector(
    state => state.jobCategoriesFetchSkillsHasErrored);

  const jobCategoriesResults = jobCategories?.data;
  // jobCategorySkills return data has 2 items
  // [0] is JC metadata like update_date, [1] is list of skills
  const jobCategorySkillsRef = jobCategorySkills?.data?.[0];
  const jobCategorySkillsResults = jobCategorySkills?.data?.[1];

  const [selectedJobCategory, setSelectedJobCategory] = useState('');
  const [loadedSkillIds, setLoadedSkillIds] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const getQuery = () => ({
    category_id: selectedJobCategory,
  });

  const getDeleteQuery = () => ({
    category_id: selectedJobCategory,
    status_ind: jobCategorySkillsRef.status_ind,
    update_date: jobCategorySkillsRef.update_date,
    update_user_id: jobCategorySkillsRef.update_user_id,
  });

  const getEditQuery = () => {
    const inclusionsInds = [];
    const skillUpdateCodes = [];
    const skillUpdateDates = [];
    const skillUpdateIds = [];

    selectedSkillIds.forEach((id) => {
      if (!loadedSkillIds.includes(id)) {
        inclusionsInds.push('1');
        skillUpdateCodes.push(id);
        skillUpdateDates.push(
          jobCategorySkillsResults.find((skill) => skill.code === id).update_date || '');
        skillUpdateIds.push(
          jobCategorySkillsResults.find((skill) => skill.code === id).update_user_id);
      }
    });

    loadedSkillIds.forEach((id) => {
      if (!selectedSkillIds.includes(id)) {
        inclusionsInds.push('0');
        skillUpdateCodes.push(id);
        skillUpdateDates.push(
          jobCategorySkillsResults.find((skill) => skill.code === id).update_date || '');
        skillUpdateIds.push(
          jobCategorySkillsResults.find((skill) => skill.code === id).update_user_id);
        selectedSkillIds.push(id);
      }
    });

    const inputs = {
      inclusion_inds: inclusionsInds,
      category_id: selectedJobCategory,
      category_name: jobCategoriesResults.find(
        (cat) => cat.id === selectedJobCategory)?.description,
      status_ind: jobCategorySkillsRef.status_ind,
      update_date: jobCategorySkillsRef.update_date,
      update_user_id: jobCategorySkillsRef.update_user_id,
      skill_codes: skillUpdateCodes,
      skill_update_dates: skillUpdateDates,
      skill_update_ids: skillUpdateIds,
    };

    return inputs;
  };

  const loadSkills = (() => {
    if (jobCategorySkillsResults) {
      const returnArray = [];
      jobCategorySkillsResults.forEach(skill => {
        if (skill.display_skill === '1') {
          returnArray.push(skill.code);
        }
      });
      setSelectedSkillIds([...returnArray]);
      setLoadedSkillIds([...returnArray]);
    }
  });

  const clearSkillArrays = (() => {
    setSelectedSkillIds([]);
    setLoadedSkillIds([]);
    setSelectAll(false);
    setIsEditMode(false);
  });

  const clearInputs = (() => {
    setSelectedSkillIds([...loadedSkillIds]);
    setSelectAll(false);
    setIsEditMode(false);
  });

  useEffect(() => {
    dispatch(jobCategoriesAdminFetchData());
    // The EP is not able to return a list of all skills; they can only be loaded
    // when supplied with a job category ID. Call below is a hack to just load in
    // all skills
    dispatch(jobCategoriesFetchSkills({ category_id: '1' }));
  }, []);

  useEffect(() => {
    if (selectedJobCategory !== '') {
      dispatch(jobCategoriesFetchSkills(getQuery()));
    } else {
      clearSkillArrays();
    }
  }, [selectedJobCategory]);

  useEffect(() => {
    clearSkillArrays();
    loadSkills();
  }, [jobCategorySkills]);

  useEffect(() => {
    clearSkillArrays();
    setSelectedJobCategory('');
    if (swal.getState().isOpen) {
      swal.close();
    }
  }, [jobCategories]);

  const handleSelectAll = () => {
    if (!selectAll) {
      setSelectAll(true);
      setSelectedSkillIds(
        jobCategorySkillsResults?.map(skill => skill.code),
      );
    } else {
      setSelectAll(false);
      setSelectedSkillIds([]);
    }
  };

  const handleSelectSkill = (skill => {
    if (selectedSkillIds.includes(skill.code)) {
      const filteredSkills = selectedSkillIds.filter(x => x !== skill.code);
      setSelectedSkillIds([...filteredSkills]);
    } else {
      setSelectedSkillIds([...selectedSkillIds, skill.code]);
    }
  });

  const submitEdit = (() => {
    dispatch(jobCategoriesEditCategory(getEditQuery()));
  });

  const submitDelete = () => {
    dispatch(jobCategoriesDeleteCategory(getDeleteQuery()));
    swal.close();
  };

  const newJobCategoryModal = () => {
    const skillList = [...jobCategorySkillsResults];
    swal({
      title: 'Create New Job Category',
      button: false,
      className: 'create-jc-modal',
      content: (
        <CreateJobCategoryModal
          refSkills={skillList}
          dispatch={dispatch}
        />
      ),
    });
  };

  const deleteJobCategoryModal = () => {
    const jobCategoryName = jobCategoriesResults.find(
      (cat) => cat.id === selectedJobCategory)?.description;
    swal({
      title: `Deleting ${jobCategoryName}`,
      button: false,
      className: 'delete-jc-modal',
      content: (
        <div className="delete-jc-modal-content">
          Are you sure you want to delete the selected Job Category?
          <div className="delete-jc-modal-description">{jobCategoryName}</div>
          <div className="delete-modal-button-container">
            <button
              onClick={() => submitDelete()}
              className="jc-delete-button"
            >
                Delete Selected Job Category
            </button>
            <button
              onClick={() => swal.close()}
              className="usa-button-secondary"
            >
                Cancel
            </button>
          </div>
        </div>
      ),
    });
  };

  return (
    <div className="admin-job-categories-page">
      <ProfileSectionTitle title="Job Categories" icon="cogs" />
      {jobCategoriesAdminFetchDataErrored || jobCategoriesFetchSkillsHasErrored ?
        <Alert type="error" title="Error loading Job Categories page" messages={[{ body: 'Please try again.' }]} />
        :
        <div>
          <div>
            <div className="jc-post-controls">
              <button onClick={() => newJobCategoryModal()}>Create New Job Category</button>
              <button
                onClick={() => deleteJobCategoryModal()}
                disabled={!selectedJobCategory}
                className={`${selectedJobCategory === '' ? 'disabled-bg' : 'jc-delete-button'}`}
              >
                  Delete Selected Job Category
              </button>
            </div>
            <div className="select-container">
              <label htmlFor="categories-select">Select A Job Category</label>
              <select
                className={`${isEditMode || jobCategoriesAdminFetchDataIsLoading ? 'disabled-bg' : 'select-dropdown'}`}
                onChange={(e) => setSelectedJobCategory(e.target.value)}
                value={(selectedJobCategory)}
                disabled={isEditMode || jobCategoriesAdminFetchDataIsLoading}
              >
                <option value="">--Please Select a Job Category--</option>
                {
                  jobCategoriesResults?.map(category => (
                    <option value={category.id}>
                      {category.description}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>
          <TabbedCard
            tabs={[{
              text: 'Skill Descriptions',
              value: 'descriptions',
              content: (
                <div>
                  {selectedJobCategory !== '' &&
                    <div className="jc-toggle-container">
                      <ToggleButton
                        labelTextRight="Toggle Edit Mode"
                        onChange={() => setIsEditMode(!isEditMode)}
                        checked={isEditMode}
                        onColor="#0071BC"
                      />
                    </div>
                  }
                  <table className="custom-table">
                    <thead>
                      <tr className="jc-table-row">
                        <th className="checkbox-pos">
                          <CheckBox
                            className="tm-checkbox-transparent"
                            value={selectAll}
                            onCheckBoxClick={handleSelectAll}
                            disabled={!isEditMode}
                          />
                        </th>
                        <th className="skill-code-column">
                          Skill Code
                        </th>
                        <th className="skill-desc-column">
                          Skill Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobCategorySkillsIsLoading ?
                        <div>
                          <Spinner type="job-categories-results" size="small" />
                        </div> :
                        jobCategorySkillsResults?.map(skill => (
                          <tr key={skill.code}>
                            <td className="checkbox-pac checkbox-pos">
                              <CheckBox
                                className="tm-checkbox-transparent"
                                value={
                                  selectedJobCategory !== '' ?
                                    selectedSkillIds.includes(skill.code) : false
                                }
                                onCheckBoxClick={() => handleSelectSkill(skill)}
                                disabled={!isEditMode}
                              />
                            </td>
                            <td>{skill.code}</td>
                            <td>{skill.description}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                  <div className="modal-controls">
                    <button
                      onClick={() => submitEdit()}
                      disabled={!isEditMode}
                    >
                        Submit
                    </button>
                    <button
                      onClick={clearInputs}
                      disabled={!isEditMode}
                      className="usa-button-secondary saved-search-form-secondary-button"
                    >
                        Cancel
                    </button>
                  </div>
                </div>
              ),
            }]}
          />
        </div>
      }
    </div>
  );
};

export default withRouter(JobCategories);
