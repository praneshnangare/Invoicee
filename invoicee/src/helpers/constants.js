export const CLIENT_ID =
  "106800480963-2brh49tiunu5shtuac8u3ojavj96qjcq.apps.googleusercontent.com";
export const API_KEY = "AIzaSyASjytXBD7oy-7P-6h4vS37rTyOIFEtMTo";
export const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
export const SPREADSHEET_ID = "14zYQVENvbZxfaLFHrFjebrI6CEioJGY0lDygr5yXl80";
export const DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
];
export const SCOPE = "https://www.googleapis.com/auth/spreadsheets";
export const PLUGIN_NAME = "invoicee";
export const INVOICE_TEMPLATE_ID = "1653630901";
export const RANGES = {
  CUSTOMERS: "Customers!A5:E",
  PRODUCTS: "Products!B5:B",
  CUSTOMER_NAME: "Invoice!B9",
  CUSTOMER_ADDRESS: "Invoice!B10",
  CUSTOMER_GST: "Invoice!C13",
  CUSTOMER_STATE: "Invoice!C14",
  INVOICE_NUMBER: "Invoice!H8",
  INVOICE_DATE: "Invoice!H9",
  PRODUCTS_LIST: "Invoice!B16:J",
  CURRENT_INVOICE_NUMBER: "Customers!H4",
};

export const borderStyle = {
  style: "SOLID",
  width: 1,
  color: {
    red: 0,
    green: 0,
    blue: 0,
  },
};

export const borderFormatting = {
  bothVertical: {
    left: borderStyle,
    right: borderStyle,
  },
  bothHorizontal: {
    top: borderStyle,
    bottom: borderStyle,
  },
  allSides: {
    top: borderStyle,
    bottom: borderStyle,
    left: borderStyle,
    right: borderStyle,
  },
  top: {
    top : borderStyle,
  },
  left: {
    left: borderStyle,
  },
  right: {
    right: borderStyle,
  },
  bottom: {
    bottom: borderStyle,
  },
};
