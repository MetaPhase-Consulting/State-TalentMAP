import PropTypes from 'prop-types';
import SectionTitle from '../SectionTitle';
import InformationDataPoint from '../InformationDataPoint';

const Languages = props => {
  const { languagesArray } = props;
  const languagesArray$ = languagesArray || [];

  return (
    <div className="usa-grid-full profile-section-container languages-container">
      <div className="usa-grid-full section-padded-inner-container">
        <div className="usa-width-one-whole">
          <SectionTitle title="Language History" len={languagesArray$.length} icon="language" />
        </div>
        {
          !languagesArray$.length &&
          <div>No language history</div>
        }
        <div className="languages-list-container">
          {languagesArray$.map(l => (
            <InformationDataPoint
              title={l.name || 'N/A'}
              content={
                <div className="language-details">
                  {`Reading: ${l.reading || 'N/A'} | Speaking: ${l.speaking || 'N/A'}`}
                  <span>{`Test Date: ${l.date || 'N/A'}`}</span>
                </div>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

Languages.propTypes = {
  languagesArray: PropTypes.arrayOf(
    PropTypes.shape(
      {
        name: PropTypes.string,
        reading: PropTypes.string,
        speaking: PropTypes.string,
        date: PropTypes.string,
      },
    ),
  ),
};

Languages.defaultProps = {
  languagesArray: [],
};

export default Languages;
