import { AgGridReact } from 'ag-grid-react';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatDate } from 'utilities';
import CheckBox from '../../../CheckBox';

const BidPortfolioTable = ({ results, setEditClassification }) => {
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const rowSelection = {
    mode: 'multiRow',
    headerCheckbox: false,
  };

  const mapObjectToRow = (obj) => ({
    Employee: obj?.shortened_name,
    Skill: obj?.skills[0]?.description || 'None listed',
    PPGrade: obj?.combined_pp_grade,
    Tenure: obj?.per_tenure,
    3: obj?.classifications.includes(207) ? '3' : '',
    6: obj?.classifications.includes(208) ? '6' : '',
    8: obj?.classifications.includes(217) ? '8' : '',
    A: obj?.classifications.includes(209) ? 'A' : '',
    C: obj?.classifications.includes(85) ? 'C' : '',
    C1: obj?.classifications.includes(203) ? 'C1' : '',
    CC: obj?.classifications.includes(204) ? 'CC' : '',
    D: obj?.classifications.includes(133) ? 'D' : '',
    F: obj?.classifications.includes(210) ? 'F' : '',
    M: obj?.classifications.includes(206) ? 'M' : '',
    R: obj?.classifications.includes(205) ? 'R' : '',
    T: obj?.classifications.includes(185) ? 'T' : '',
    LocationOrg: `${obj?.pos_location} / ${obj?.current_assignment.position.organization}`,
    Code: obj?.role_code,
    Position: obj?.position,
    ETA: formatDate(obj?.current_assignment.asgd_eta_date),
    TED: formatDate(obj?.current_assignment.end_date),
    SkillCode: obj?.skills[0]?.code || 'None listed',
    SkillCode2: obj?.skills[1]?.code || 'None listed',
    SkillCode3: obj?.skills[2]?.code || 'None listed',
    DOSEmail: obj?.cdos[0]?.cdo_email,
    AltEmail: obj?.cdos[0]?.cdo_alt_email,
    FSEOD: formatDate(obj?.EMP_FS_EOD_DT),
    LastPromotion: formatDate(obj?.EMP_LAST_PROMOTION_DT),
    SeparationDate: formatDate(obj?.SEP_PEND_DATE),
    SeparationPanelDate: formatDate(obj?.SEP_PEND_PANEL_DATE),
    SeparationLocation: obj?.SEP_PEND_LOCATION,
    EFM: obj?.EFM_MED_CLEARANCE_IND,
    Comments: obj?.comments,
    MandatoryRetirement: formatDate(obj?.EMP_MANDATORY_RETIRE_DT),
    MedicalIssue: obj?.EFM_MED_CLEARANCE_IND,
    Ldr: obj?.EMP_FULFILLED_LEADERSHIP_IND,
    NumberOfBids: obj?.EMP_ACTIVE_BID_COUNT,
    PanelDate: formatDate(obj?.ASG_PEND_PANEL_DT),
    SCD: formatDate(obj?.EMP_SERVICE_DT),
    SendDOSEmail: true,
    IncExc: false,
    SendAltEmail: true,
  });

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (results.length > 0) {
      const mappedRows = results.map(mapObjectToRow);
      setRows(mappedRows);
    }
  }, [results]);
  const [included, setIncluded] = useState(false);
  const [isTandem, setIsTandem] = useState(false);
  const [isDOSEmail, setIsDOSEmail] = useState(false);
  const [isAltEmail, setIsAltEmail] = useState(false);

  const IncExc = (e) => {
    console.log('Included', e);
    setIncluded(!included);
  };
  const setClassifications = (e) => {
    console.log('E', e);
  };

  const Tandem = () => {
    setIsTandem(!isTandem);
  };

  const DOSEmail = () => {
    setIsDOSEmail(!isDOSEmail);
  };

  const AltEmail = () => {
    setIsAltEmail(!isAltEmail);
  };

  const IncExcCheckboxComponent = (e) => <CheckBox value={included} onCheckBoxClick={() => IncExc(e)} disabled={false} />;
  const TandemCheckboxComponent = (e) => <CheckBox value={isTandem} onCheckBoxClick={Tandem} disabled={e?.data?.T === ''} />;
  const DOSEmailCheckboxComponent = (e) => <CheckBox value={isDOSEmail} onCheckBoxClick={DOSEmail} disabled={e?.data?.DOSEmail === undefined} />;
  const AltEmailCheckboxComponent = (e) => <CheckBox value={isAltEmail} onCheckBoxClick={AltEmail} disabled={e?.data?.AltEmail === undefined} />;

  const ClassificationCheckboxComponent = (e, { customParam1, customParam2 }) => e?.data[customParam1] === customParam1 && setEditClassification ?
    <CheckBox value={customParam2} onCheckBoxClick={() => setClassifications(e)} disabled={false} /> : <span>{customParam1}</span>;

  const [columnDefs] = useState([
    { field: 'IncExc', pinned: 'left', lockPosition: 'left', headerName: 'Inc/Exc', cellDataType: 'boolean', cellRenderer: IncExcCheckboxComponent },
    { field: 'Employee', pinned: 'left', lockPosition: 'left', headerName: 'Employee', headerToolTip: 'Employee Name' },
    { field: 'Skill', headerName: 'Skill', headerToolTip: 'Skill Code' },
    { field: 'PPGrade', headerName: 'PP/Grade', headerToolTip: 'Pay Plan/Grade' },
    { field: 'Tenure', headerName: 'Tenure', headerToolTip: 'Tenure' },
    { field: '3', headerName: '3rd Tour Bidders', cellDataType: 'boolean', cellRenderer: ClassificationCheckboxComponent, cellRendererParams: { customParam1: '3', customParam2: 207 } },
    { field: '6', headerName: '6/8 Rule', cellRenderer: ClassificationCheckboxComponent, cellRendererParams: { customParam1: '6', customParam2: 208 } },
    { field: '8', headerName: '8 Rule', cellRenderer: ClassificationCheckboxComponent, cellRendererParams: { customParam1: '8', customParam2: 217 } },
    { field: 'A', headerName: 'Ambassador or Deputy Assistant Secretary', cellRenderer: ClassificationCheckboxComponent, cellRendererParams: { customParam1: 'A', customParam2: 209 } },
    { field: 'C', headerName: 'Critical Need Language', cellRenderer: ClassificationCheckboxComponent, cellRendererParams: { customParam1: 'C', customParam2: 85 } },
    { field: 'C1', headerName: 'Critical Need Language 1st Tour Complete', cellRenderer: ClassificationCheckboxComponent, cellRendererParams: { customParam1: 'C1', customParam2: 203 } },
    { field: 'CC', headerName: 'Critical Need Language Final Tour Complete', cellRenderer: ClassificationCheckboxComponent, cellRendererParams: { customParam1: 'CC', customParam2: 204 } },
    { field: 'D', headerName: 'Differential Bidder', cellRenderer: ClassificationCheckboxComponent, cellRendererParams: { customParam1: 'D', customParam2: 133 } },
    { field: 'F', headerName: 'Fair Share Bidders', cellRenderer: ClassificationCheckboxComponent, cellRendererParams: { customParam1: 'F', customParam2: 210 } },
    { field: 'M', headerName: 'Meritorious Step Increases', cellRenderer: ClassificationCheckboxComponent, cellRendererParams: { customParam1: 'M', customParam2: 206 } },
    { field: 'R', headerName: 'Recommended for Tenure', cellRenderer: ClassificationCheckboxComponent, cellRendererParams: { customParam1: 'R', customParam2: 205 } },
    { field: 'T', cellDataType: 'boolean', headerName: 'Tandem Bidder', cellRenderer: TandemCheckboxComponent, cellRendererParams: { customParam1: 'T', customParam2: 185 } },
    { field: 'Ldr', headerName: 'Ldr' },
    { field: 'LocationOrg', headerName: 'Location/Org' },
    { field: 'Code', headerName: 'Code' },
    { field: 'Position', headerName: 'Position' },
    { field: 'ETA', headerName: 'ETA' },
    { field: 'TED', headerName: 'TED' },
    { field: 'PanelDate', headerName: 'Panel Date' },
    { field: 'SCD', headerName: 'SCD' },
    { field: 'Mandatory Retirement', headerName: 'Mandatory Retirement' },
    { field: 'FSEOD', headerName: 'FS EOD' },
    { field: 'Last Promotion', headerName: 'Last Promotion' },
    { field: 'MedicalIssue', headerName: 'Medical Issue' },
    { field: 'SkillCode', headerName: 'Skill Code 1' },
    { field: 'SkillCode2', headerName: 'Skill Code 2' },
    { field: 'SkillCode3', headerName: 'Skill Code 3' },
    { field: 'NumberOfBids', headerName: 'Number of Bids' },
    { field: 'EFM', headerName: 'EFM' },
    { field: 'Comments', headerName: 'Comments', editable: true },
    { field: 'SendDOSEmail', cellDataType: 'boolean', headerName: 'Send DOS Email', cellRenderer: DOSEmailCheckboxComponent },
    { field: 'DOSEmail', headerName: 'DOS Email', editable: true },
    { field: 'SendAltEmail', cellDataType: 'boolean', headerName: 'Send Alt Email', cellRenderer: AltEmailCheckboxComponent },
    { field: 'AltEmail', headerName: 'Alt Email', editable: true },
    { field: 'SeparationDate', headerName: 'Separation Date' },
    { field: 'SeparationPanelDate', headerName: 'Separation Panel Date' },
    { field: 'SeparationLocation', headerName: 'Separation Location' },
  ]);
  const onColumnPinned = useCallback((event) => {
    const allCols = event.api.getAllGridColumns();
    if (event.pinned !== 'right') {
      const allFixedCols = allCols.filter(
        (col) => col.getColDef().lockPosition,
      );
      event.api.setColumnsPinned(allFixedCols, event.pinned);
    }
  }, []);

  return (
    <div style={gridStyle}>
      <div
        style={{ width: '100%', height: 500 }}
        className={'ag-theme-quartz'}
      >
        <AgGridReact
          rowData={rows}
          columnDefs={columnDefs}
          onColumnPinned={onColumnPinned}
          rowSelection={rowSelection}
        />
      </div>
    </div>
  );
};

BidPortfolioTable.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
  setEditClassification: PropTypes.bool.isRequired,
};
export default BidPortfolioTable;
