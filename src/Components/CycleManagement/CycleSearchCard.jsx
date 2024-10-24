import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Column, Row } from 'Components/Layout';
import { formatDate } from 'utilities';
import { checkFlag } from 'flags';

const useCycleManagementPositions = () => checkFlag('flags.cycle_management_positions');

const CycleSearchCard = (props) => {
  const {
    id,
    name,
    status,
    begin_date,
    end_date,
    excl_position,
    post_view,
  } = props;
  const showCycleManagementPositions = useCycleManagementPositions();

  const cycleLink = `/profile/administrator/assignmentcycle/${id}`;
  const cycleLinkPositions = `/profile/administrator/cyclepositionsearch/${id}`;

  return (
    <Row fluid className="cycle-search-card box-shadow-standard">
      <Row fluid className="cyc-card--row">
        <Column columns={3}>
          {
            <Link to={cycleLink}>
              <div>{ name }</div>
            </Link>
          }
        </Column>
        <Column columns={12} className="cyc-card--middle-cols">
          <Column>
            {`Cycle Start: ${begin_date ? formatDate(begin_date) : ''}`}
          </Column>
          <Column>
            {`Bid Due: ${end_date ? formatDate(end_date) : ''}`}
          </Column>
          <Column>
            {`Status: ${status}`}
          </Column>
          <Column>
            {`Exluded: ${excl_position}`}
          </Column>
          <Column>
            {`Post View: ${post_view}`}
          </Column>
        </Column>
        <Column columns={3} className="cyc-card--link-col">
          {
            showCycleManagementPositions &&
            <span>
              <Link to={cycleLinkPositions}>
                View Cycle Positions
              </Link>
            </span>
          }
        </Column>
      </Row>
    </Row>
  );
};

CycleSearchCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  status: PropTypes.string,
  begin_date: PropTypes.string,
  end_date: PropTypes.string,
  excl_position: PropTypes.string,
  post_view: PropTypes.string,
};

CycleSearchCard.defaultProps = {
  name: '',
  status: '',
  begin_date: '',
  end_date: null,
  excl_position: null,
  post_view: '',
  isAO: false,
};

export default CycleSearchCard;
