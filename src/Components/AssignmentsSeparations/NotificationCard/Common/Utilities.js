import { v4 as uuidv4 } from 'uuid';
import jsPDF from 'jspdf';
import { formatDate, getAssetPath } from 'utilities';

const dosSeal = getAssetPath('/assets/img/dos-seal-pdf.png');

/* eslint-disable indent */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */

/**
 * Generates PDF of TM1 Note/Memo formatted accordingly to given
 * examples in EOPF directory
 * @param {*} getPreviewText retrieves the formatted note/memo preview text
 * @param {*} filename name of the note/memo according to EOPF filename standards
 */
export const generatePDF = (getPreviewText, filename, memo) => {
  const content = document.createElement('p');
  content.style.cssText = 'width:calc(595px - 72px); font-size:12px; font-family:Times; line-height:1.3em; letter-spacing:0.01em; white-space:pre-line;';
  content.innerHTML = getPreviewText(true);

  // eslint-disable-next-line new-cap
  const pdf = new jsPDF('p', 'pt', 'a4');
  pdf.html(content, {
    callback: (doc) => {
      if (memo) {
        doc.addImage(dosSeal, 'PNG', 36, 10, 75, 75);
      }
      // eslint-disable-next-line no-loops/no-loops
      for (let page = 1; page <= doc.getNumberOfPages(); page += 1) {
        doc.setPage(page);
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.15 }));
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(70);
        doc.text(
          'NOT FOR PRODUCTION USE',
          297, 400,
          { align: 'center', baseline: 'center', maxWidth: 500 },
        );
        doc.restoreGraphicsState();
      }
      doc.save(filename);
    },
    margin: [36, 36, 36, 36],
    autoPaging: 'text',
  });
};

/**
 * Helper function to append Approval Chain XML items to a section
 * @param {*} element document HTML element to append to
 * @param {*} apprOriginator ref array of approval originator objects
 */
const appendChain = (element, apprOriginator, doc) => (
  apprOriginator.forEach(a => {
    if (a.Name || a.EmailAddress || a.OrgName || a.UserId) {
      var Name = doc.createElement('Name');
      Name.innerHTML = a.Name;
      element.appendChild(Name);
      var EMailAddress = doc.createElement('EMailAddress');
      EMailAddress.innerHTML = a.EmailAddress;
      element.appendChild(EMailAddress);
      var OrgName = doc.createElement('OrgName');
      OrgName.innerHTML = a.OrgName;
      element.appendChild(OrgName);
      var UserID = doc.createElement('UserID');
      UserID.innerHTML = a.UserId;
      element.appendChild(UserID);
    }
  })
);

/**
 * Generates XML of TM1 Notification according to FSBID format
 * @param {*} cable cable ref object
 * @param {*} content formatted contents of the note cable
 * @param {*} subject subject line of note cable
 */
export const generateXML = (cable, content, subject) => {
  const uuid = uuidv4();
  const date = new Date();
  const apprOriginator = cable?.QRY_APPR_ORIGINATOR;
  const routingDistro = cable?.QRY_ROUTING_DISTRO;

  var doc = document.implementation.createDocument('', '', null);

  var SmartPortalMessage = doc.createElement('SmartPortalMessage');
  SmartPortalMessage.setAttribute('xmlns', 'http://SmartPortalMessage.State.Gov/v1');
  SmartPortalMessage.setAttribute('xmlns:xsd', 'http://www.w3.org/2001/XMLSchema');
  SmartPortalMessage.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');

  // ================== IDENTIFIERS ==================

  var Identifiers = doc.createElement('Identifiers');
  SmartPortalMessage.appendChild(Identifiers);
    var MessageID = doc.createElement('MessageID');
    MessageID.innerHTML = uuid;
    Identifiers.appendChild(MessageID);
    var MessageIDOriginal = doc.createElement('MessageIDOriginal');
    MessageIDOriginal.innerHTML = uuid;
    Identifiers.appendChild(MessageIDOriginal);

  // ================== DTG ==================

  var Dtg = doc.createElement('Dtg');
  SmartPortalMessage.appendChild(Dtg);

  // ================== PRECEDENCE ==================

  var Precedence = doc.createElement('Precedence');
  Precedence.innerHTML = 'Routine';
  SmartPortalMessage.appendChild(Precedence);

  // ================== CLASSIFICATION ==================

  var Classification = doc.createElement('Classification');
  SmartPortalMessage.appendChild(Classification);
    var ClassificationLevel = doc.createElement('ClassificationLevel');
    ClassificationLevel.innerHTML = 'Unclassified';
    Classification.appendChild(ClassificationLevel);
    var ClassificationDate = doc.createElement('ClassificationDate');
    ClassificationDate.innerHTML = formatDate(date, 'YYYY-MM-DD'); // Generate current datestamp 2024-06-24 format
    Classification.appendChild(ClassificationDate);
    var Agency = doc.createElement('Agency');
    Agency.innerHTML = 'State';
    Classification.appendChild(Agency);
    var Office = doc.createElement('Office');
    Classification.appendChild(Office);
    var EONumber = doc.createElement('EONumber');
    EONumber.innerHTML = '13526';
    Classification.appendChild(EONumber);
    var Derived = doc.createElement('Derived');
    Classification.appendChild(Derived);

  // ================== ADDRESSEES ==================

  var Addressees = doc.createElement('Addressees');
  SmartPortalMessage.appendChild(Addressees);
    var Addressee = doc.createElement('Addressee');
    Addressees.appendChild(Addressee);
    routingDistro.forEach(a => {
      if (a.DT_CODE === 'A' || a.DT_CODE === 'I') {
        var Address = doc.createElement('Address');
        Address.innerHTML = a.DisplayName;
        Addressee.appendChild(Address);
        var AddressDisplayName = doc.createElement('AddressDisplayName');
        AddressDisplayName.innerHTML = a.DisplayName;
        Addressee.appendChild(AddressDisplayName);
        var AddressType = doc.createElement('AddressType');
        AddressType.innerHTML = a.AddressType;
        Addressee.appendChild(AddressType);
        var ActionType = doc.createElement('ActionType');
        ActionType.innerHTML = a.ActionType;
        Addressee.appendChild(ActionType);
        var Precedence2 = doc.createElement('Precedence');
        Precedence2.innerHTML = a.Precendence;
        Addressee.appendChild(Precedence2);
        var IsZen = doc.createElement('IsZen');
        IsZen.innerHTML = 'false';
        Addressee.appendChild(IsZen);
      }
    });

  // ================== APPROVAL CHAIN ==================

  var ApprovalChain = doc.createElement('ApprovalChain');
  SmartPortalMessage.appendChild(ApprovalChain);
    var Drafter = doc.createElement('Drafter');
    ApprovalChain.appendChild(Drafter);
    appendChain(Drafter, apprOriginator, doc);
    var Approver = doc.createElement('Approver');
    ApprovalChain.appendChild(Approver);
    appendChain(Approver, apprOriginator, doc);
    var Releaser = doc.createElement('Releaser');
    ApprovalChain.appendChild(Releaser);
    appendChain(Releaser, apprOriginator, doc);
    var Originator = doc.createElement('Originator');
    ApprovalChain.appendChild(Originator);
    apprOriginator.forEach(a => {
      var OriginatorName = doc.createElement('Originator');
      OriginatorName.innerHTML = a?.OriginatorName;
      Originator.appendChild(OriginatorName);
      var OriginatorRoutingIndicator = doc.createElement('OriginatorRoutingIndicator');
      Originator.appendChild(OriginatorRoutingIndicator);
      var OriginatorLocalName = doc.createElement('OriginatorLocalName');
      OriginatorLocalName.innerHTML = a?.ORIGINATORLOCALNAME;
      Originator.appendChild(OriginatorLocalName);
    });

  // ================== CONTENT ==================

  var Content = doc.createElement('Content');
  SmartPortalMessage.appendChild(Content);
    var BodyPlainText = doc.createElement('BodyPlainText');
    BodyPlainText.innerHTML = `<![CDATA[${content}]]>`;
    Content.appendChild(BodyPlainText);
    var Subject = doc.createElement('Subject');
    Subject.innerHTML = subject;
    Content.appendChild(Subject);

  // ================== PROPERTIES ==================

  var Properties = doc.createElement('Properties');
  SmartPortalMessage.appendChild(Properties);
    var ReleaseDateTime = doc.createElement('ReleaseDateTime');
    ReleaseDateTime.innerHTML = date.toISOString(); // Convert timestamp 2024-06-24T00:00:00Z format
    Properties.appendChild(ReleaseDateTime);
    var MessageType = doc.createElement('MessageType');
    MessageType.innerHTML = 'OrgAuthority';
    Properties.appendChild(MessageType);
    var TransmitComputerName = doc.createElement('TransmitComputerName');
    Properties.appendChild(TransmitComputerName);
    var TransmitSystem = doc.createElement('TransmitSystem');
    Properties.appendChild(TransmitSystem);
    var CorrectionReason = doc.createElement('CorrectionReason');
    Properties.appendChild(CorrectionReason);
    var AdHocProperties = doc.createElement('AdHocProperties');
    Properties.appendChild(AdHocProperties);
      var Key = doc.createElement('Key');
      Key.innerHTML = 'SystemSource';
      AdHocProperties.appendChild(Key);
      var Value = doc.createElement('Value');
      Value.innerHTML = 'FSBID';
      AdHocProperties.appendChild(Value);
    var AdHocProperties2 = doc.createElement('AdHocProperties');
    Properties.appendChild(AdHocProperties2);
      var Key2 = doc.createElement('Key');
      Key2.innerHTML = 'SchemaSource';
      AdHocProperties2.appendChild(Key2);
      var Value2 = doc.createElement('Value');
      Value2.innerHTML = 'SmartPortalMessage';
      AdHocProperties2.appendChild(Value2);

  // ========== CLASSIFICATION MODIFICATION DRIVER ==========

  var ClassificationModificationDriver = doc.createElement('ClassificationModificationDriver');
  ClassificationModificationDriver.setAttribute('xsi:nil', 'true');
  SmartPortalMessage.appendChild(ClassificationModificationDriver);

  // ================== SENSITIVITY CODE ==================

  var SensitivityCode = doc.createElement('SensitivityCode');
  SensitivityCode.innerHTML = 'Privacy/PII';
  SmartPortalMessage.appendChild(SensitivityCode);

  // ================== REL TO MARKINGS ==================

  var RelToMarkings = doc.createElement('RelToMarkings');
  SmartPortalMessage.appendChild(RelToMarkings);

  // ================== REFERENCES ==================

  var References = doc.createElement('References');
  SmartPortalMessage.appendChild(References);

  // ================== CAPTIONS ==================

  var Captions = doc.createElement('Captions');
  SmartPortalMessage.appendChild(Captions);
    var Caption = doc.createElement('Caption');
    Captions.appendChild(Caption);
      var ValueC = doc.createElement('Value');
      ValueC.innerHTML = 'TM CHANNEL';
      Caption.appendChild(ValueC);

  // ================== TAGS ==================

  var Tags = doc.createElement('Tags');
  SmartPortalMessage.appendChild(Tags);
    var Tag = doc.createElement('Tag');
    Tags.appendChild(Tag);
      var ValueT = doc.createElement('Value');
      ValueT.innerHTML = 'APER';
      Tag.appendChild(ValueT);
      var TagType = doc.createElement('TagType');
      TagType.innerHTML = 'S';
      Tag.appendChild(TagType);
    var Tag2 = doc.createElement('Tag');
    Tags.appendChild(Tag2);
      var ValueT2 = doc.createElement('Value');
      ValueT2.innerHTML = 'AFIN';
      Tag2.appendChild(ValueT2);
      var TagTypeT2 = doc.createElement('TagType');
      TagTypeT2.innerHTML = 'S';
      Tag2.appendChild(TagTypeT2);
    var PassLines = doc.createElement('PassLines');
    Tags.appendChild(PassLines);
    routingDistro.forEach(a => {
      var PassLine = doc.createElement('PassLine');
      PassLine.innerHTML = a;
      PassLines.appendChild(PassLine);
    });

  doc.appendChild(SmartPortalMessage);

  return doc;
};
