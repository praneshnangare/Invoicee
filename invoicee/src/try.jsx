import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import authenticate from '../src/googleAuth';
// import { GoogleAuth } from 'google-auth-library';

const CLIENT_ID = '106800480963-2brh49tiunu5shtuac8u3ojavj96qjcq.apps.googleusercontent.com';
const API_KEY = 'AIzaSyASjytXBD7oy-7P-6h4vS37rTyOIFEtMTo';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';
const SPREADSHEET_ID = '14zYQVENvbZxfaLFHrFjebrI6CEioJGY0lDygr5yXl80';
const CUSTOMERS_RANGE = 'Customers!A2:C';

const Try = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    // Load customer data from Google Sheets API
    loadCustomerData();

  }, []);

  const loadCustomerData = async () => {
    const url = `https://sheets.googleapis.com/v4/spreadshee
    ts/${SPREADSHEET_ID}/values/${CUSTOMERS_RANGE}?key=${API_KEY}`;
    
    try {
      const response = await axios.get(url);
      const rows = response.data.values;
      const customerData = rows.map((row) => ({
        label: row[0],
        value: row[1],
        address: row[2],
      }));
      setCustomers(customerData);
    } catch (error) {
      alert('Error fetching customer data:', error);
    }
  };

  const handleCustomerChange = (selectedOption) => {
    setSelectedCustomer(selectedOption);
  };

  const handleCreateInvoice = async () => {
    // updateSheet();
    if (selectedCustomer) {
      try {
        // Sign in with Google to obtain an access token
        // const auth2 = gapi.auth2.getAuthInstance();
        // const user = auth2.currentUser.get();
        // const authResponse = user.getAuthResponse();
        // const accessToken = authResponse.access_token;
  
        // Create a new sheet for the selected customer using Google Sheets API
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`;
        const requestBody = {
          requests: [
            {
              addSheet: {
                properties: {
                  title: `Invoice - ${selectedCustomer.label}`,
                },
              },
            },
          ],
        };
  
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
  
        await axios.post(url, requestBody, { headers });
  
        // Download the newly created sheet as a PDF
        const sheetId = 0; // Replace with the actual sheet ID
        const downloadLink = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?exportFormat=pdf&gid=${sheetId}`;
  
        // Open a new browser tab to download the PDF
        window.open(downloadLink, '_blank');
      } catch (error) {
        console.error('Error creating invoice:', error);
      }
    }
  };
  
  const updateSheet = async () => {
    try {
      await authenticate();
      const spreadsheetId = SPREADSHEET_ID;
      const range = 'Customers!A1:B2';
      const values = [
        ['Value 1', 'Value 2'],
        ['Value 3', 'Value 4'],
      ];
  
      const requestBody = {
        values,
      };
  
      const request = gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody,
      });
  
      await request.execute();
      console.log('Google Sheets updated successfully!');
    } catch (error) {
      console.error('Error updating Google Sheets:', error);
    }
  };
  

  
  return (
    <div>
      <h1>Pranesh Enterprises Invoice App</h1>
      <Select
        options={customers}
        value={selectedCustomer}
        onChange={handleCustomerChange}
        placeholder="Select a customer"
      />
      <button onClick={handleCreateInvoice} disabled={!selectedCustomer}>
        Create Invoice
      </button>
    </div>
  );
};

export default Try;




<h2>Invoice Form</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          id="invoice-date"
          label="Invoice Date"
          type="date"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <br />
        <TextField
          id="invoice-number"
          label="Invoice Number"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
        />
        <br />
        <FormControl>
          <InputLabel id="customer-name-label">Customer Name</InputLabel>
          <Select
            labelId="customer-name-label"
            id="customer-name"
            value={selectedCustomer ?? ""}
            onChange={handleCustomerSelection}
          >
            {customersList.map((customer) => (
              <MenuItem key={customer.id} value={customer}>
                {customer.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <TextField
          id="product-name"
          label="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          InputProps={{
            list: "product-suggestions",
          }}
        />
        <datalist id="product-suggestions">
          <option value="Product 1" />
          <option value="Product 2" />
          <option value="Product 3" />
        </datalist>
        <br />
        <TextField
          id="quantity"
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <br />
        <Autocomplete
        id="product-name"
        options={productSuggestions}
        getOptionLabel={getOptionLabel}
        value={productName}
        onChange={(e, newValue) => setProductName(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Product Name" />
        )}
      />
        <br />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>