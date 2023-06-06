export const createSpreadsheet = async (name) => {
  // Create a copy of the invoice template
  const createResponse = await window.gapi.client.sheets.spreadsheets.create({
    resource: {
      properties: {
        title: name,
      },
    },
  });
  return createResponse;
};

export const copySheet = async (
  destinationSpreadsheetId,
  sourceSpreadsheetId,
  sheetId
) => {
  const response = await window.gapi.client.sheets.spreadsheets.sheets.copyTo({
    spreadsheetId: sourceSpreadsheetId,
    sheetId: sheetId,
    resource: {
      destinationSpreadsheetId: destinationSpreadsheetId,
    },
  });
  return response;
};

export const batchUpdate = async (spreadsheetId, data) => {
  const response = await window.gapi.client.sheets.spreadsheets
    .batchUpdate({
      spreadsheetId: spreadsheetId,
      resource: {
        requests: data,
      },
    })
    .then((response) => {
      console.log("Batch update successful");
     
    })
    .catch((error) => {
      console.error("Error performing batch update: ", error);
    });
    return response;
};

export const downloadSheet = async (spreadsheetId, sheetId) => {
  const downloadLink = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?exportFormat=pdf&gid=${sheetId}`;
  window.open(downloadLink, "_blank");
}

export const getBorders = async (spreadsheetId ,sheetId, data) => {
  // Get the existing borders of the copied sheet
  const getBordersRequest = {
    spreadsheetId: spreadsheetId,
    ranges: ['Invoice!A1:K50'],
    fields: 'sheets.data.rowData.values.effectiveFormat.borders',
  };
  console.log("in the function -> " + data)
  await window.gapi.client.sheets.spreadsheets.get(getBordersRequest).then((response, ) => {
    const borders = response.result.sheets[0].data[0].rowData[0].values[0].effectiveFormat.borders;
    
    // Include the existing borders in the requests array
    data.push({
      updateBorders: {
        range: {
          sheetId: sheetId,
          startRowIndex: 0,
          endRowIndex: data.length,
          startColumnIndex: 0,
          endColumnIndex: data[0].length,
        },
        top: borders.top,
        bottom: borders.bottom,
        left: borders.left,
        right: borders.right,
        innerHorizontal: borders.innerHorizontal,
        innerVertical: borders.innerVertical,
      },
    });
  });
  return data;

}



export const deleteSpreadsheetByName = async (spreadsheetName) => {
  // Retrieve a list of spreadsheets
  const response = await window.gapi.client.sheets.spreadsheets.list();
  const spreadsheets = response.result.files;

  // Find the spreadsheet by its name
  const spreadsheet = spreadsheets.find((sheet) => sheet.name === spreadsheetName);
  console.log(spreadsheet);
  if (spreadsheet) {
    const spreadsheetId = spreadsheet.id;

    // Create the delete request
    const deleteRequest = {
      spreadsheetId: spreadsheetId,
      resource: {
        requests: [
          {
            deleteSheet: {
              sheetId: 0, // Delete the first sheet (assuming it's the only sheet)
            },
          },
        ],
      },
    };

    try {
      // Send the delete request to delete the spreadsheet
      // await window.gapi.client.sheets.spreadsheets.batchUpdate(deleteRequest);

      console.log(`Spreadsheet "${spreadsheetName}" has been deleted.`);
    } catch (error) {
      console.error('Error deleting the spreadsheet:', error);
    }
  } else {
    console.log(`Spreadsheet "${spreadsheetName}" not found.`);
  }
};
