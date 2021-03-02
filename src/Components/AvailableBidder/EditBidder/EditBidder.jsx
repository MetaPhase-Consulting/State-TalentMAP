/* eslint-disable react/prop-types */
// Remove after defining sections with real data
import { useState } from 'react';
import PropTypes from 'prop-types';
import { EMPTY_FUNCTION, FILTER } from 'Constants/PropTypes';
import { uniqBy, forEach } from 'lodash';
import swal from '@sweetalert/with-react';

const EditBidder = (props) => {
  const { name, sections, submitAction, bureaus, details } = props;
  const [status, setStatus] = useState(details.status);
  const [comment, setComment] = useState(sections.comments);
  const [ocReason, setOCReason] = useState(details.ocReason);
  const [ocBureau, setOCBureau] = useState(details.ocBureau);
  const [shared, setShared] = useState(details.shared);

  const bureauOptions = uniqBy(bureaus.data, 'code');

  // To Do: Move these to the DB/Django backend after more user feedback
  const reasons = [
    'Appealing/Grieving Selection Out',
    'CAT-4 (MED)',
    'CAT-4 (SEC)',
    'Compassionate Curtailment',
    'DS Investigation',
    'Involuntary Curtailment',
    'No-Fault Curtailment AIP',
    'Other - see additional comments',
    'Previous Assignment Ended',
    'Unresolved Medical',
  ];

  const submit = (e) => {
    e.preventDefault();
    const userInputs = {
      oc_bureau: ocBureau,
      oc_reason: ocReason,
      status,
      comments: comment,
      is_shared: shared,
    };

    // Remap unmodified local defaults from None Listed to empty string for patch
    forEach(userInputs, (v, k) => {
      if (v === 'None listed') userInputs[k] = '';
    });

    submitAction(userInputs);
  };

  const cancel = (e) => {
    e.preventDefault();
    swal.close();
  };

  return (
    <div>
      <form className="available-bidder-form">
        <hr />
        <div>
          <span>* Internal CDO field only, not shared with Bureaus</span>
        </div>
        <hr />
        <div>
          <label htmlFor="name">Client Name:</label>
          <input type="text" name="name" disabled value={name} />
        </div>
        <div>
          <label htmlFor="status">*Status:</label>
          <select
            id="status"
            defaultValue={status}
            onChange={(e) => {
              setStatus(e.target.value);
              if (status !== 'OC') {
                setOCReason('');
                setOCBureau('');
                if (status !== 'UA') {
                  setShared(false);
                }
              }
            }}
          >
            <option value="">None listed</option>
            <option value="OC">OC: Overcomplement</option>
            <option value="UA">UA: Unassigned</option>
            <option value="IT">IT: In Transit</option>
            <option value="AWOL">AWOL: Absent without leave</option>
          </select>
        </div>
        <div>
          <label htmlFor="ocBureau">*OC Bureau:</label>
          <select id="ocBureau" defaultValue={ocBureau} onChange={(e) => setOCBureau(e.target.value)} disabled={status !== 'OC'} >
            <option value="">None listed</option>
            {
              (status === 'OC') &&
                bureauOptions.map(o => (
                  <option value={o.short_description}>{o.custom_description}</option>
                ))
            }
          </select>
        </div>
        <div>
          <label htmlFor="ocReason">*OC Reason:</label>
          <select id="ocReason" defaultValue={ocReason} onChange={(e) => setOCReason(e.target.value)} disabled={status !== 'OC'} >
            <option value="">None listed</option>
            {
              (status === 'OC') &&
              reasons.map(r => (
                <option value={r}>{r}</option>
              ))
            }
          </select>
        </div>
        <div>
          <label htmlFor="skill">Skill:</label>
          <input type="text" name="skill" disabled value={sections.skill} />
        </div>
        <div>
          <label htmlFor="grade">Grade:</label>
          <input type="text" name="grade" disabled value={sections.grade} />
        </div>
        <div>
          <label htmlFor="language">Language:</label>
          <input type="text" name="language" disabled value={sections.language} />
        </div>
        <div>
          <label htmlFor="ted">TED:</label>
          <input type="text" name="ted" disabled value={sections.ted} />
        </div>
        <div>
          <label htmlFor="currentPost">Current Post:</label>
          <input type="text" name="currentPost" disabled value={sections.current_post} />
        </div>
        <div>
          <label htmlFor="cdo">CDO:</label>
          <input type="text" name="cdo" disabled value={sections.cdo} />
        </div>
        <div>
          <label htmlFor="comment">*Comment:</label>
          <input type="text" name="comment" defaultValue={comment} onChange={(e) => setComment(e.target.value)} />
        </div>
        <button onClick={submit} type="submit">Submit</button>
        <button onClick={cancel}>Cancel</button>
      </form>
    </div>
  );
};

EditBidder.propTypes = {
  sections: PropTypes.shape({}),
  // Build out sections after connection with real data
  name: PropTypes.string,
  submitAction: PropTypes.func,
  bureaus: FILTER,
  details: PropTypes.shape({}),
};

EditBidder.defaultProps = {
  sections: {},
  name: '',
  submitAction: EMPTY_FUNCTION,
  bureaus: [],
  details: {},
};

export default EditBidder;
