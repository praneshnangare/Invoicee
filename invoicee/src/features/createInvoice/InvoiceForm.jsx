import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  TextField,
  Button,
  Autocomplete,
  Grid,
  Box,
  Fab,
} from "@mui/material";
import useSheets from "./useSheets";
import MainLayout from "../../components/MainLayout";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { useFormik } from "formik";
import * as Yup from "yup";
import validationSchema from "../../schemas/invoiceValidation";

const InvoiceForm = () => {
  const [customers, setCustomers] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const { updateSheet, fetchCustomers, fetchProducts, fetchInvoiceNumber, createInvoice } =
    useSheets();

  useEffect(() => {
    fetchCustomers((values) => setCustomers(values));
    fetchProducts((values) => setProductsList(values));
    fetchInvoiceNumber((values) => formik.setFieldValue("invoiceNumber", values));
    // updateSheet(spreadsheetId, range, values);
  }, []);

  const initialValues = {
    invoiceDate: "",
    invoiceNumber: 0,
    selectedCustomer: null,
    products: [{ name: "", quantity: 0, price: 0 }],
  };

  const handleSubmit = (values) => {
    const payload = {
      invoiceNumber: values.invoiceNumber,
      invoiceDate: values.invoiceDate,
      customerName: values.selectedCustomer.name,
      customerAddress: values.selectedCustomer.address,
      customerGst: values.selectedCustomer.gstNumber,
      customerState: values.selectedCustomer.state,
      products: values.products,
    };
    // updateSheet(payload);
    createInvoice(payload);
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
    validationSchema,
  });

  const handleCustomerSelection = (event) => {
    formik.setFieldValue("selectedCustomer", event.target.value);
  };

  const handleAddProduct = () => {
    formik.setFieldValue("products", [
      ...formik.values.products,
      { name: "", quantity: 0, price: 0 },
    ]);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formik.values.products];
    updatedProducts[index][field] = value;
    formik.setFieldValue("products", updatedProducts);
  };

  const handleDeleteProduct = (index) => {
    const updatedProducts = [...formik.values.products];
    updatedProducts.splice(index, 1);
    formik.setFieldValue("products", updatedProducts);
  };

  const getOptionLabel = (option) => option?.label ?? "";

  const rightComponent = (
    <form onSubmit={formik.handleSubmit}>
      <Grid item container flexDirection={"column"} spacing={2} xs={5}>
        <Grid item xs={12}>
          <Typography variant="h6">Pranesh Enterprises</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Invoice</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="invoiceDate"
            label="Invoice Date"
            type="date"
            value={formik.values.invoiceDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {formik.touched.invoiceDate && formik.errors.invoiceDate && (
            <Typography color="error">{formik.errors.invoiceDate}</Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="invoiceNumber"
            label="Invoice Number"
            value={formik.values.invoiceNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.invoiceNumber && formik.errors.invoiceNumber && (
            <Typography color="error">{formik.errors.invoiceNumber}</Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="customer-name-label">Customer Name</InputLabel>
            <Select
              labelId="customer-name-label"
              id="customer-name"
              value={formik.values.selectedCustomer ?? ""}
              onChange={handleCustomerSelection}
              onBlur={formik.handleBlur}
            >
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer}>
                  {customer.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.selectedCustomer && formik.errors.selectedCustomer && (
              <Typography color="error">{formik.errors.selectedCustomer.name}</Typography>
            )}
          </FormControl>
        </Grid>
        {formik.values.products.map((product, index) => (
          <Grid item container spacing={2} key={index} flexDirection={"row"}>
            <Grid item xs={5}>
              <Autocomplete
                id={`product-name-${index}`}
                options={productsList}
                freeSolo
                getOptionLabel={getOptionLabel}
                onInputChange={(e, value) => {
                  value
                    ? handleProductChange(index, "name", value)
                    : handleProductChange(index, "name", "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Product Name"
                    value={product.name}
                    onChange={(e) =>
                      handleProductChange(index, "name", e.target.value)
                    }
                    onBlur={formik.handleBlur}
                  />
                )}
              />
              {formik.touched.products && formik.errors.products && formik.errors.products[index] && (
                <Typography color="error">{formik.errors.products[index].name}</Typography>
              )}
            </Grid>
            <Grid item xs={3}>
              <TextField
                id={`quantity-${index}`}
                label="Quantity"
                type="number"
                value={product.quantity}
                onChange={(e) =>
                  handleProductChange(index, "quantity", e.target.value)
                }
                onBlur={formik.handleBlur}
              />
              {formik.touched.products && formik.errors.products && formik.errors.products[index] && (
                <Typography color="error">{formik.errors.products[index].quantity}</Typography>
              )}
            </Grid>
            <Grid item xs={3}>
              <TextField
                id={`price-${index}`}
                label="Price"
                type="number"
                value={product.price}
                onChange={(e) =>
                  handleProductChange(index, "price", e.target.value)
                }
                onBlur={formik.handleBlur}
              />
              {formik.touched.products && formik.errors.products && formik.errors.products[index] && (
                <Typography color="error">{formik.errors.products[index].price}</Typography>
              )}
            </Grid>

            <Grid item xs={1} display={"flex"} alignItems={"center"}>
              <CancelRoundedIcon
                onClick={(e) => handleDeleteProduct(index)}
                xs={1}
              />
            </Grid>
          </Grid>
        ))}
        <Grid
          item
          xs={12}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <AddCircleOutlineOutlinedIcon onClick={handleAddProduct} />
        </Grid>
        <Grid
          item
          xs={12}
          display={"flex"}
          marginTop={2}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Button type="submit" variant="contained" color="success">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );

  return (
    <>
      <MainLayout rightComponent={rightComponent} />
    </>
  );
};

export default InvoiceForm;
