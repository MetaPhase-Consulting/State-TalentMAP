import { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Picky from 'react-picky';
import { Link } from 'react-router-dom';
import FA from 'react-fontawesome';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import Spinner from 'Components/Spinner';
import ProfileSectionTitle from 'Components/ProfileSectionTitle';
import Alert from 'Components/Alert';
import { bidSeasonsCreate, bidSeasonsFetchData } from 'actions/BidSeasons';
import { formatDate, renderSelectionList } from 'utilities';
import swal from '@sweetalert/with-react';
import { addDays, isBefore } from 'date-fns';
import ManageBidSeasonCard from './ManageBidSeasonsCard';
import EditBidSeasons from './EditBidSeasons';

const ManageBidSeasons = () => {
  const dispatch = useDispatch();

  const ManageBidSeasonsDataLoading = useSelector(state => state.bidSeasonsFetchDataLoading);
  const ManageBidSeasonsData = useSelector(state => state.bidSeasons);
  const ManageBidSeasonsError = useSelector(state => state.bidSeasonsFetchDataErrored);

  // Filters
  const [selectedBidSeasons, setSelectedBidSeasons] = useState([]);
  const [selectedDates, setSelectedDates] = useState(null);
  const [bidSeasonData$, setBidSeasonData$] = useState(ManageBidSeasonsData);
  const [bidSeasonDateRanges, setBidSeasonDateRanges] = useState({});
  const [clearFilters, setClearFilters] = useState(false);

  const noFiltersSelected = selectedBidSeasons.flat().length === 0 && !selectedDates;

  const filterSeasonsByDateRange = (seasons, dateRange) => {
    const startDateRange = dateRange[0].getTime();
    const endDateRange = dateRange[1].getTime();

    const filteredSeasons = seasons.filter(season => {
      const startDate = new Date(season.bidSeasonsBeginDate).getTime();
      const endDate = new Date(season.bidSeasonsEndDate).getTime();
      return ((startDate >= startDateRange) && (startDate <= endDateRange))
        || ((endDate >= startDateRange) && (endDate <= endDateRange));
    });

    return filteredSeasons;
  };

  const getBidSeasonDateRanges = () => {
    const dateObj = {};

    // generate all the dates for a date range
    ManageBidSeasonsData.forEach((bdDate) => {
      const dateArr = [];
      let loopDate = formatDate(bdDate?.bidSeasonsBeginDate);
      // eslint-disable-next-line no-loops/no-loops
      while (isBefore(loopDate, formatDate(bdDate?.bidSeasonsEndDate))) {
        dateArr.push(new Date(loopDate));
        loopDate = addDays(loopDate, 1);
      }

      dateObj[formatDate(bdDate?.bidSeasonsBeginDate)] = {
        beginDate: formatDate(bdDate?.bidSeasonsBeginDate),
        endDate: formatDate(bdDate?.bidSeasonsEndDate),
        dates: dateArr,
      };
    });

    // for edit bid season - pull all date range dates except current
    Object.values(dateObj).forEach((seasonDate) => {
      const currentBeginDate = formatDate(seasonDate?.beginDate);

      dateObj[currentBeginDate].disableDates =
        Object.values(dateObj).flatMap((seasonDateInner) =>
          seasonDateInner?.beginDate === currentBeginDate ? [] : seasonDateInner?.dates);
    });

    // for new bid season - pull all date range dates
    dateObj.allDates = Object.values(dateObj).flatMap(({ dates }) => dates);

    setBidSeasonDateRanges(dateObj);
  };

  const bidSeasonDataFiltered = () => {
    if (noFiltersSelected) return ManageBidSeasonsData;
    const seasons = selectedBidSeasons.length > 0 ? selectedBidSeasons : ManageBidSeasonsData;
    if (selectedDates) return filterSeasonsByDateRange(seasons, selectedDates);
    return seasons;
  };

  // initial render
  useEffect(() => {
    dispatch(bidSeasonsFetchData());
  }, []);

  useEffect(() => {
    setBidSeasonData$(bidSeasonDataFiltered);
    getBidSeasonDateRanges();
    if (noFiltersSelected) {
      setClearFilters(false);
    } else {
      setClearFilters(true);
    }
  }, [
    selectedBidSeasons,
    selectedDates,
    ManageBidSeasonsData,
  ]);

  const resetFilters = () => {
    setSelectedDates(null);
    setSelectedBidSeasons([]);
    setClearFilters(false);
  };


  // Overlay for error, info, and loading state
  const noResults = bidSeasonData$?.length === 0;
  const getOverlay = () => {
    let overlay;
    if (ManageBidSeasonsDataLoading) {
      overlay = <Spinner type="standard-center" class="homepage-position-results" size="big" />;
    } else if (ManageBidSeasonsError) {
      overlay = <Alert type="error" title="Error loading results" messages={[{ body: 'Please try again.' }]} />;
    } else if (noResults) {
      overlay = <Alert type="info" title="No results found" messages={[{ body: 'Please broaden your search criteria and try again.' }]} />;
    } else {
      return false;
    }
    return overlay;
  };

  const pickyProps = {
    numberDisplayed: 2,
    multiple: true,
    includeFilter: true,
    dropdownHeight: 255,
    renderList: renderSelectionList,
    includeSelectAll: true,
  };

  const submit = (data) => {
    dispatch(bidSeasonsCreate(data));
  };

  const newSeason = () => {
    swal({
      title: 'Bid Season Information',
      button: false,
      content: (
        <EditBidSeasons
          submitAction={submit}
          bidSeasonDisableDates={bidSeasonDateRanges?.allDates}
        />
      ),
    });
  };

  return (
    <div className="bid-seasons-page position-search">
      <div className="usa-grid-full position-search--header">
        <ProfileSectionTitle title="Bid Season Search" icon="calendar" className="xl-icon" />
        <div className="filterby-container" >
          <div className="filterby-label">Filter by:</div>
          <span className="filterby-clear">
            {clearFilters &&
                <button className="unstyled-button" onClick={resetFilters}>
                  <FA name="times" />
                  Clear Filters
                </button>
            }
          </span>
        </div>
        <div className="usa-width-one-whole position-search--filters--bs">
          <div className="filter-div">
            <div className="label">Season:</div>
            <Picky
              {...pickyProps}
              placeholder="Type to filter seasons"
              options={ManageBidSeasonsData}
              valueKey="id"
              labelKey="description"
              onChange={setSelectedBidSeasons}
              value={selectedBidSeasons}
            />
          </div>
          <div className="filter-div">
            <div className="label">Season Date:</div>
            <DateRangePicker
              onChange={setSelectedDates}
              value={selectedDates}
              maxDetail="month"
              calendarIcon={null}
              showLeadingZeros
            />
          </div>
        </div>

      </div>

      {
        getOverlay() ||
          <>
            <div className="usa-grid-full results-dropdown controls-container">
              <div className="bs-results">
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    newSeason();
                  }}
                  to="#"
                >
                  <FA className="fa-solid fa-plus" />
                  {' Add New Bid Season'}
                </Link>
              </div>
            </div>

            <div className="bs-lower-section">
              {bidSeasonData$?.map(data =>
                (<ManageBidSeasonCard
                  {...data}
                  key={data.id}
                  bidSeasonDateRanges={bidSeasonDateRanges}
                />))}
            </div>
          </>

      }
    </div>
  );
};

export default withRouter(ManageBidSeasons);
