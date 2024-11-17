import React, { useEffect, useState } from "react";
import BasicTable from "../components/ViewTable";
import CreateAndEditEmployee from "./CreateAndEditEmployee";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Snackbar } from "@mui/material";
import TableSkeleton from "../components/TableSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../redux/employeeSlice";

const Home = () => {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // 'success' or 'error'
  });
  const [deleteLoading, setDeleteLoading] = useState(null);

  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.employees);

  const headCells = [
    { name: "Image", key: "image" },
    { name: "Name", key: "fullName" },
    { name: "Email", key: "email" },
    { name: "Phone", key: "phone" },

    { name: "Age", key: "age" },
    { name: "Salary", key: "salary" },
    {
      name: "Actions", // Add a render function for the Actions column
      key: "actions",
      render: (row) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              navigate(`/create-employee`, { state: { editData: row } })
            }
            sx={{ mr: 2 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              row && row._id && handleDelete(row._id);
            }}
            disabled={deleteLoading === row._id} // Disable only the button for the current row
            startIcon={
              deleteLoading === row._id ? (
                <CircularProgress
                  size={20}
                  color="inherit"
                  sx={{ position: "absolute", top: "7px", left: "38px" }}
                />
              ) : null
            }
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleDelete = async (id) => {
    setDeleteLoading(id);
    try {
      const response = await fetch(
        `https://interviewtesting.onrender.com/v1/users/employee-remove/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Employee deleted successfully!",
          severity: "success",
        });

        setRefresh((prev) => !prev);
      } else {
        setSnackbar({
          open: true,
          message: "Failed to delete employee",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      setSnackbar({
        open: true,
        message: "An error occurred while deleting the employee",
        severity: "error",
      });
    } finally {
      setDeleteLoading(null); // Reset loading state
    }
  };

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [refresh]);

  return (
    <div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1>Welcome to Employee Management</h1>
        <Link to="/create-employee">
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            sx={{ padding: "10px 20px", fontSize: "16px", mb: 5 }}
          >
            Create Employee
          </Button>
        </Link>
      </div>{" "}
      {loading ? (
        <TableSkeleton rows={6} columns={6} />
      ) : (
        <BasicTable headCells={headCells} rows={list} />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Home;
