import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Linkify from 'react-linkify';
import FA from 'react-fontawesome';
import PropTypes from 'prop-types';
import TextareaAutosize from 'react-textarea-autosize';
import { cableFetchData, noteCableRefFetchData } from 'actions/assignmentNotifications';
import { Row } from 'Components/Layout';
import TabbedCard from 'Components/TabbedCard';
import Header from './Tabs/Header';
import EFM from './Tabs/EFM';
import Remarks from './Tabs/Remarks';
import Training from './Tabs/Training';
import Assignments from './Tabs/Assignments';
import Paragraphs from './Tabs/Paragraphs';
import Routing from './Tabs/Routing';
import Spinner from '../../Spinner';
import Alert from '../../Alert';
import NavTabs from '../../NavTabs';
import { rebuildNotification } from '../../../actions/assignmentNotifications';
// import Memo from './Tabs/Memo';
// import MemoHeader from './Tabs/MemoHeader';

const NotificationCard = (props) => {
  const { note } = props;

  const dispatch = useDispatch();

  // ====================== Data Retrieval ======================

  // const cable = useSelector(state => state.cableFetchData);
  const cableErrored = useSelector(state => state.cableFetchDataErrored);
  const cableLoading = useSelector(state => state.cableFetchDataLoading);

  const ref = useSelector(state => state.noteCableRefFetchData);
  const refErrored = useSelector(state => state.noteCableRefFetchDataErrored);
  const refLoading = useSelector(state => state.noteCableRefFetchDataLoading);

  const loading = cableLoading || refLoading;
  const errored = cableErrored || refErrored;

  const [editMode, setEditMode] = useState(false);
  const [noteCable, setNoteCable] = useState(ref?.QRY_CABLE_REF || []);

  const fetchNoteData = () => {
    if (note?.NM_SEQ_NUM) {
      dispatch(cableFetchData({
        I_NM_SEQ_NUM: note.NM_SEQ_NUM,
        I_NM_NOTIFICATION_IND: note.NM_NOTIFICATION_IND,
      }));
      dispatch(noteCableRefFetchData({
        I_NM_SEQ_NUM: note.NM_SEQ_NUM,
      }));
    }
  };

  useEffect(() => {
    fetchNoteData();
  }, [note]);

  useEffect(() => {
    if (ref?.QRY_CABLE_REF) {
      setNoteCable(ref?.QRY_CABLE_REF);
    }
  }, [ref]);

  const getCableValue = (key) => {
    const section = noteCable.find(c => c.ME_DESC === key);
    return section?.NME_DEFAULT_CLOB || '';
  };

  const modCableValue = (key, override, clear) => {
    const sections = noteCable.map(c => {
      if (c.ME_DESC === key) {
        return {
          ...c,
          NME_OVERRIDE_CLOB: override || '',
          NME_CLEAR_IND: clear ? 'N' : 'Y',
        };
      }
      return c;
    });
    setNoteCable(sections);
  };

  const freeTextContainer = (children, meDescs) => {
    let tabSeqNums = '';
    let tabUpdateIds = '';
    let tabUpdateDates = '';
    if (meDescs) {
      meDescs.forEach(m => {
        const separator = tabSeqNums === '' ? '' : ',';
        const section = noteCable.find(c => c.ME_DESC === m);
        if (section) {
          tabSeqNums = tabSeqNums.concat(separator, section?.NME_SEQ_NUM);
          tabUpdateIds = tabUpdateIds.concat(separator, section?.NME_UPDATE_ID);
          tabUpdateDates = tabUpdateDates.concat(separator, section?.NME_UPDATE_DATE);
        }
      });
    }

    return (
      <div className="notification-card">
        <div className="notification-card__header">
          <span>
            Edit Notification
          </span>
          <span>
            Please update all relevant information as it pertains to this note.
          </span>
        </div>
        <div className="notification-card__rebuild">
          <button
            className="standard-add-button underlined"
            onClick={() => {
              dispatch(rebuildNotification(
                {
                  I_NME_SEQ_NUM: tabSeqNums,
                  I_NME_UPDATE_ID: tabUpdateIds,
                  I_NME_UPDATE_DATE: tabUpdateDates,
                },
                () => fetchNoteData(),
              ));
            }}
          >
            <p>Rebuild Tab</p>
          </button>
          <button
            className="standard-add-button underlined"
            onClick={() => {
              dispatch(rebuildNotification(
                { I_NM_SEQ_NUM: note?.NM_SEQ_NUM },
                () => fetchNoteData(),
              ));
            }}
          >
            <p>Rebuild Notification</p>
          </button>
        </div>
        {children}
        <div className="position-form--actions">
          <button onClick={() => setEditMode(false)}>Back to Preview</button>
          <button onClick={() => { }}>Save</button>
        </div>
      </div>
    );
  };

  // const memoContainer = (children) => (
  //   <div className="notification-card">
  //     <div className="notification-card__header">
  //       <span>Memorandum</span>
  //     </div>
  //     {children}
  //   </div>
  // );

  const getOverlay = () => {
    let overlay;
    if (loading) {
      overlay = <Spinner type="bureau-results" class="homepage-position-results" size="big" />;
    } else if (errored) {
      overlay = <Alert type="error" title="Error loading results" messages={[{ body: 'Please try again.' }]} />;
    } else {
      return false;
    }
    return overlay;
  };

  const getPreviewText = () => {
    const textLines = [
      `${getCableValue('CLASSIFICATION')}\n\n`,
      `${getCableValue('DRAFTING OFFICE')}`,
      `${getCableValue('DATE')} - ${getCableValue('TELEPHONE')}`,
      `${getCableValue('APPROVING OFFICE')}\n`,
      `${getCableValue('CLEARANCE')}\n`,
      // `${getCableValue('DISTRIBUTION')}\n`,
      // `${getCableValue('ACTION')}\n`,
      // `${getCableValue('INFORMATION')}\n`,
      `${getCableValue('SPECIAL HANDLING')}\n`,
      `${getCableValue('CAPTIONS')}\n`,
      `${getCableValue('E.O.')}\n`,
      `${getCableValue('TAGS')}\n`,
      `${getCableValue('SUBJECT')}\n`,
      `1. ${getCableValue('ASSIGNMENTS')}\n`,
      `2. ${getCableValue('COMBINED TOD')}\n`,
      `3. ${getCableValue('EFM')}\n`,
      `4. ${getCableValue('REMARKS')}\n`,
      `5. ${getCableValue('PARAGRAPHS')}\n`,
      `${getCableValue('EOM')}`,
    ];
    return textLines.join('\n');
  };

  return (getOverlay() || (!editMode ?
    <Row fluid className="tabbed-card box-shadow-standard">
      <Row fluid className="tabbed-card--header">
        <NavTabs
          tabs={[{ text: 'Preview', value: 'PREVIEW' }]}
          value="PREVIEW"
          styleVariant="lightBorderBottom"
        />
      </Row>
      <div className="position-content position-form notification-card">
        <button className="toggle-edit-mode notification-card__rebuild" onClick={() => setEditMode(true)}>
          <FA name="pencil" />
          <div>Edit</div>
        </button>
        <div className="notification-card__header">
          <span>
            Notification
          </span>
          <span>
            The Notification Cable for {getCableValue('EMPLOYEE FULL NAME')} will be emailed to the Dos Communications Center from the preparer {getCableValue('FROM_ADDRESS')}.
          </span>
        </div>
        <Row fluid className="position-content--description">
          <Linkify properties={{ target: '_blank' }}>
            <TextareaAutosize
              maxRows={50}
              minRows={1}
              maxLength="500"
              name="preview-body"
              value={getPreviewText()}
              draggable={false}
              disabled
            />
          </Linkify>
          <div className="word-count">
            {getPreviewText()?.length} / 500
          </div>
        </Row>
        <div className="position-form--actions">
          <button onClick={() => { }}>Cancel</button>
          <button onClick={() => { }}>Email Cable</button>
        </div>
      </div>
    </Row> :
    <TabbedCard
      tabs={[{
        text: 'Header',
        value: 'HEADER',
        content: freeTextContainer(
          <Header
            getCableValue={getCableValue}
            modCableValue={modCableValue}
          />,
          [
            'DRAFTING OFFICE', 'DATE', 'TELEPHONE', 'SUBJECT',
            'CLEARANCE', 'CLASSIFICATION', 'SPECIAL HANDLING',
            'CAPTIONS', 'E.O.', 'TAGS', 'EOM', 'CONTINUATION',
          ],
        ),
      }, {
        text: 'Routing',
        value: 'ROUTING',
        content: freeTextContainer(
          <Routing
            getCableValue={getCableValue}
            modCableValue={modCableValue}
            postOptions={ref?.QRY_POST_REF}
            precedenceOptions={ref?.QRY_PT_REF}
            organizationOptions={ref?.QRY_ORGS_REF}
          />,
          ['ACTION', 'INFORMATION', 'DISTRIBUTION'],
        ),
      }, {
        text: 'Assignments',
        value: 'ASSIGNMENTS',
        content: freeTextContainer(
          <Assignments
            getCableValue={getCableValue}
            modCableValue={modCableValue}
            assignments={ref?.QRY_ASG_REF}
          />,
          ['ASSIGNMENTS', 'COMBINED TOD'],
        ),
      }, {
        text: 'Paragraphs',
        value: 'PARAGRAPHS',
        content: freeTextContainer(
          <Paragraphs
            getCableValue={getCableValue}
            modCableValue={modCableValue}
            paragraphs={ref?.QRY_PARA_REF}
          />,
          ['PARAGRAPHS'],
        ),
      }, {
        text: 'Training',
        value: 'TRAINING',
        content: freeTextContainer(
          <Training
            getCableValue={getCableValue}
            modCableValue={modCableValue}
          />,
          ['TRAINING'],
        ),
      }, {
        text: 'EFM',
        value: 'EFM',
        content: freeTextContainer(
          <EFM
            getCableValue={getCableValue}
            modCableValue={modCableValue}
          />,
          ['EFM'],
        ),
      }, {
        text: 'Remarks',
        value: 'REMARKS',
        content: freeTextContainer(
          <Remarks
            getCableValue={getCableValue}
            modCableValue={modCableValue}
          />,
          ['REMARKS'],
        ),
        // }, {
        //   text: 'Memo',
        //   value: 'MEMO',
        //   content: memoContainer(<Memo />),
        // }, {
        //   text: 'Memo Header',
        //   value: 'MEMOHEADER',
        //   content: memoContainer(<MemoHeader />),
      }]}
    />
  ));
};

NotificationCard.propTypes = {
  note: PropTypes.shape({
    NM_SEQ_NUM: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

NotificationCard.defaultProps = {
  note: undefined,
};

export default NotificationCard;
