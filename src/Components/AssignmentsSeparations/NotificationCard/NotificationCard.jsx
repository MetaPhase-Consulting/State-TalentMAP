import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { cableFetchData, noteCableFetchData, noteCableRefFetchData } from 'actions/assignmentNotifications';
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
// import Memo from './Tabs/Memo';
// import MemoHeader from './Tabs/MemoHeader';

const NotificationCard = (props) => {
  const { id, revisionNum } = props;

  const dispatch = useDispatch();

  // ====================== Data Retrieval ======================

  const note = useSelector(state => state.noteCableFetchData);
  const noteErrored = useSelector(state => state.noteCableFetchDataErrored);
  const noteLoading = useSelector(state => state.noteCableFetchDataLoading);
  const note$ = note[0] || undefined;

  // const cable = useSelector(state => state.cableFetchData);
  const cableErrored = useSelector(state => state.cableFetchDataErrored);
  const cableLoading = useSelector(state => state.cableFetchDataLoading);

  const ref = useSelector(state => state.noteCableRefFetchData);
  const refErrored = useSelector(state => state.noteCableRefFetchDataErrored);
  const refLoading = useSelector(state => state.noteCableRefFetchDataLoading);

  const loading = noteLoading || cableLoading || refLoading;
  const errored = noteErrored || cableErrored || refErrored;

  const [noteCable, setNoteCable] = useState(ref?.QRY_CABLE_REF || []);

  useEffect(() => {
    if (id) {
      dispatch(noteCableFetchData({
        I_ASG_SEQ_NUM: 318658, // TEMPORARILY HARD CODED
        I_ASGD_REVISION_NUM: revisionNum ?? 0,
      }));
    }
  }, [id]);

  useEffect(() => {
    if (note$?.NM_SEQ_NUM) {
      dispatch(cableFetchData({
        I_NM_SEQ_NUM: note$.NM_SEQ_NUM,
        I_NM_NOTIFICATION_IND: 0,
      }));
      dispatch(noteCableRefFetchData({
        I_NM_SEQ_NUM: note$.NM_SEQ_NUM,
      }));
    }
  }, [note]);

  useEffect(() => {
    if (ref?.QRY_CABLE_REF) {
      setNoteCable(ref?.QRY_CABLE_REF);
    }
  }, [ref]);

  const getCableValue = (key) => {
    const section = noteCable.find(c => c.ME_DESC === key);
    // console.log(noteCable);
    // console.log(section);
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

  const freeTextContainer = (children) => (
    <div className="notification-card">
      <div className="notification-card__header">
        <span>
          Edit Notification
        </span>
        <span>
          Please update all relevant information as it pertains to this note.
        </span>
      </div>
      {children}
    </div>
  );

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

  return (getOverlay() ||
    <TabbedCard
      tabs={[{
        text: 'Header',
        value: 'HEADER',
        content: freeTextContainer(
          <Header
            getCableValue={getCableValue}
            modCableValue={modCableValue}
          />,
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
        ),
      }, {
        text: 'Assignments',
        value: 'ASSIGNMENTS',
        content: freeTextContainer(<Assignments assignments={ref?.QRY_ASG_REF} />),
      }, {
        text: 'Paragraphs',
        value: 'PARAGRAPHS',
        content: freeTextContainer(
          <Paragraphs
            paragraphs={ref?.QRY_PARA_REF}
            getCableValue={getCableValue}
            modCableValue={modCableValue}
          />,
        ),
      }, {
        text: 'Training',
        value: 'TRAINING',
        content: freeTextContainer(
          <Training
            getCableValue={getCableValue}
            modCableValue={modCableValue}
          />,
        ),
      }, {
        text: 'EFM',
        value: 'EFM',
        content: freeTextContainer(
          <EFM
            getCableValue={getCableValue}
            modCableValue={modCableValue}
          />,
        ),
      }, {
        text: 'Remarks',
        value: 'REMARKS',
        content: freeTextContainer(
          <Remarks
            getCableValue={getCableValue}
            modCableValue={modCableValue}
          />,
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
  );
};

NotificationCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  revisionNum: PropTypes.number,
};

NotificationCard.defaultProps = {
  id: undefined,
  revisionNum: undefined,
};

export default NotificationCard;
