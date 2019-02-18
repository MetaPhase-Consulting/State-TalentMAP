import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import shortId from 'shortid';
import { get } from 'lodash';
import FA from 'react-fontawesome';
import BackButton from '../BackButton';
import { COMPARE_LIST, POSITION_SEARCH_RESULTS } from '../../Constants/PropTypes';
import { POSITION_RESULTS_OBJECT } from '../../Constants/DefaultProps';
import COMPARE_LIMIT from '../../Constants/Compare';
import { NO_POST, NO_TOUR_OF_DUTY, NO_BUREAU, NO_SKILL, NO_DATE, NO_POST_DIFFERENTIAL, NO_DANGER_PAY } from '../../Constants/SystemMessages';
import Spinner from '../Spinner';
import LanguageList from '../LanguageList/LanguageList';
import { propOrDefault, formatDate, getPostName, getDifferentialPercentage, getAccessiblePositionNumber } from '../../utilities';
import OBCUrl from '../OBCUrl';
import BidCount from '../BidCount';
import Favorite from '../../Containers/Favorite';
import CompareCheck from '../CompareCheck';

const CompareList = ({ compare, isLoading, favorites, onToggle }) => {
  const limit = 5;
  const compareArray = compare.slice(0, COMPARE_LIMIT);
  const emptyArray = Array(limit - compareArray.length).fill();
  return (
    <div className="usa-grid-full content-container comparison-outer-container">
      <div>
        <BackButton />
      </div>
      <div className="comparison-container">
        {
          isLoading ?
            <Spinner type="homepage-position-results" size="big" />
          :
            <div className="comparison-table-container">
              <table className="tm-table">
                <caption className="usa-sr-only">Position details comparison:</caption>
                <thead className="usa-sr-only">
                  <tr>
                    <th scope="row">
                      Position
                      <div className="border-extension border-visible" />
                    </th>
                    {
                      compareArray.map(c => (
                        <th key={shortId.generate()}>
                          <div className="column-title-main">{c.title}</div>
                        </th>
                      ))
                    }
                    {
                      emptyArray.map(() => (<th className="empty" key={shortId.generate()}>
                        Return to search results and add more positions to compare.
                      </th>))
                    }
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      Position
                    </th>
                    {
                      compareArray.map((c) => {
                        const bidStatistics = get(c, 'bid_statistics[0]', {});
                        return (
                          <td key={shortId.generate()}>
                            <div className="usa-grid-full">
                              <div className="column-title-main">{c.title}</div>
                              <div className="close-button-container">
                                <CompareCheck
                                  onToggle={() => onToggle(c.position_number)}
                                  refKey={c.position_number}
                                  customElement={<FA name="close" />}
                                  interactiveElementProps={{ title: 'Remove this comparison' }}
                                />
                              </div>
                            </div>
                            <span aria-labelledby={getAccessiblePositionNumber(c.position_number)}>
                              {c.position_number}
                            </span>
                            <div className="column-title-link">
                              <Link to={`/details/${c.id}`}>View position</Link>
                            </div>
                            <span className="bid-stats">
                              <BidCount bidStatistics={bidStatistics} altStyle label="Bid Count" hideLabel />
                            </span>
                          </td>
                        );
                      })
                    }
                    {
                      emptyArray.map(() => (<th className="empty" key={shortId.generate()}>
                        Return to search results and add more positions to compare.
                      </th>))
                    }
                  </tr>
                  <tr>
                    <th scope="row">Skill</th>
                    {
                      compareArray.map(c => (
                        <td key={shortId.generate()}>{c.skill || NO_SKILL}</td>
                      ))
                    }
                    {
                      emptyArray.map(() => <td className="empty" key={shortId.generate()} />)
                    }
                  </tr>
                  <tr>
                    <th scope="row">Bureau</th>
                    {
                      compareArray.map(c => (
                        <td key={shortId.generate()}>{c.bureau || NO_BUREAU}</td>
                      ))
                    }
                    {
                      emptyArray.map(() => <td className="empty" key={shortId.generate()} />)
                    }
                  </tr>
                  <tr>
                    <th scope="row">
                      Post
                    </th>
                    {
                      compareArray.map(c => (
                        <td key={shortId.generate()}>
                          {getPostName(c.post, NO_POST)}
                        </td>
                      ))
                    }
                    {
                      emptyArray.map(() => <td className="empty" key={shortId.generate()} />)
                    }
                  </tr>
                  <tr>
                    <th scope="row">Tour of duty</th>
                    {
                      compareArray.map(c => (
                        <td key={shortId.generate()}>
                          {c.post && c.post.tour_of_duty ? c.post.tour_of_duty : NO_TOUR_OF_DUTY}
                        </td>
                      ))
                    }
                    {
                      emptyArray.map(() => <td className="empty" key={shortId.generate()} />)
                    }
                  </tr>
                  <tr>
                    <th scope="row">Language</th>
                    {
                      compareArray.map(c => (
                        <td key={shortId.generate()}>
                          <LanguageList languages={c.languages} propToUse="representation" />
                        </td>
                      ))
                    }
                    {
                      emptyArray.map(() => <td className="empty" key={shortId.generate()} />)
                    }
                  </tr>
                  <tr>
                    <th scope="row">Post differential</th>
                    {
                      compareArray.map(c => (
                        <td key={shortId.generate()}>
                          {getDifferentialPercentage(propOrDefault(c, 'post.differential_rate'), NO_POST_DIFFERENTIAL)}
                          {propOrDefault(c, 'post.obc_id') ? <span> | <OBCUrl type="post-data" id={c.post.obc_id} label="View OBC Data" /></span> : null }
                        </td>
                      ))
                    }
                    {
                      emptyArray.map(() => <td className="empty" key={shortId.generate()} />)
                    }
                  </tr>
                  <tr>
                    <th scope="row">
                      Danger pay
                    </th>
                    {
                      compareArray.map(c => (
                        <td key={shortId.generate()}>
                          {getDifferentialPercentage(propOrDefault(c, 'post.danger_pay'), NO_DANGER_PAY)}
                          {propOrDefault(c, 'post.obc_id') ? <span> | <OBCUrl id={c.post.obc_id} label="View OBC Data" /></span> : null }
                        </td>
                      ))
                    }
                    {
                      emptyArray.map(() => <td className="empty" key={shortId.generate()} />)
                    }
                  </tr>
                  <tr>
                    <th scope="row">TED</th>
                    {
                      compareArray.map(c => (
                        <td key={shortId.generate()}>
                          {propOrDefault(c, 'current_assignment.estimated_end_date') ? formatDate(c.current_assignment.estimated_end_date) : NO_DATE }
                        </td>
                      ))
                    }
                    {
                      emptyArray.map(() => <td className="empty" key={shortId.generate()} />)
                    }
                  </tr>
                  <tr>
                    <th scope="row">Favorite</th>
                    {
                      compareArray.map(c => (
                        <td key={shortId.generate()}>
                          <Favorite
                            hasBorder
                            refKey={c.id}
                            compareArray={favorites.results}
                            useButtonClass
                            refresh
                          />
                        </td>
                      ))
                    }
                    {
                      emptyArray.map(() => <td className="empty" key={shortId.generate()} />)
                    }
                  </tr>
                </tbody>
              </table>
              <div className="border-bottom-extension" />
            </div>
        }
      </div>
    </div>
  );
};

CompareList.propTypes = {
  compare: COMPARE_LIST,
  isLoading: PropTypes.bool,
  favorites: POSITION_SEARCH_RESULTS,
  onToggle: PropTypes.func.isRequired,
};

CompareList.defaultProps = {
  compare: [],
  isLoading: false,
  favorites: POSITION_RESULTS_OBJECT,
};

export default CompareList;
