import PropTypes from 'prop-types';
import { useState } from 'react';
import FontAwesome from 'react-fontawesome';
import InteractiveElement from 'Components/InteractiveElement';
import { Row } from '../../Layout';
import CheckBox from '../../CheckBox';
import ClientBadge from '../ClientBadge';
import { CLASSIFICATIONS, CLIENT_CLASSIFICATIONS, EMPTY_FUNCTION } from '../../../Constants/PropTypes';

const CheckboxList = ({ list, editView, updateClassifications,
  input }) => {
  const [showMore, setShowMore] = useState(false);

  // const multiBidSeason = () => {
  // loop through classifications
  // pull all text where seasons property.length > 1
  // const tenDiffFlag = c.text === 'Tenured 4' || c.text === 'Differential Bidder';
  // const multiBidSeason = [];
  // if (c.seasons.length > 1) {
  //   c.seasons.forEach((item) => {
  //     // console.log(item.season_text);
  //     multiBidSeason.push(item.season_text);
  //   });
  //   // console.log(multiBidSeason);
  // }
  // };

  return (
    <div className="client-checkbox-list">
      <CheckBox
        id="key"
        label="Bidder Has Classification"
        small
        value
        key="key"
        disabled
        checked
        className="tm-checkbox-disabled-alternate"
      />
      {list.map((c) => {
        // function call to pseudo code above
        const multiBidSeason = c.text === 'Tenured 4' || c.text === 'Differential Bidder';
        let checked = false;
        input.forEach((item) => {
          if (c.seasons.length === 1 && c.seasons[0].id === item) {
            checked = true;
          }
          if (c.seasons.length > 1) {
            c.seasons.forEach((cs) => {
              if (cs.id === item) checked = true;
            });
          }
        });

        return (
          <div className="classifications-client-badges">
            {multiBidSeason &&
            <div className="classifications-dropdown">
              <Row className="usa-grid-full">
                <div className="usa-grid-full toggle-more-container">
                  <InteractiveElement className="toggle-more classifications-row" onClick={() => setShowMore(!showMore)}>
                    <ClientBadge
                      // need to update key/id
                      key={'tenured4'}
                      type={c}
                      id={'tenured4'}
                      status={checked}
                      showShortCode={false}
                      onChange={updateClassifications}
                      editView={editView}
                    />
                    <div className="classifications-badges-text">
                      {c.text}
                    </div>
                    <FontAwesome
                      name={`chevron-${showMore ? 'down' : 'right'}`}
                    />
                  </InteractiveElement>
                </div>
                {
                  showMore &&
                  <div>
                    {c.seasons.map((m) => {
                      let multiBidSeasonChecked = false;
                      input.forEach((item) => {
                        if (m.id === item) {
                          multiBidSeasonChecked = true;
                        }
                      });
                      return (
                        <>
                          <ClientBadge
                            key={m.id}
                            type={c}
                            id={m.id}
                            status={multiBidSeasonChecked}
                            showShortCode={false}
                            onChange={updateClassifications}
                            editView={editView}
                          />
                          <div className="classifications-season-text">
                            {m.season_text}
                          </div>
                        </>
                      );
                    })
                    }
                  </div>
                }
              </Row>
            </div>
            }
            {!multiBidSeason &&
              <div>
                <ClientBadge
                  key={c.seasons[0].id}
                  type={c}
                  id={c.seasons[0].id}
                  status={checked}
                  showShortCode={false}
                  onChange={updateClassifications}
                  editView={editView}
                />
                <div className="classifications-badges-text">
                  {c.text}
                </div>
              </div>
            }
          </div>
        );
      })
      }
    </div>
  );
};

CheckboxList.propTypes = {
  list: CLASSIFICATIONS,
  editView: PropTypes.bool,
  updateClassifications: PropTypes.function,
  input: CLIENT_CLASSIFICATIONS,
};

CheckboxList.defaultProps = {
  isDisabled: false,
  list: [],
  input: [],
  editView: false,
  updateClassifications: EMPTY_FUNCTION,
};

export default CheckboxList;
