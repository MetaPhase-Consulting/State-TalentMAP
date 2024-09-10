import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Linkify from 'react-linkify';
import FA from 'react-fontawesome';
import PropTypes from 'prop-types';
import TextareaAutosize from 'react-textarea-autosize';
import {
  cableFetchData, editNoteCable, noteCableRefFetchData,
  rebuildNotification, sendNotification,
} from 'actions/assignmentNotifications';
import { EMPTY_FUNCTION } from 'Constants/PropTypes';
import { Row } from 'Components/Layout';
import TabbedCard from 'Components/TabbedCard';
import Spinner from 'Components/Spinner';
import Alert from 'Components/Alert';
import NavTabs from 'Components/NavTabs';
import Header from './Tabs/Header';
import EFM from './Tabs/EFM';
import Remarks from './Tabs/Remarks';
import Training from './Tabs/Training';
import Assignments from './Tabs/Assignments';
import Paragraphs from './Tabs/Paragraphs';
import Routing from './Tabs/Routing';
import MemoHeader from './Tabs/MemoHeader';

const NotificationCard = (props) => {
  const { note, onCancel, memo } = props;

  const dispatch = useDispatch();

  // ====================== Data Retrieval ======================

  const cable = useSelector(state => state.cableFetchData);
  const cableErrored = useSelector(state => state.cableFetchDataErrored);
  const cableLoading = useSelector(state => state.cableFetchDataLoading);

  const ref = useSelector(state => state.noteCableRefFetchData);
  const refErrored = useSelector(state => state.noteCableRefFetchDataErrored);
  const refLoading = useSelector(state => state.noteCableRefFetchDataLoading);

  const loading = cableLoading || refLoading;
  const errored = cableErrored || refErrored;

  const [editMode, setEditMode] = useState(false);
  const [noteCable, setNoteCable] = useState(ref?.QRY_CABLE_REF || []);
  const [noteRouting, setNoteRouting] = useState(ref?.QRY_NMD_REF || []);
  const [noteParagraphs, setNoteParagraphs] = useState([]);

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
    if (ref?.QRY_NMD_REF) {
      setNoteRouting(ref?.QRY_NMD_REF);
    }
    if (ref?.QRY_PARA_REF) {
      const selectedParagraphs = ref?.QRY_PARA_REF?.filter(p => p.INC_IND === 1);
      setNoteParagraphs(selectedParagraphs.map(p => p.NOTP_CODE));
    }
  }, [ref]);

  const getCableValue = (key, returnAll) => {
    const section = noteCable.find(c => c.ME_DESC === key);
    if (returnAll) {
      return section;
    }
    if (section?.NME_CLEAR_IND === 'Y') {
      return '';
    }
    return section?.NME_OVERRIDE_CLOB || section?.NME_DEFAULT_CLOB;
  };

  const modCableValue = (key, override) => {
    const sections = noteCable.map(c => {
      if (c.ME_DESC === key) {
        return {
          ...c,
          NME_OVERRIDE_CLOB: override || '',
          NME_CLEAR_IND: 'N',
        };
      }
      return c;
    });
    setNoteCable(sections);
  };

  const modRoutingValue = (nmdSeqNum, key, value) => {
    if (nmdSeqNum) {
      const routings = noteRouting.map(r => {
        if (r.NMD_SEQ_NUM === nmdSeqNum) {
          const newR = r;
          newR[key] = value;
          return newR;
        }
        return r;
      });
      setNoteRouting(routings);
    } else if (key === 'DT_CODE') {
      const routings = [...noteRouting];
      routings.push({
        NMD_SEQ_NUM: Math.random().toString(),
        NME_SEQ_NUM: null,
        DT_CODE: value,
        PT_CODE: null,
        ORG_CODE: null,
        CP_SEQ_NUM: null,
        NMD_SLUG_TEXT: null,
        NMD_UPDATE_ID: null,
        NMD_UPDATE_DATE: null,
      });
      setNoteRouting(routings);
    }
  };

  const handleDefaultClear = (cableKeys, clear) => {
    const sections = noteCable.map(c => {
      if (cableKeys.includes(c.ME_DESC)) {
        return {
          ...c,
          NME_OVERRIDE_CLOB: clear ? c.NME_OVERRIDE_CLOB : '',
          NME_CLEAR_IND: clear ? 'Y' : 'N',
        };
      }
      return c;
    });
    setNoteCable(sections);
    if (cableKeys.includes('PARAGRAPHS')) {
      if (clear) {
        setNoteParagraphs([]);
      } else if (ref?.QRY_PARA_REF) {
        const selectedParagraphs = ref?.QRY_PARA_REF?.filter(p => p.INC_IND === 1);
        setNoteParagraphs(selectedParagraphs.map(p => p.NOTP_CODE));
      }
    }
  };

  const handleSave = () => {
    const paragraph = getCableValue('PARAGRAPHS', true);
    const distribution = getCableValue('DISTRIBUTION', true);
    const information = getCableValue('INFORMATION', true);
    const action = getCableValue('ACTION', true);

    let HDR_NME_SEQ_NUM = '';
    let HDR_CLOB_LENGTH = '';
    let HDR_NME_OVERRIDE_CLOB = '';
    let HDR_NME_UPDATE_ID = '';
    let HDR_NME_UPDATE_DATE = '';
    let HDR_NME_CLEAR_IND = '';

    noteCable.forEach(s => {
      const separator = HDR_NME_SEQ_NUM === '' ? '' : ',';
      HDR_NME_SEQ_NUM = HDR_NME_SEQ_NUM.concat(separator, s.NME_SEQ_NUM);
      HDR_CLOB_LENGTH = HDR_CLOB_LENGTH.concat(separator, s.NME_OVERRIDE_CLOB.length);
      HDR_NME_OVERRIDE_CLOB = HDR_NME_OVERRIDE_CLOB.concat(separator, s.NME_OVERRIDE_CLOB);
      HDR_NME_UPDATE_ID = HDR_NME_UPDATE_ID.concat(separator, s.NME_UPDATE_ID);
      HDR_NME_UPDATE_DATE = HDR_NME_UPDATE_DATE.concat(separator, s.NME_UPDATE_DATE);
      HDR_NME_CLEAR_IND = HDR_NME_CLEAR_IND.concat(separator, s.NME_CLEAR_IND);
    });

    let INC_IND = '';
    let NMD_SEQ_NUM = '';
    let DT_CODE = '';
    let PT_CODE = '';
    let ORG_CODE = '';
    let CP_SEQ_NUM = '';
    let NMD_SLUG_TEXT = '';
    let NMD_UPDATE_ID = '';
    let NMD_UPDATE_DATE = '';

    noteRouting.forEach(s => {
      const separator = INC_IND === '' ? '' : ',';
      INC_IND = INC_IND.concat(separator, 1);
      NMD_SEQ_NUM = NMD_SEQ_NUM.concat(separator, s.NMD_UPDATE_DATE ? s.NMD_SEQ_NUM : '');
      DT_CODE = DT_CODE.concat(separator, s.DT_CODE);
      PT_CODE = PT_CODE.concat(separator, s.PT_CODE);
      ORG_CODE = ORG_CODE.concat(separator, s.ORG_CODE);
      CP_SEQ_NUM = CP_SEQ_NUM.concat(separator, s.CP_SEQ_NUM);
      NMD_SLUG_TEXT = NMD_SLUG_TEXT.concat(separator, s.NMD_SLUG_TEXT);
      NMD_UPDATE_ID = NMD_UPDATE_ID.concat(separator, s.NMD_UPDATE_ID);
      NMD_UPDATE_DATE = NMD_UPDATE_DATE.concat(separator, s.NMD_UPDATE_DATE);
    });

    const req = {
      I_NM_SEQ_NUM: note?.NM_SEQ_NUM,

      I_HDR_NME_SEQ_NUM: HDR_NME_SEQ_NUM,
      I_HDR_CLOB_LENGTH: HDR_CLOB_LENGTH,
      I_HDR_NME_OVERRIDE_CLOB: HDR_NME_OVERRIDE_CLOB,
      I_HDR_NME_UPDATE_ID: HDR_NME_UPDATE_ID,
      I_HDR_NME_UPDATE_DATE: HDR_NME_UPDATE_DATE,
      I_HDR_NME_CLEAR_IND: HDR_NME_CLEAR_IND,

      I_ASG_NME_SEQ_NUM: null,
      I_ASG_NMAS_SEQ_NUM: null,
      I_ASG_NMAS_UPDATE_ID: null,
      I_ASG_NMAS_UPDATE_DT: null,

      I_PARA_NME_SEQ_NUM: paragraph.NME_SEQ_NUM,
      I_PARA_NOTP_CODE: noteParagraphs.join(),
      I_PARA_NME_UPDATE_ID: paragraph.NME_UPDATE_ID,
      I_PARA_NME_UPDATE_DATE: paragraph.NME_UPDATE_DATE,

      I_DIST_NME_SEQ_NUM: distribution.NME_SEQ_NUM,
      I_DIST_NME_UPDATE_ID: distribution.NME_UPDATE_ID,
      I_DIST_NME_UPDATE_DATE: distribution.NME_UPDATE_DATE,

      I_ACT_NME_SEQ_NUM: action.NME_SEQ_NUM,
      I_ACT_NME_UPDATE_ID: action.NME_UPDATE_ID,
      I_ACT_NME_UPDATE_DATE: action.NME_UPDATE_DATE,

      I_INFO_NME_SEQ_NUM: information.NME_SEQ_NUM,
      I_INFO_NME_UPDATE_ID: information.NME_UPDATE_ID,
      I_INFO_NME_UPDATE_DATE: information.NME_UPDATE_DATE,

      I_INC_IND: INC_IND,
      I_NMD_SEQ_NUM: NMD_SEQ_NUM,
      I_DT_CODE: DT_CODE,
      I_PT_CODE: PT_CODE,
      I_ORG_CODE: ORG_CODE,
      I_CP_SEQ_NUM: CP_SEQ_NUM,
      I_NMD_SLUG_TEXT: NMD_SLUG_TEXT,
      I_NMD_UPDATE_ID: NMD_UPDATE_ID,
      I_NMD_UPDATE_DATE: NMD_UPDATE_DATE,
    };

    editNoteCable(req, fetchNoteData, memo);
  };

  const handleSend = () => {
    sendNotification({
      I_NM_SEQ_NUM: note?.NM_SEQ_NUM,
      I_NOTE_TYPE: memo ? 'M' : 'C',
    }, null, memo);
  };

  const freeTextContainer = (children, meDescs) => {
    let tabSeqNums = '';
    let tabUpdateIds = '';
    let tabUpdateDates = '';
    if (meDescs) {
      meDescs.forEach(m => {
        const separator = tabSeqNums === '' ? '' : '|';
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
            Edit {memo ? 'Memo' : 'Notification'}
          </span>
          <span>
            Please update all relevant information as it pertains to this {memo ? 'memo' : 'note'}.
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
                memo,
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
                memo,
              ));
            }}
          >
            <p>Rebuild {memo ? 'Memo' : 'Notification'}</p>
          </button>
        </div>
        {children}
        <div className="position-form--actions">
          <button onClick={() => setEditMode(false)}>Back to Preview</button>
          <button onClick={() => handleSave()}>Save</button>
        </div>
      </div>
    );
  };

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
    const textLines = memo ? [
      `${getCableValue('ASSIGNMENTS')}\n`,
      `${getCableValue('COMBINED TOD')}\n`,
      `${getCableValue('REMARKS')}\n`,
      `${getCableValue('PARAGRAPHS')}\n`,
    ] : [
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
          {memo ?
            <>
              <span>
                Memorandum
              </span>
              <span className="notification-card__header-subtitle">To</span>
              <span>
                {getCableValue('TO_ADDRESS') ?? '---'}
              </span>
              <span className="notification-card__header-subtitle">From</span>
              <span>
                {getCableValue('FROM_ADDRESS') ?? '---'}
              </span>
              <span className="notification-card__header-subtitle">Subject</span>
              <span>
                {getCableValue('SUBJECT') ?? '---'}
              </span>
              <span className="notification-card__header-subtitle">Last Sent</span>
              <span>
                {cable?.O_LAST_SENT_DATE ?? '---'}
              </span>
              <span className="notification-card__header-subtitle">Body</span>
            </> :
            <>
              <span>
                Notification
              </span>
              <span>
                The Notification Cable for {getCableValue('EMPLOYEE FULL NAME')} will be emailed to the Dos Communications Center from the preparer {getCableValue('FROM_ADDRESS')}.
              </span>
            </>
          }
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
          <button onClick={onCancel}>Cancel</button>
          <button onClick={() => handleSend()}>Email {memo ? 'Memo' : 'Cable'}</button>
        </div>
      </div>
    </Row > :
    <TabbedCard
      tabs={[memo ? {
        text: 'Header',
        value: 'HEADER',
        content: freeTextContainer(
          <MemoHeader
            getCableValue={getCableValue}
            modCableValue={modCableValue}
            handleDefaultClear={handleDefaultClear}
          />,
          ['TO_ADDRESS', 'FROM_ADDRESS', 'SUBJECT'],
        ),
      } : {
        text: 'Header',
        value: 'HEADER',
        content: freeTextContainer(
          <Header
            getCableValue={getCableValue}
            modCableValue={modCableValue}
            handleDefaultClear={handleDefaultClear}
          />,
          [
            'DRAFTING OFFICE', 'DATE', 'TELEPHONE', 'SUBJECT',
            'CLEARANCE', 'CLASSIFICATION', 'SPECIAL HANDLING',
            'CAPTIONS', 'E.O.', 'TAGS', 'EOM', 'CONTINUATION',
          ],
        ),
      }, memo ? null : {
        text: 'Routing',
        value: 'ROUTING',
        content: freeTextContainer(
          <Routing
            routingValue={noteRouting}
            modRoutingValue={modRoutingValue}
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
            handleDefaultClear={handleDefaultClear}
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
            handleDefaultClear={handleDefaultClear}
            selections={noteParagraphs}
            setSelections={setNoteParagraphs}
            paragraphs={ref?.QRY_PARA_REF}
            defaultSelections={ref?.QRY_PARA_REF?.filter(p => p.INC_IND === 1).map(p => p.NOTP_CODE)}
          />,
          ['PARAGRAPHS'],
        ),
      }, memo ? null : {
        text: 'Training',
        value: 'TRAINING',
        content: freeTextContainer(
          <Training
            getCableValue={getCableValue}
            modCableValue={modCableValue}
            handleDefaultClear={handleDefaultClear}
          />,
          ['TRAINING'],
        ),
      }, memo ? null : {
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
            handleDefaultClear={handleDefaultClear}
          />,
          ['REMARKS'],
        ),
      }]}
    />
  ));
};

NotificationCard.propTypes = {
  note: PropTypes.shape({
    NM_SEQ_NUM: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onCancel: PropTypes.func,
  memo: PropTypes.bool,
};

NotificationCard.defaultProps = {
  note: undefined,
  onCancel: EMPTY_FUNCTION,
  memo: false,
};

export default NotificationCard;
