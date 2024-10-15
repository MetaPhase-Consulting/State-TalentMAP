import { v4 as uuidv4 } from 'uuid';
import jsPDF from 'jspdf';
import { formatDate, getAssetPath } from 'utilities';

const dosSeal = getAssetPath('/assets/img/dos-seal-pdf.png');

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

  let xmlStr = '<?xml version="1.0">';
  xmlStr = xmlStr.concat('<SmartPortalMessage xmlns="http://SmartPortalMessage.State.Gov/v1" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">');

  // ================== IDENTIFIERS ==================

  xmlStr = xmlStr.concat('<Identifiers>');
  xmlStr = xmlStr.concat(`<MessageID>${uuid}</MessageID>`);
  xmlStr = xmlStr.concat(`<MessageIDOriginal>${uuid}</MessageIDOriginal>`);
  xmlStr = xmlStr.concat('</Identifiers>');

  // ================== DTG ==================

  xmlStr = xmlStr.concat('<Dtg/>');

  // ================== PRECEDENCE ==================

  xmlStr = xmlStr.concat('<Precedence>Routine</Precedence>');

  // ================== CLASSIFICATION ==================

  xmlStr = xmlStr.concat('<Classification>');
  xmlStr = xmlStr.concat('<ClassificationLevel>Unclassified</ClassificationLevel>');
  xmlStr = xmlStr.concat(`<ClassificationDate>${formatDate(date, 'YYYY-MM-DD')}</ClassificationDate>`);
  xmlStr = xmlStr.concat('<Agency>State</Agency>');
  xmlStr = xmlStr.concat('<Office/>');
  xmlStr = xmlStr.concat('<EONumber>13526</EONumber>');
  xmlStr = xmlStr.concat('<Derived/>');
  xmlStr = xmlStr.concat('</Classification>');

  // ================== ADDRESSEES ==================

  xmlStr = xmlStr.concat('<Addressees>');
  routingDistro.forEach(a => {
    if (a.DT_CODE === 'A' || a.DT_CODE === 'I') {
      xmlStr = xmlStr.concat('<Addressee>');
      xmlStr = xmlStr.concat(`<Address>${a.DisplayName}</Address>`);
      xmlStr = xmlStr.concat(`<AddressDisplayName>${a.DisplayName}</AddressDisplayName>`);
      xmlStr = xmlStr.concat(`<AddressType>${a.AddressType}</AddressType>`);
      xmlStr = xmlStr.concat(`<ActionType>${a.ActionType}</ActionType>`);
      xmlStr = xmlStr.concat(`<Precedence>${a.Precedence}</Precedence>`);
      xmlStr = xmlStr.concat('<IsZen>false</IsZen>');
      xmlStr = xmlStr.concat('</Addressee>');
    }
  });
  xmlStr = xmlStr.concat('</Addressees>');

  // ================== APPROVAL CHAIN ==================

  xmlStr = xmlStr.concat('<ApprovalChain>');
  xmlStr = xmlStr.concat('<Drafter>');
  apprOriginator.forEach(a => {
    xmlStr = xmlStr.concat(`<Name>${a.Name}</Name>`);
    xmlStr = xmlStr.concat(`<EMailAddress>${a.EmailAddress}</EMailAddress>`);
    xmlStr = xmlStr.concat(`<OrgName>${a.OrgName}</OrgName>`);
    xmlStr = xmlStr.concat(`<UserID>${a.UserId}</UserID>`);
  });
  xmlStr = xmlStr.concat('</Drafter>');
  xmlStr = xmlStr.concat('<Approver>');
  apprOriginator.forEach(a => {
    xmlStr = xmlStr.concat(`<Name>${a.Name}</Name>`);
    xmlStr = xmlStr.concat(`<EMailAddress>${a.EmailAddress}</EMailAddress>`);
    xmlStr = xmlStr.concat(`<OrgName>${a.OrgName}</OrgName>`);
    xmlStr = xmlStr.concat(`<UserID>${a.UserId}</UserID>`);
  });
  xmlStr = xmlStr.concat('</Approver>');
  xmlStr = xmlStr.concat('<Releaser>');
  apprOriginator.forEach(a => {
    xmlStr = xmlStr.concat(`<Name>${a.Name}</Name>`);
    xmlStr = xmlStr.concat(`<EMailAddress>${a.EmailAddress}</EMailAddress>`);
    xmlStr = xmlStr.concat(`<OrgName>${a.OrgName}</OrgName>`);
    xmlStr = xmlStr.concat(`<UserID>${a.UserId}</UserID>`);
  });
  xmlStr = xmlStr.concat('</Releaser>');
  xmlStr = xmlStr.concat('<Originator>');
  apprOriginator.forEach(a => {
    xmlStr = xmlStr.concat(`<OriginatorName>${a.OriginatorName}</OriginatorName>`);
    xmlStr = xmlStr.concat('<OriginatorRoutingIndicator/>');
    xmlStr = xmlStr.concat(`<OriginatorLocalName>${a.ORIGINATORLOCALNAME}</OriginatorLocalName>`);
  });
  xmlStr = xmlStr.concat('</Originator>');
  xmlStr = xmlStr.concat('</ApprovalChain>');

  // ================== CONTENT ==================

  xmlStr = xmlStr.concat('<Content>');
  xmlStr = xmlStr.concat(`<BodyPlainText><![CDATA[${content}]]></BodyPlainText>`);
  xmlStr = xmlStr.concat(`<Subject>${subject}</Subject>`);
  xmlStr = xmlStr.concat('</Content>');

  // ================== PROPERTIES ==================

  xmlStr = xmlStr.concat('<Properties>');
  xmlStr = xmlStr.concat(`<ReleaseDateTime>${date.toISOString()}</ReleaseDateTime>`);
  xmlStr = xmlStr.concat('<MessageType>OrgAuthority</MessageType>');
  xmlStr = xmlStr.concat('<TransmitComputerName/>');
  xmlStr = xmlStr.concat('<TransmitSystem/>');
  xmlStr = xmlStr.concat('<CorrectionReason/>');
  xmlStr = xmlStr.concat('<AdHocProperties>');
  xmlStr = xmlStr.concat('<Key>SystemSource</Key>');
  xmlStr = xmlStr.concat('<Value>FSBID</Value>');
  xmlStr = xmlStr.concat('</AdHocProperties>');
  xmlStr = xmlStr.concat('<AdHocProperties>');
  xmlStr = xmlStr.concat('<Key>SchemaSource</Key>');
  xmlStr = xmlStr.concat('<Value>SmartPortalMessage</Value>');
  xmlStr = xmlStr.concat('</AdHocProperties>');
  xmlStr = xmlStr.concat('</Properties>');

  // ========== CLASSIFICATION MODIFICATION DRIVER ==========

  xmlStr = xmlStr.concat('<ClassificationModificationDriver xsi:nil="true"/>');

  // ================== SENSITIVITY CODE ==================

  xmlStr = xmlStr.concat('<SensitivityCode>Privacy/PII</SensitivityCode>');

  // ================== REL TO MARKINGS ==================

  xmlStr = xmlStr.concat('<RelToMarkings/>');

  // ================== REFERENCES ==================

  xmlStr = xmlStr.concat('<References/>');

  // ================== CAPTIONS ==================

  xmlStr = xmlStr.concat('<Captions>');
  xmlStr = xmlStr.concat('<Caption>');
  xmlStr = xmlStr.concat('<Value>TM CHANNEL</Value>');
  xmlStr = xmlStr.concat('</Caption>');
  xmlStr = xmlStr.concat('</Captions>');

  // ================== TAGS ==================

  xmlStr = xmlStr.concat('<Tags>');
  xmlStr = xmlStr.concat('<Tag>');
  xmlStr = xmlStr.concat('<Value>APER</Value>');
  xmlStr = xmlStr.concat('<TagType>S</TagType>');
  xmlStr = xmlStr.concat('</Tag>');
  xmlStr = xmlStr.concat('<Tag>');
  xmlStr = xmlStr.concat('<Value>AFIN</Value>');
  xmlStr = xmlStr.concat('<TagType>S</TagType>');
  xmlStr = xmlStr.concat('</Tag>');
  xmlStr = xmlStr.concat('</Tags>');

  // ================== PASSLINES ==================

  xmlStr = xmlStr.concat('<PassLines>');
  routingDistro.forEach(a => {
    xmlStr = xmlStr.concat(`<PassLine>${a.PASSLINE}<PassLine>`);
  });
  xmlStr = xmlStr.concat('</PassLines>');


  xmlStr = xmlStr.concat('</SmartPortalMessage>');

  // ================== PARSE XML ==================
  // const parser = new window.DOMParser();
  // const xml = parser.parseFromString(xmlStr, 'text/xml');
  // console.log(xml);

  // ================== SERIALIZE XML ==================
  // const serializer = new window.XMLSerializer();
  // const xmlDoc = serializer.serializeToString(xml);
  // console.log(xmlDoc);

  return xmlStr;
};
