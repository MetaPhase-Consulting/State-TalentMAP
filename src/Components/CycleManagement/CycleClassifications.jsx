import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import FA from 'react-fontawesome';
import { Row } from 'Components/Layout';
import TabbedCard from 'Components/TabbedCard';
import BackButton from 'Components/BackButton';
import ProfileSectionTitle from 'Components/ProfileSectionTitle/ProfileSectionTitle';
import { userHasPermissions } from 'utilities';
import { cycleClassificationsEditCycle, cycleClassificationsEditCycleSuccess, cycleClassificationsFetchData } from 'actions/cycleManagement';

const CycleClassifications = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(cycleClassificationsFetchData());
  }, []);

  const results = useSelector(state => state.cycleClassificationsData);
  const isLoading = useSelector(state => state.cycleClassificationsIsLoading);
  const editSuccessful = useSelector(state => state.cycleClassificationsEditSuccess);
  const userProfile = useSelector(state => state.userProfile);

  const isSuperUser = userHasPermissions(['superuser'], userProfile?.permission_groups);

  const [cycleToEdit, setCycleToEdit] = useState(false);

  const checkCycleToEdit = (id, code) => (
    cycleToEdit && cycleToEdit?.id === id && cycleToEdit?.code === code
  );

  useEffect(() => {
    if (editSuccessful) {
      dispatch(cycleClassificationsEditCycleSuccess(false));
      setCycleToEdit(false);
      dispatch(cycleClassificationsFetchData());
    }
  }, [editSuccessful]);

  const classifications = results?.cycle_classifications;
  const cycles = results?.classification_selections;

  const handleSelection = (code, event) => {
    const newValues = cycleToEdit.values.map(v => {
      if (v.code === code) {
        return {
          ...v,
          value: event.target.checked ? '1' : '0',
        };
      }
      return v;
    });
    setCycleToEdit(prevState => ({
      ...prevState,
      values: newValues,
    }));
  };

  const handleSubmit = () => {
    dispatch(cycleClassificationsEditCycle(cycleToEdit));
  };

  const cycleClassCard = () => (isLoading ?
    <div className="loading-animation--5">
      <div className="loading-message pbl-20">
        Loading additional data
      </div>
    </div> :
    (cycles?.map(cycle => (
      <div className="position-classifications cm-cycle-classes">
        <Row fluid className="position-content--subheader">
          <div className="line-separated-fields">
            <div>
              <span>{cycle?.cycle_name} - {cycle?.cycle_desc}</span>
            </div>
          </div>

          {(cycleToEdit === false && isSuperUser) &&
            <button
              className="toggle-edit-mode"
              onClick={() => setCycleToEdit({
                id: cycle.cycle_id,
                code: cycle.cycle_code,
                values: cycle.values,
              })}
            >
              <FA name="pencil" />
              <div>Edit</div>
            </button>
          }

        </Row>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {classifications?.map((o) => (
                  <th key={o.code}>{o.short_description}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {classifications?.map((c) => (
                  checkCycleToEdit(cycle.cycle_id, cycle.cycle_code)
                    ?
                    <td key={c.code}>
                      <input
                        type="checkbox"
                        name={c.code}
                        className="cm-cycle-classes-check"
                        onChange={(event) => handleSelection(c.code, event)}
                        checked={cycleToEdit?.values?.find(value => c.code === value.code && value.value === '1') ?? false}
                      />
                    </td>
                    :
                    <td key={c.code}>
                      <input
                        type="checkbox"
                        name={c.code}
                        className="cm-cycle-classes-check"
                        checked={cycle?.values?.find(value => c.code === value.code && value.value === '1') ?? false}
                      />
                    </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        {checkCycleToEdit(cycle.cycle_id, cycle.cycle_code)
          &&
          <div className="position-form--actions">
            <button onClick={() => setCycleToEdit(false)}>Cancel</button>
            <button onClick={handleSubmit}>Save</button>
          </div>
        }
      </div>
    )))
  );

  return (
    <div className="cycle-management-page position-search">
      <div className="position-search--header">
        <BackButton />
        <ProfileSectionTitle title="Cycle Date Classifications" icon="cogs" className="xl-icon" />
      </div>
      <div className="cm-classifications-scroll-container">
        <TabbedCard
          tabs={[
            {
              text: 'Assign Cycle Date Classifications',
              value: 'CLASSIFICATION',
              content: cycleClassCard(),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default withRouter(CycleClassifications);
