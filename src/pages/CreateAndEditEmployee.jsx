import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const CreateAndEditEmployee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData || null;
  const isEdit = Boolean(editData);
  const dummyImage = "https://via.placeholder.com/50";
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    image: "",
    age: "",
    salary: "",
  });
  const [isCreate, setIsCreate] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // 'success' or 'error'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "salary" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = isCreate
        ? await fetch(
            "https://interviewtesting.onrender.com/v1/users/employee/create",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            }
          )
        : await fetch(
            `https://interviewtesting.onrender.com/v1/users/employee-update/${editData._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            }
          );

      const data = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: `Employee ${isCreate ? "created" : "updated"} successfully!`,
          severity: "success",
        });
        setFormData({
          fullName: isCreate ? "" : data?.data?.fullName,
          email: isCreate ? "" : data?.data?.email,
          phone: isCreate ? "" : data?.data?.phone,
          image: isCreate ? "" : data?.data?.image,
          age: isCreate ? "" : data?.data?.age,
          salary: isCreate ? "" : data?.data?.salary,
        });
      } else {
        setSnackbar({
          open: true,
          message:
            data.message ||
            `Failed to ${isCreate ? "created" : "updated"} employee`,
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error ${isCreate ? "creating" : "updating"} employee`,
        severity: "error",
      });
      console.error("Error details:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const fetchData = async (id) => {
    try {
      const response = await fetch(
        `https://interviewtesting.onrender.com/v1/users/employee/${id}`
      );
      const data = await response.json();

      if (data && data.data) {
        setIsCreate(false);
        setFormData({
          fullName: data.data?.fullName || "",
          email: data.data?.email || "",
          phone: data.data?.phone || "",
          image: data.data?.image || "",
          age: data.data?.age || "",
          salary: data.data?.salary || "",
        });
      } else {
        setIsCreate(true);
      }
    } catch (error) {
      setIsCreate(true);
      console.error("Error fetching data:", error);
    }
  };

  // Pre-fill form data if editData is provided
  useEffect(() => {
    if (isEdit && editData && editData._id) {
      fetchData(editData._id);
    }
  }, [isEdit, editData]);

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "auto",
        padding: 3,
      }}
    >
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h5" gutterBottom>
          {isCreate ? (
            "Create Employee"
          ) : (
            <Box display="flex" alignItems="center">
              <img
                src={formData.image || dummyImage}
                alt={formData.fullName || "Dummy Image"}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: 10,
                }}
              />
              {formData.fullName}
            </Box>
          )}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Salary"
            name="salary"
            type="number"
            value={formData.salary}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={() => navigate(-1)} // Navigate back to the previous page
            >
              Back
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {isCreate ? "Create" : "Save"}
            </Button>
          </Box>
        </form>
      </Paper>
      {/* Snackbar for feedback */}
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
    </Box>
  );
};

export default CreateAndEditEmployee;
