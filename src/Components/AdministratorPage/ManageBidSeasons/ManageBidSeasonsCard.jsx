import FA from 'react-fontawesome';
import swal from '@sweetalert/with-react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { formatDate } from 'utilities';
import { Column, Row } from 'Components/Layout';
import { bidSeasonsEdit } from 'actions/BidSeasons';
import EditBidSeasons from './EditBidSeasons';

// eslint-disable-next-line no-unused-vars
const ManageBidSeasonsCard = ({ id, bidSeasonDateRanges, description, bidSeasonsBeginDate,
  bidSeasonsEndDate, bidSeasonsPanelCutoff, bidSeasonsFutureVacancy }) => {
  const dispatch = useDispatch();

  const submit = (data) => {
    dispatch(bidSeasonsEdit(data));
  };

  const editSeason = () => {
    swal({
      title: 'Bid Season Information',
      button: false,
      content: (
        <EditBidSeasons
          id={id}
          description={description}
          bidSeasonsBeginDate={bidSeasonsBeginDate}
          bidSeasonsEndDate={bidSeasonsEndDate}
          bidSeasonsPanelCutoff={bidSeasonsPanelCutoff}
          bidSeasonsFutureVacancy={bidSeasonsFutureVacancy}
          submitAction={submit}
          bidSeasonDisableDates={
            bidSeasonDateRanges[formatDate(bidSeasonsBeginDate)]?.disableDates}
        />
      ),
    });
  };

  return (
    <div className="position-form">
      <Row fluid className="bid-seasons-search-card box-shadow-standard">
        <Row fluid className="bs-card--row">
          <Column columns={3}>
            {description}
          </Column>
          <Column columns={12} className="bs-card--middle-cols">
            <Column>
              Start Date: {bidSeasonsBeginDate ? formatDate(bidSeasonsBeginDate) : ''}
            </Column>
            <Column>
              End Date: {bidSeasonsEndDate ? formatDate(bidSeasonsEndDate) : ''}
            </Column>
            <Column>
              Panel Cutoff: {bidSeasonsPanelCutoff ? formatDate(bidSeasonsPanelCutoff) : ''}
            </Column>
            <Column>
              Future Vacancy: {bidSeasonsFutureVacancy}
            </Column>
          </Column>
          <Column columns={3} className="bs-card--link-col">
            <Link
              onClick={(e) => {
                e.preventDefault();
                editSeason();
              }}
              to="#"
            >
              <FA className="fa-solid fa-pencil" />
               Edit
            </Link>
          </Column>
        </Row>
      </Row>
    </div>
  );
};

ManageBidSeasonsCard.propTypes = {
  id: PropTypes.number.isRequired,
  bidSeasonDateRanges: PropTypes.shape({}).isRequired,
  description: PropTypes.string.isRequired,
  bidSeasonsBeginDate: PropTypes.string.isRequired,
  bidSeasonsEndDate: PropTypes.string.isRequired,
  bidSeasonsPanelCutoff: PropTypes.string.isRequired,
  bidSeasonsFutureVacancy: PropTypes.string.isRequired,
};

export default ManageBidSeasonsCard;
