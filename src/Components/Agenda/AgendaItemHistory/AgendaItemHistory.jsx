import { useEffect, useState } from 'react';
import BackButton from 'Components/BackButton';
import { AGENDA_ITEM_HISTORY_FILTERS } from 'Constants/Sort';
import SelectForm from 'Components/SelectForm';
import { get } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { aihFetchData } from 'actions/agendaItemHistory';
import { useMount, usePrevious } from 'hooks';
import Spinner from 'Components/Spinner';
import Alert from 'Components/Alert';
import AgendaItemCard from '../AgendaItemCard';
import AgendaItemRow from '../AgendaItemRow';
import ExportLink from '../../BidderPortfolio/ExportLink';
import ProfileSectionTitle from '../../ProfileSectionTitle';
import ResultsViewBy from '../../ResultsViewBy/ResultsViewBy';
import ScrollUpButton from '../../ScrollUpButton';

const AgendaItemHistory = (props) => {
  const sorts = AGENDA_ITEM_HISTORY_FILTERS;

  const [cardView, setCardView] = useState(false);
  const [sort, setSort] = useState(sorts.defaultSort);
  const view = cardView ? 'card' : 'grid';

  const aih = useSelector(state => state.aih);
  const isLoading = useSelector(state => state.aihIsLoading);
  const hasErrored = useSelector(state => state.aihHasErrored);

  // Actions
  const dispatch = useDispatch();

  const getData = () => {
    const id = get(props, 'match.params.id'); // client's perdet
    dispatch(aihFetchData(id, sort));
  };

  const prevSort = usePrevious(sort);

  useMount(() => {
    getData();
  });

  useEffect(() => {
    if (prevSort && sort && sort !== prevSort) {
      getData();
    }
  }, [sort]);

  return (
    <div className="agenda-item-history-container">
      <div className="usa-grid-full profile-content-inner-container">
        <ProfileSectionTitle title="Rehman, Tarek - Agenda Item History" icon="user-circle-o" />
        <BackButton />
        <div className="usa-grid-full portfolio-controls">
          <div className="usa-width-one-whole results-dropdown agenda-controls-container">
            <div className="agenda-results-controls">
              <ResultsViewBy initial={view} onClick={() => setCardView(!cardView)} />
              <SelectForm
                id="agenda-item-history-results"
                options={sorts.options}
                label="Sort by:"
                defaultSort={sort}
                onSelectOption={e => setSort(get(e, 'target.value'))}
              />
              <ExportLink disabled />
            </div>
          </div>
        </div>
        {
          isLoading && !hasErrored && <div className="ai-history-cards-container"><Spinner type="homepage-position-results" size="big" /></div>
        }
        {
          !isLoading && hasErrored &&
          <div className="ai-history-cards-container"><Alert type="error" title="Error loading agenda history" messages={[{ body: 'Please try again.' }]} /></div>
        }
        {
          !isLoading && !hasErrored &&
            <>
              {
                cardView &&
                <div className="ai-history-cards-container">
                  {
                    aih.map((result, i) => (
                      <AgendaItemCard
                        key={result.id}
                        isCreate={i === 0}
                        agenda={result}
                      />
                    ))
                  }
                </div>
              }
              {
                !cardView &&
                <div className="ai-history-rows-container">
                  {
                    aih.map((result, i) => (
                      <AgendaItemRow
                        key={result.id}
                        isCreate={i === 0}
                        agenda={result}
                      />
                    ))
                  }
                </div>
              }
            </>
        }
        <ScrollUpButton />
      </div>
    </div>
  );
};

export default withRouter(AgendaItemHistory);
