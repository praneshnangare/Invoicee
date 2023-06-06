import { useEffect } from "react";
import {
  SPREADSHEET_ID,
  RANGES,
  INVOICE_TEMPLATE_ID,
  createSheetPayload,
} from "../../helpers/constants.js";
import { useNavigate } from "react-router-dom";
import {
  batchUpdate,
  copySheet,
  createSpreadsheet,
  deleteSpreadsheetByName,
  downloadSheet,
  getBorders,
} from "./sheetsFunctions.js";

const useSheets = () => {
  const navigate = useNavigate();
  let newSpreadsheetId;
  useEffect(() => {
    if (!window.gapi.client) {
      navigate("/");
    }
  });
  const updateSheet = async (payload) => {
    // Update the values in the Google Sheet
    const range = RANGES.CUSTOMERS;
    createCopyInvoiceTemplate(payload);
    const response = await window.gapi.client.sheets.spreadsheets.values.update(
      {
        copySpreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        resource: {
          values,
        },
      }
    );
    console.log(response);
    console.log(`${response.result.updatedCells} cells updated.`);
  };

  const createInvoice = async (payload) => {
    // Update the values in the Google Sheet
    const copyResponse = createCopyInvoiceTemplate(payload);
  };

  const fetchCustomers = (updateValues) => {
    deleteSpreadsheetByName("New sheet");

    window.gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGES.CUSTOMERS,
      })
      .then((response) => {
        const values = response.result.values;
        const customersList = values.map((customer) => {
          return {
            id: customer[0],
            name: customer[1],
            address: customer[2],
            gstNumber: customer[3],
            state: customer[4],
          };
        });
        updateValues(customersList);
      })
      .catch((error) => {
        console.log("Error retrieving spreadsheet values:", error);
      });
  };

  const fetchProducts = (updateValues) => {
    window.gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGES.PRODUCTS,
      })
      .then((response) => {
        const values = response.result.values;
        const productsList = values.map((product) => {
          return {
            label: product[0],
          };
        });
        updateValues(productsList);
      })
      .catch((error) => {
        console.log("Error retrieving spreadsheet values:", error);
      });
  };

  const fetchInvoiceNumber = (updateValues) => {
    window.gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGES.CURRENT_INVOICE_NUMBER,
      })
      .then((response) => {
        const values = response.result.values;
        const invoiceNumber = values[0][0];
        updateValues(Number(invoiceNumber) + 1);
      })
      .catch((error) => {
        console.log("Error retrieving spreadsheet values:", error);
      });
  };

  const createCopyInvoiceTemplate = async (payload) => {
    const createResponse = await createSpreadsheet("New sheet");
    newSpreadsheetId = createResponse.result.spreadsheetId;
    const copiedSheetResponse = await copySheet(
      newSpreadsheetId,
      SPREADSHEET_ID,
      INVOICE_TEMPLATE_ID
    );
    var data = createSheetPayload(
      payload,
      copiedSheetResponse.result.sheetId
    );
    const updateResponse = await batchUpdate(newSpreadsheetId, data);
    downloadSheet(newSpreadsheetId, copiedSheetResponse.result.sheetId);
    return createResponse;
  };

  return {
    updateSheet,
    fetchCustomers,
    fetchProducts,
    fetchInvoiceNumber,
    createInvoice,
  };
};

export default useSheets;
