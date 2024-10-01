import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatDate } from 'utilities';

const BidPortfolioTable = ({ results }) => {
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const rowSelection = {
    mode: 'multiRow',
    headerCheckbox: false,
  };

  const mapObjectToRow = (obj) => ({
    IncExc: false,
    Employee: obj.shortened_name,
    Skill: 100,
    PPGrade: obj.combined_pp_grade,
    Tenure: 14100,
    3: 100,
    6: 100,
    8: 100,
    A: 100,
    C: 100,
    C1: 100,
    CC: 100,
    D: 100,
    F: 100,
    MR: 100,
    R: 100,
    T: true,
    Ldr: 'L',
    LocationOrg: `${obj.pos_location} / ${obj.current_assignment.position.organization}`,
    Code: obj.role_code,
    Position: 100,
    ETA: '05/23/25',
    TED: formatDate(obj.current_assignment.end_date),
    PanelDate: '05/23/25',
    SCD: 'MM/DD/YYYY',
    MandatoryRetirement: 'Y',
    FSEOD: 100,
    LastPromotion: 100,
    MedicalIssue: 'Y',
    SkillCode: obj.skills[0]?.code || 'None listed',
    SkillCode2: obj.skills[1]?.code || 'None listed',
    SkillCode3: obj.skills[2]?.code || 'None listed',
    NumberOfBids: 100,
    EFM: 100,
    Comments: 100,
    SendDOSEmail: true,
    DOSEmail: obj.cdos[0]?.cdo_email || 'None listed',
    SendAltEmail: true,
    AltEmail: obj.cdos[0]?.cdo_alt_email || 'None listed',
    SeparationDate: 100,
    SeparationPanelDate: '10/10/25',
    SeparationLocation: 'None',
  });

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (results.length > 0) {
      const mappedRows = results.map(mapObjectToRow);
      setRows(mappedRows);
    }
  }, [results]);

  const [columnDefs] = useState([
    { field: 'IncExc', pinned: 'left', lockPosition: 'left', headerName: 'Inc/Exc', headerToolTip: 'Include/Exclude', cellDataType: 'boolean' },
    { field: 'Employee', pinned: 'left', lockPosition: 'left', headerName: 'Employee', headerToolTip: 'Employee Name' },
    { field: 'Skill', headerName: 'Skill', headerToolTip: 'Skill Code' },
    { field: 'PPGrade', headerName: 'PP/Grade', headerToolTip: 'Pay Plan/Grade' },
    { field: 'Tenure', headerName: 'Tenure', headerToolTip: 'Tenure' },
    { field: '3', headerName: '3rd Tour Bidders' },
    { field: '6', headerName: '6/8 Rule' },
    { field: '8' },
    { field: 'A', headerName: 'Ambassador or Deputy Assistant Secretary' },
    { field: 'C', headerName: 'Critical Need Language' },
    { field: 'C1', headerName: 'Critical Need Language 1st Tour Complete' },
    { field: 'CC', headerName: 'Critical Need Language Final Tour Complete' },
    { field: 'D', headerName: 'Differential Bidder' },
    { field: 'F', headerName: 'Fair Share Bidders' },
    { field: 'MR' },
    { field: 'R', headerName: 'Recommended for Tenure' },
    { field: 'T', cellDataType: 'boolean', headerName: 'Tandem Bidder' },
    { field: 'Ldr', headerName: 'Ldr' },
    { field: 'LocationOrg', headerName: 'Location/Org' },
    { field: 'Code', headerName: 'Code' },
    { field: 'Position', headerName: 'Position' },
    { field: 'ETA', headerName: 'ETA' },
    { field: 'TED', headerName: 'TED' },
    { field: 'Panel Date', headerName: 'Panel Date' },
    { field: 'SCD', headerName: 'SCD' },
    { field: 'Mandatory Retirement', headerName: 'Mandatory Retirement' },
    { field: 'FS EOD', headerName: 'FS EOD' },
    { field: 'Last Promotion', headerName: 'Last Promotion' },
    { field: 'Medical Issue', headerName: 'Medical Issue' },
    { field: 'SkillCode', headerName: 'Skill Code 1' },
    { field: 'SkillCode2', headerName: 'Skill Code 2' },
    { field: 'SkillCode3', headerName: 'Skill Code 3' },
    { field: 'Number of Bids', headerName: 'Number of Bids' },
    { field: 'EFM', headerName: 'EFM' },
    { field: 'Comments', headerName: 'Comments' },
    { field: 'Send DOS Email', cellDataType: 'boolean', headerName: 'Send DOS Email' },
    { field: 'DOSEmail', headerName: 'DOS Email' },
    { field: 'Send Alt Email', cellDataType: 'boolean', headerName: 'Send Alt Email' },
    { field: 'Alt Email', headerName: 'Alt Email' },
    { field: 'Separation Date', headerName: 'Separation Date' },
    { field: 'Separation Panel Date', headerName: 'Separation Panel Date' },
    { field: 'Separation Location', headerName: 'Separation Location' },
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
};
export default BidPortfolioTable;
