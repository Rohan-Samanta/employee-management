import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const BasicTable = (props) => {
  const { headCells, rows } = props;

  // URL for the dummy image
  const dummyImage = "https://via.placeholder.com/50";

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {headCells?.map((elm, index) => (
              <TableCell key={index}>
                <strong>{elm.name}</strong>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {headCells.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {column.render ? (
                    column.render(row) // Call render function if available
                  ) : column.key === "image" ? (
                    <img
                      src={row[column.key] || dummyImage}
                      alt={row.fullName || "Dummy Image"}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    row[column.key] || "N/A" // Show "N/A" for missing data
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;
