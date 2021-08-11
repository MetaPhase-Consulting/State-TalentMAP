import PropTypes from 'prop-types';
import SectionTitle from '../SectionTitle';
import InformationDataPoint from '../InformationDataPoint';

const Languages = props => {
  const { languagesArray } = props;

  return (
    <div className="usa-grid-full profile-section-container languages-container">
      <div className="usa-grid-full section-padded-inner-container">
        <div className="usa-width-one-whole">
          <SectionTitle title="Language History" len={languagesArray.length} icon="language" />
        </div>
        <div className="languages-list-container">
          {languagesArray.map(l => (
            <>
              <InformationDataPoint
                title={l.name}
                content={
                  <div className="language-details">
                    {`Reading: ${l.reading} | Speaking: ${l.speaking}`}
                    <span>{`Test Date: ${l.date}`}</span>
                  </div>
                }
              />
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

Languages.propTypes = {
  languagesArray: PropTypes.shape([]),
};

Languages.defaultProps = {
  languagesArray: [],
};

export default Languages;
