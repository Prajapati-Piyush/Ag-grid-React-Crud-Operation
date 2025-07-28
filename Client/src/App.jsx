import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Plus, Edit, Trash, Save, XCircle } from "lucide-react";

ModuleRegistry.registerModules([AllCommunityModule]);

const initialRowData = [
  { make: "Tesla", model: "Model Y", price: 64950, electric: true },
  { make: "Ford", model: "F-series", price: 33850, electric: false },
  { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  { make: "Chevrolet", model: "Silverado", price: 40850, electric: false },
  { make: "BMW", model: "i4", price: 52300, electric: true },
];

const MAKES = ["Tesla", "Ford", "Toyota", "Chevrolet", "BMW"];

const App = () => {
  const [rowData, setRowData] = useState(
    initialRowData.map((row, i) => ({
      ...row,
      _id: `${Date.now()}-${i}-${Math.random()}`,
    }))
  );
  const [editingId, setEditingId] = useState(null);
  const [editCache, setEditCache] = useState({});
  const [newRow, setNewRow] = useState({
    make: "",
    model: "",
    price: "",
    electric: false,
  });

  // Columns: all cellRenderers are controlled by `editingId`
  const colDefs = [
    {
      headerName: "Make",
      field: "make",
      cellRenderer: params =>
        editingId === params.data._id ? (
          <select
            className="border rounded px-2 py-1 w-full"
            value={editCache.make}
            onChange={e =>
              setEditCache(ec => ({ ...ec, make: e.target.value }))
            }
          >
            {MAKES.map(make => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
        ) : (
          params.value
        ),
    },
    {
      headerName: "Model",
      field: "model",
      cellRenderer: params =>
        editingId === params.data._id ? (
          <input
            className="border rounded px-2 py-1 w-full"
            value={editCache.model}
            onChange={e =>
              setEditCache(ec => ({ ...ec, model: e.target.value }))
            }
          />
        ) : (
          params.value
        ),
    },
    {
      headerName: "Price",
      field: "price",
      cellRenderer: params =>
        editingId === params.data._id ? (
          <input
            className="border rounded px-2 py-1 w-full"
            type="number"
            value={editCache.price}
            onChange={e =>
              setEditCache(ec => ({
                ...ec,
                price: e.target.value,
              }))
            }
          />
        ) : (
          "$" + Number(params.value || 0).toLocaleString()
        ),
    },
    {
      headerName: "Electric",
      field: "electric",
      cellRenderer: params =>
        editingId === params.data._id ? (
          <select
            className="border rounded px-2 py-1 w-full"
            value={editCache.electric ? "true" : "false"}
            onChange={e =>
              setEditCache(ec => ({
                ...ec,
                electric: e.target.value === "true",
              }))
            }
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        ) : params.value ? (
          <span className="text-green-600 font-bold">Yes</span>
        ) : (
          <span className="text-gray-600">No</span>
        ),
    },
    {
      headerName: "Actions",
      field: "actions",
      pinned: "right",
      cellRenderer: params => {
        const isEditing = editingId === params.data._id;
        return isEditing ? (
          <div className="flex gap-2">
            <button
              className="p-1 bg-green-100 rounded hover:bg-green-300"
              title="Save"
              onClick={() => handleSave(params.data._id)}
            >
              <Save size={18} />
            </button>
            <button
              className="p-1 bg-red-100 rounded hover:bg-red-300"
              title="Cancel"
              onClick={handleCancelEdit}
            >
              <XCircle size={18} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              className="p-1 bg-blue-100 rounded hover:bg-blue-300"
              title="Edit"
              onClick={() => handleEdit(params.data)}
            >
              <Edit size={18} />
            </button>
            <button
              className="p-1 bg-red-100 rounded hover:bg-red-300"
              title="Delete"
              onClick={() => handleDelete(params.data._id)}
            >
              <Trash size={18} />
            </button>
          </div>
        );
      },
      editable: false,
      sortable: false,
      filter: false,
      width: 120,
    },
  ];

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      filter: true,
      floatingFilter: true,
      editable: false,
      resizable: true,
    }),
    []
  );

  // Edit handler
  function handleEdit(data) {
    setEditingId(data._id);
    setEditCache({ ...data });
  }

  // Save handler
  function handleSave(id) {
    setRowData(prev =>
      prev.map(row =>
        row._id === id
          ? {
              ...editCache,
              price: Number(editCache.price),
            }
          : row
      )
    );
    setEditingId(null);
    setEditCache({});
  }

  // Cancel handler
  function handleCancelEdit() {
    setEditingId(null);
    setEditCache({});
  }

  // Delete handler
  function handleDelete(id) {
    if (window.confirm("Delete this row?")) {
      setRowData(prev => prev.filter(row => row._id !== id));
      setEditingId(null);
      setEditCache({});
    }
  }

  // Add new row
  function handleAddRow() {
    if (
      !newRow.make ||
      !newRow.model ||
      !newRow.price ||
      newRow.electric === ""
    ) {
      window.alert("Please fill all fields before adding.");
      return;
    }
    const id = `${Date.now()}-${Math.random()}`;
    setRowData(prev => [
      ...prev,
      {
        ...newRow,
        price: Number(newRow.price),
        electric: newRow.electric === "true" || newRow.electric === true,
        _id: id,
      },
    ]);
    setNewRow({
      make: "",
      model: "",
      price: "",
      electric: false,
    });
  }

  // Add row form
  function renderAddRowForm() {
    return (
      <div className="flex gap-4 items-end mb-4">
        <select
          className="border rounded px-2 py-1"
          value={newRow.make}
          onChange={e => setNewRow(r => ({ ...r, make: e.target.value }))}
        >
          <option value="">Make</option>
          {MAKES.map(make => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>
        <input
          className="border rounded px-2 py-1"
          type="text"
          placeholder="Model"
          value={newRow.model}
          onChange={e => setNewRow(r => ({ ...r, model: e.target.value }))}
        />
        <input
          className="border rounded px-2 py-1"
          type="number"
          placeholder="Price"
          value={newRow.price}
          onChange={e => setNewRow(r => ({ ...r, price: e.target.value }))}
        />
        <select
          className="border rounded px-2 py-1"
          value={newRow.electric}
          onChange={e =>
            setNewRow(r => ({
              ...r,
              electric: e.target.value === "true",
            }))
          }
        >
          <option value={false}>Not Electric</option>
          <option value={true}>Electric</option>
        </select>
        <button
          className="p-2 bg-green-600 text-white rounded hover:bg-green-800 flex items-center gap-1"
          onClick={handleAddRow}
          title="Add row"
        >
          <Plus size={18} /> Add
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 mx-auto">
      <h1 className="text-center text-3xl mt-10 text-gray-900 font-bold">
        React Ag Grid CRUD (Edit, Add, Delete Working)
      </h1>
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="w-[80%]">
          {renderAddRowForm()}
          <div className="ag-theme-quartz" style={{ height: 500 }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={colDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={5}
              paginationPageSizeSelector={[5, 10]}
              rowSelection={{
                mode: "multiRow",
                checkboxes: true,
              }}
              stopEditingWhenCellsLoseFocus={true}
              suppressClickEdit={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;