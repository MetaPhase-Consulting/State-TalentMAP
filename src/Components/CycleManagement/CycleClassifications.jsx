import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import TabbedCard from 'Components/TabbedCard';
import BackButton from 'Components/BackButton';
import ProfileSectionTitle from 'Components/ProfileSectionTitle/ProfileSectionTitle';
import { cycleClassificationsFetchData } from 'actions/cycleManagement';

const CycleClassifications = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(cycleClassificationsFetchData());
  }, []);

  const results = useSelector(state => state.cycleClassificationsData);
  const isLoading = useSelector(state => state.cycleClassificationsIsLoading);

  const [classifications, setClassifications] = useState(results?.cycle_classifications ?? []);
  const [selections, setSelections] = useState(results?.classification_selections ?? []);

  const pc = results?.cycle_classifications ?? [];
  const cs = results?.classification_selections ?? [];

  useEffect(() => {
    setClassifications(pc);
    setSelections(cs);
  }, [results]);

  // const handleSelection = (code, event) => {
  //   const newSelections = selections.map(s => {
  //     if (s.code === code) {
  //       return {
  //         ...s,
  //         value: event.target.checked ? '1' : '0',
  //       };
  //     }
  //     return s;
  //   });
  //   setSelections(newSelections);
  // };

  const cycleClassCard = () => (isLoading ?
    <div className="loading-animation--5">
      <div className="loading-message pbl-20">
        Loading additional data
      </div>
    </div> :
    (selections.map(sel => (
      <div className="position-classifications">
        <div className="line-separated-fields">
          <div>
            <span>{sel.cycle_name} - {sel.cycle_desc}</span>
          </div>
        </div>
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
                  <td key={c.code}>
                    <input
                      type="checkbox"
                      name={c.code}
                      checked={sel?.values.find(s => c.code === s.code && s.value === '1') ?? false}
                      // onChange={(event) => handleSelection(c.code, event)}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )))
  );

  return (
    <div className="cycle-management-page position-search">
      <div className="position-search--header">
        <BackButton />
        <ProfileSectionTitle title="Cycle Date Classifications" icon="cogs" className="xl-icon" />
      </div>
      <TabbedCard
        tabs={[
          {
            text: 'Position Classification',
            value: 'CLASSIFICATION',
            content: cycleClassCard(),
          },
        ]}
      />
    </div>
  );
};

export default withRouter(CycleClassifications);
