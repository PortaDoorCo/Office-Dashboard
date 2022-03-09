import React from 'react';
import DataTable from 'react-data-table-component';
import { Row, Col, FormGroup, Input, Button } from 'reactstrap';
import styled from 'styled-components';

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;

  &:hover {
    cursor: pointer;
  }
`;

const ClearButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const columns = [
  {
    name: 'Order #',
    selector: (row) => row.id + 100,
  },
  {
    name: 'Company',
    selector: (row) => row.job_info?.customer?.Company,
  },
  {
    name: 'Address',
    selector: (row) =>
      `${row.job_info?.customer?.Address1} ${row.job_info?.customer?.Address2}, ${row.job_info?.customer?.City}, ${row.job_info?.customer?.State}, ${row.job_info?.customer?.Zip}`,
  },
  {
    name: 'Status',
    grow: 1,
    cell: (row) => (
      <div>
        <Row>
          <Col>
            <FormGroup style={{ height: '100%' }}>
              {row.status === 'Invoiced' || row.status === 'Complete' ? (
                <div
                  style={{
                    paddingTop: '1rem',
                    paddingLeft: '1rem',
                  }}
                >
                  Complete
                </div>
              ) : (
                row.status
              )}
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col style={{ textAlign: 'center', color: 'red' }}>
            {row?.job_info?.Rush && row?.job_info?.Sample
              ? 'Sample / Rush'
              : row?.job_info?.Rush
              ? 'Rush'
              : row?.job_info?.Sample
              ? 'Sample'
              : ''}
          </Col>
        </Row>
      </div>
    ),
  },
];

const Table = ({ data }) => {
  const [selectedRows, setSelectedRows] = React.useState(false);
  const [toggledClearRows, setToggleClearRows] = React.useState(false);
  const [toggleCleared, setToggleCleared] = React.useState(false);
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [filterText, setFilterText] = React.useState('');
  const filteredItems = data.filter((item) =>
    item.id.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  // Toggle the state so React Data Table changes to clearSelectedRows are triggered
  const handleClearRows = () => {
    setToggleClearRows(!toggledClearRows);
  };

  const contextActions = React.useMemo(() => {
    const handleDelete = () => {
      if (
        window.confirm(
          `Are you sure you want to delete:\r ${selectedRows.map(
            (r) => r.title
          )}?`
        )
      ) {
        setToggleCleared(!toggleCleared);
      }
    };

    return (
      <Button key="delete" onClick={handleDelete} color="danger" icon>
        Delete
      </Button>
    );
  }, [data, selectedRows, toggleCleared]);

  const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <>
      <TextField
        id="search"
        type="text"
        placeholder="Search Orders"
        value={filterText}
        onChange={onFilter}
        autoComplete="off"
      />
      <ClearButton type="button" color="danger" onClick={onClear}>
        X
      </ClearButton>
    </>
  );

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <DataTable
      columns={columns}
      data={filteredItems}
      selectableRows
      onSelectedRowsChange={handleChange}
      clearSelectedRows={toggledClearRows}
      contextActions={contextActions}
      pagination
    />
  );
};

export default Table;
