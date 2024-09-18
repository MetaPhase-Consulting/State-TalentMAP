import { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import PropTypes from 'prop-types';

const MaintainELPositionsTable = ({ elPositions }) => {
  const gridRef = useRef(null);

  const [headers] = useState([
    // checkbox uses space bar to change value
    { field: 'el', headerName: 'EL Managed', editable: true, width: 100 },
    { field: 'lna', headerName: 'LNA', editable: true, width: 75 },
    { field: 'fica', headerName: 'FICA', editable: true, width: 75 },
    { field: 'elToMl', headerName: 'EL to ML OTO', editable: true, width: 100 },
    { field: 'mlToEl', headerName: 'ML to EL OTO', editable: true, width: 100 },
    { field: 'cedeEndDate', headerName: 'Cede End Date', editable: true, width: 125 },
    { field: 'bureau', headerName: 'Bureau', width: 75 },
    { field: 'od', headerName: 'Overseas / Domestic', width: 100 },
    { field: 'location', headerName: 'Location / Org', width: 150 },
    { field: 'positionNumber', headerName: 'Position Number', width: 100 },
    { field: 'skill', headerName: 'Skill', width: 150 },
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'grade', headerName: 'Grade', width: 75 },
    { field: 'languages', headerName: 'Languages', width: 175 },
    { field: 'incumbent', headerName: 'Incumbent', width: 150 },
    { field: 'incumbentTED', headerName: 'Incumbent TED', width: 125 },
    { field: 'assignee', headerName: 'Assignee', width: 150 },
    { field: 'assigneeTED', headerName: 'Assignee TED', width: 125 },
  ]);

  const mapObjectToRow = (obj) => ({
    el: obj.EL === 'true',
    lna: obj.LNA === 'true',
    fica: obj.FICA === 'true',
    elToMl: obj.ELTOML === 'true',
    mlToEl: obj.MC === 'true',
    mcEndDate: obj.mcEndDate,
    bureau: obj.bureau,
    od: obj.OD,
    location: obj.org,
    positionNumber: obj.positionNumber,
    skill: obj.skill,
    positionTitle: obj.positionTitle,
    grade: obj.grade,
    languages: obj.languages,
    incumbent: obj.incumbent,
    incumbentTED: obj.incumbentTED,
    assignee: obj.assignee,
    assigneeTED: obj.assigneeTED,
  });

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (elPositions.length > 0) {
      const mappedRows = elPositions.map(mapObjectToRow);
      setRows(mappedRows);
    }
  }, [elPositions]);

  const defaultColDef = {
    sortable: false,
  };

  const onCellValueChanged = (params) => {
    // @TODO connect to api /save
    const updatedRows = [...rows];
    updatedRows[params.node.id] = params.data;
    setRows(updatedRows);
  };

  return (
    <div className="el-table ag-theme-quartz" style={{ height: 650, width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        columnDefs={headers}
        rowData={rows}
        onCellValueChanged={onCellValueChanged}
        defaultColDef={defaultColDef}
        singleClickEdit
      />
    </div>
  );
};

MaintainELPositionsTable.propTypes = {
  elPositions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default MaintainELPositionsTable;
