import { useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

const MaintainELPositionsTable = () => {
  const gridRef = useRef(null);

  const [headers] = useState([
    // checkbox uses space bar to change value
    { field: 'elManaged', headerName: 'EL Managed', editable: true, width: 100 },
    { field: 'lna', headerName: 'LNA', editable: true, width: 75 },
    { field: 'fica', headerName: 'FICA', editable: true, width: 75 },
    { field: 'elToMl', headerName: 'EL to ML OTO', editable: true, width: 100 },
    { field: 'mlToEl', headerName: 'ML to EL OTO', editable: true, width: 100 },
    { field: 'cedeEndDate', headerName: 'Cede End Date', editable: true, width: 125 },
    { field: 'bureau', headerName: 'Bureau', width: 125 },
    { field: 'overseas', headerName: 'Overseas/Domestic', width: 175 },
    { field: 'location', headerName: 'Location/Org', width: 175 },
    { field: 'positionNumber', headerName: 'Position Number', width: 100 },
    { field: 'skill', headerName: 'Skill', width: 150 },
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'grade', headerName: 'Grade', width: 100 },
    { field: 'languages', headerName: 'Languages', width: 175 },
    { field: 'incumbent', headerName: 'Incumbent', width: 150 },
    { field: 'incumbentTED', headerName: 'Incumbent TED', width: 125 },
    { field: 'assignee', headerName: 'Assignee', width: 150 },
    { field: 'assigneeTED', headerName: 'Assignee TED', width: 125 },
  ]);

  const [rows, setRows] = useState([
    {
      elManaged: false,
      lna: false,
      fica: false,
      elToMl: false,
      mlToEl: false,
      cedeEndDate: '2023-12-31',
      bureau: 'Bureau A',
      overseas: 'Overseas',
      location: 'Location A',
      positionNumber: '12345',
      skill: 'Skill A',
      title: 'Title A',
      grade: 'Grade A',
      languages: 'English',
      incumbent: 'John Doe',
      incumbentTED: '2023-06-30',
      assignee: 'Jane Smith',
      assigneeTED: '2024-06-30',
    },
    {
      elManaged: true,
      lna: false,
      fica: true,
      elToMl: false,
      mlToEl: false,
      cedeEndDate: '2023-12-31',
      bureau: 'Bureau A',
      overseas: 'Overseas',
      location: 'Location A',
      positionNumber: '12345',
      skill: 'Skill A',
      title: 'Title A',
      grade: 'Grade A',
      languages: 'English',
      incumbent: 'Jane Doe',
      incumbentTED: '2023-06-30',
      assignee: 'Jane Smith',
      assigneeTED: '2024-06-30',
    },
  ]);

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
        singleClickEdit
      />
    </div>
  );
};

export default MaintainELPositionsTable;
