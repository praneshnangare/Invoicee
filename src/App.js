import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { google } from 'googleapis';
import localforage from 'localforage';
import Select from 'react-select';

const CLIENT_ID = '106800480963-2brh49tiunu5shtuac8u3ojavj96qjcq.apps.googleusercontent.com';
const API_KEY = 'AIzaSyASjytXBD7oy-7P-6h4vS37rTyOIFEtMTo';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';
const SPREADSHEET_ID = '14zYQVENvbZxfaLFHrFjebrI6CEioJGY0lDygr5yXl80';

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load customer data from local storage
        const storedCustomers = await localforage.getItem('customers');
        if (storedCustomers) {
          setCustomers(storedCustomers);
        } else {
          // Fetch customer data from Google Sheets API
          const auth = await getAuthClient();
          const customerData = await fetchCustomerData(auth);
          setCustomers(customerData);
          // Store customer data in local storage
          localforage.setItem('customers', customerData);
        }
      } catch (error) {
        console.log('Error fetching customer data:', error);
      }
    };

    fetchData();
  }, []);

  const getAuthClient = async () => {
    const authClient = new google.auth.OAuth2(CLIENT_ID, API_KEY);
    const token = await localforage.getItem('authToken');
    if (token) {
      authClient.setCredentials(token);
    } else {
      const authUrl = authClient.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      });
      const code = window.prompt('Authorization required. Enter the code from the authorization page:');
      const { tokens } = await authClient.getToken(code);
      authClient.setCredentials(tokens);
      localforage.setItem('authToken', tokens);
    }
    return authClient;
  };

  const fetchCustomerData = async (auth) => {
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Customers!A2:B',
    });
    const rows = response.data.values;
    console.log(rows.length)
    console.log(rows);
    if (rows.length) {
      const customerData = rows.map((row) => ({
        label: row[0],
        value: row[1],
      }));
      return customerData;
    }
    return [];
  };

  const handleCustomerChange = (selectedOption) => {
    setSelectedCustomer(selectedOption);
  };

  const handleCreateInvoice = async () => {
    if (selectedCustomer) {
      try {
        // Create a new sheet for the selected customer using Google Sheets API
        const auth = await getAuthClient();
        const sheets = google.sheets({ version: 'v4', auth });
        const title = `Invoice - ${selectedCustomer.label}`;
        const newSheet = await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title,
                  },
                },
              },
            ],
          },
        });

        const sheetId = newSheet.data.replies[0].addSheet.properties.sheetId;

        // Download the newly created sheet as a PDF
        const downloadLink = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?exportFormat=pdf&gid=${sheetId}`;

        // Provide the download link to the user
        window.open(downloadLink, '_blank');
      } catch (error) {
        console.log('Error creating invoice:', error);
      }
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

export default App;
