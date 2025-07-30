import React, { useEffect, useMemo, useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Plus } from "lucide-react";
import axios from "axios";

ModuleRegistry.registerModules([AllCommunityModule]);

const App = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const [rowData, setRowData] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    department: ""
  });

  const gridRef = useRef();

  const fetchEmployees = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/employees`);
      setRowData(result.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async () => {
    const { name, email, department } = newEmployee;
    if (!name || !email || !department) return;

    try {
      await axios.post(`${BASE_URL}/employees`, newEmployee);
      setNewEmployee({ name: "", email: "", department: "" });
      fetchEmployees();
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}/employees/${id}`);
      alert("Employee deleted successfully");
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleSave = async (data) => {
    try {
      await axios.put(`${BASE_URL}/employees/${data.id}`, data);
      setEditRowId(null);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleCancel = () => {
    setEditRowId(null);
    fetchEmployees();
  };

  const handleNameFilterChange = (e) => {
    const value = e.target.value;
    setFilterValue(value);

    if (gridRef.current && gridRef.current.api) {
      const filterModel =
        value.trim() === ""
          ? null // 🔥 This clears the filter
          : {
            name: {
              type: "contains",
              filter: value,
            },
          };

      gridRef.current.api.setFilterModel(filterModel);
      gridRef.current.api.onFilterChanged();
    }
  };

  const ActionButton = (props) => {
    const { data } = props;
    const isEditing = data.id === editRowId;

    return (
      <div className="flex gap-2 justify-center">
        {isEditing ? (
          <>
            <button
              className="bg-green-600 text-white px-2 py-1 rounded text-sm"
              onClick={() => handleSave(data)}
            >
              Save
            </button>
            <button
              className="bg-gray-500 text-white px-2 py-1 rounded text-sm"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
              onClick={() => setEditRowId(data.id)}
            >
              Update
            </button>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded text-sm"
              onClick={() => handleDelete(data.id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    );
  };

  const columnDefs = [
    { headerName: "ID", field: "id", sortable: true, width: 80 },
    {
      headerName: "Name",
      field: "name",
      editable: (params) => params.data.id === editRowId
    },
    {
      headerName: "Email",
      field: "email",
      editable: (params) => params.data.id === editRowId
    },
    {
      headerName: "Department",
      field: "department",
      editable: (params) => params.data.id === editRowId
    },
    {
      headerName: "Created At",
      field: "created_at",
      valueFormatter: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        return date.toLocaleString();
      }
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: ActionButton,
      cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" },
      editable: false
    }
  ];

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      filter: true,
      floatingFilter: true,
      resizable: true
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Employee Management using AG Grid
      </h1>

      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
        {/* Employee Form */}
        <div className="flex flex-wrap gap-4 justify-between items-end">
          <div className="flex flex-col w-[200px]">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col w-[240px]">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col w-[200px]">
            <label className="text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              placeholder="Engineering"
              value={newEmployee.department}
              onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleAddEmployee}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Add
          </button>
        </div>

        {/* External Filter */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Name:</label>
          <input
            type="text"
            placeholder="Search name..."
            onChange={handleNameFilterChange}
            className="border rounded px-3 py-2 w-[240px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* AG Grid */}
        <div className="ag-theme-quartz w-full h-[500px] rounded shadow-md">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            stopEditingWhenCellsLoseFocus={true}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
