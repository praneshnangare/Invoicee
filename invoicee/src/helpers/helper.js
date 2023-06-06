export const capitalizeSentence = (sentence) => {
  // Split the sentence into an array of words
  const words = sentence.split(" ");

  // Capitalize the first letter of each word
  const capitalizedWords = words.map((word) => {
    // Capitalize the first letter of the word and make the rest lowercase
    const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    return capitalizedWord;
  });

  // Join the capitalized words back into a sentence
  const capitalizedSentence = capitalizedWords.join(" ");

  return capitalizedSentence;
}

export const numberToWords = (number) => {
  const unitsMap = [
    'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];

  const tensMap = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  const convertTwoDigit = (num) => {
    if (num < 20) {
      return unitsMap[num];
    } else {
      const tens = Math.floor(num / 10);
      const units = num % 10;
      return tensMap[tens] + (units !== 0 ? ' ' + unitsMap[units] : '');
    }
  };

  const convertThreeDigit = (num) => {
    const hundreds = Math.floor(num / 100);
    const twoDigit = num % 100;
    let result = '';
    if (hundreds !== 0) {
      result += unitsMap[hundreds] + ' Hundred';
      if (twoDigit !== 0) {
        result += ' and ';
      }
    }
    if (twoDigit !== 0) {
      result += convertTwoDigit(twoDigit);
    }
    return result;
  };

  if (number === 0) {
    return unitsMap[number];
  }

  const groups = [];
  while (number > 0) {
    groups.push(number % 1000);
    number = Math.floor(number / 1000);
  }

  const suffixes = ['', ' Thousand', ' Lakh', ' Crore'];
  let words = '';
  for (let i = groups.length - 1; i >= 0; i--) {
    const group = groups[i];
    if (group !== 0) {
      const groupWords = convertThreeDigit(group);
      words += groupWords + suffixes[i] + ' ';
    }
  }

  return words.trim();
};

export const createSheetPayload = (payload, sheetId) => {
  let totalAmount = 0;
  payload.products.map((product) => {
    totalAmount += Number(product.quantity) * Number(product.price);
  });

  const gstAmount = totalAmount * 0.09;
  const totalAmountWithGst = totalAmount + gstAmount * 2;
  const roundedTotalAmountWithGst = Math.round(totalAmountWithGst);
  const roundOff = (roundedTotalAmountWithGst - totalAmountWithGst).toFixed(
    2
  );
  const totalAmountInWords = 
    numberToWords(totalAmountWithGst, { currency: true })

  const productsList = payload.products.map((product, index) => {
    return [
      index + 1,
      product.name,
      product.hsn ?? "NA",
      product.quantity,
      product.price,
      product.quantity * product.price,
    ];
  });

  const products = payload.products; // Assuming you have an array of products

  const productListCells = products.map((product, index) => {
    const startRowIndex = 14 + index; // Adjust the startRowIndex based on the desired starting row for the products
    const endRowIndex = startRowIndex + 1;
    return {
      updateCells: {
        range: {
          sheetId: sheetId,
          startRowIndex,
          endRowIndex,
          startColumnIndex: 1,
          endColumnIndex: 10,
        },
        fields: "*",
        rows: [
          {
            values: [
              {
                userEnteredValue: {
                  stringValue: String(index + 1),
                },
                userEnteredFormat: {
                  borders: borderFormatting.bothVertical
                }
              },
              {
                userEnteredValue: {
                  stringValue: product.name,
                },
                userEnteredFormat: {
                  borders: borderFormatting.bothVertical
                }
              },
              {},
              {},
              {},
              {
                userEnteredValue: {
                  stringValue: product.hsn ?? "NA",
                },
                userEnteredFormat: {
                  borders: borderFormatting.bothVertical
                }
              },
              {
                userEnteredValue: {
                  stringValue: product.quantity,
                },
                userEnteredFormat: {
                  borders: borderFormatting.bothVertical
                }
              },
              {
                userEnteredValue: {
                  stringValue: product.price,
                },
                userEnteredFormat: {
                  borders: borderFormatting.bothVertical
                }
              },
              {
                userEnteredValue: {
                  numberValue: product.quantity * product.price,
                },
                userEnteredFormat: {
                  borders: borderFormatting.bothVertical
                }
              },
            ],
          },
        ],
      },
    };
  });

  return [
    {
      updateCells: {
        range: {
          sheetId: sheetId,
          startRowIndex: 8,
          endRowIndex: 9,
          startColumnIndex: 1,
          endColumnIndex: 2,
        },
        fields: "*",
        rows: [
          {
            values: [
              {
                userEnteredValue: {
                  stringValue: payload.customerName,
                },
                userEnteredFormat: {
                  borders: borderFormatting.left,
                },
              },
            ],
          },
        ],
      },
    },
    {
      updateCells: {
        range: {
          sheetId: sheetId,
          startRowIndex: 9,
          endRowIndex: 10,
          startColumnIndex: 1,
          endColumnIndex: 2,
        },
        fields: "*",
        rows: [
          {
            values: [
              {
                userEnteredValue: {
                  stringValue: payload.customerAddress,
                },
                userEnteredFormat: {
                  borders: borderFormatting.left,
                },
              },
            ],
          },
        ],
      },
    },
    {
      updateCells: {
        range: {
          sheetId: sheetId,
          startRowIndex: 11,
          endRowIndex: 12,
          startColumnIndex: 2,
          endColumnIndex: 3,
        },
        fields: "*",
        rows: [
          {
            values: [
              {
                userEnteredValue: {
                  stringValue: payload.customerGst,
                },
              },
            ],
          },
        ],
      },
    },
    {
      updateCells: {
        range: {
          sheetId: sheetId,
          startRowIndex: 12,
          endRowIndex: 13,
          startColumnIndex: 2,
          endColumnIndex: 3,
        },
        fields: "*",
        rows: [
          {
            values: [
              {
                userEnteredValue: {
                  stringValue: payload.customerState,
                },
                userEnteredFormat: {
                  borders: borderFormatting.bottom,
                },
              },
            ],
          },
        ],
      },
    },
    {
      updateCells: {
        range: {
          sheetId: sheetId,
          startRowIndex: 7,
          endRowIndex: 8,
          startColumnIndex: 7,
          endColumnIndex: 8,
        },
        fields: "*",
        rows: [
          {
            values: [
              {
                userEnteredValue: {
                  stringValue: String(payload.invoiceNumber),
                },
                userEnteredFormat: {
                  borders: borderFormatting.top,
                },
              },
            ],
          },
        ],
      },
    },
    {
      updateCells: {
        range: {
          sheetId: sheetId,
          startRowIndex: 8,
          endRowIndex: 9,
          startColumnIndex: 7,
          endColumnIndex: 8,
        },
        fields: "*",
        rows: [
          {
            values: [
              {
                userEnteredValue: {
                  stringValue: payload.invoiceDate,
                },
              },
            ],
          },
        ],
      },
    },
    {
      updateCells: {
        range: {
          sheetId: sheetId,
          startRowIndex: 24,
          endRowIndex: 25,
          startColumnIndex: 9,
          endColumnIndex: 10,
        },
        fields: "*",
        rows: [
          {
            values: [
              {
                userEnteredValue: {
                  stringValue: String(totalAmount),
                },
                userEnteredFormat: {
                  borders: borderFormatting.bothVertical,
                },
              },
            ],
          },
        ],
      },
    },
    {
      updateCells: {
        range: {
          sheetId: sheetId,
          startRowIndex: 25,
          endRowIndex: 26,
          startColumnIndex: 9,
          endColumnIndex: 10,
        },
        fields: "*",
        rows: [
          {
            values: [
              {
                userEnteredValue: {
                  stringValue: String(gstAmount),
                },
                userEnteredFormat: {
                  borders: borderFormatting.bothVertical,
                },
              },
            ],
          },
        ],
      },
    },
    {
      updateCells: {
        range: {
          sheetId: sheetId,
          startRowIndex: 26,
          endRowIndex: 27,
          startColumnIndex: 9,
          endColumnIndex: 10,
        },
        fields: "*",
        rows: [
          {
            values: [
              {
                userEnteredValue: {
                  stringValue: String(gstAmount),
                },
                userEnteredFormat: {
                  borders: borderFormatting.bothVertical,
                },
              },
            ],
          },
        ],
      },
    },
    {
      updateCells: {
        range: {
          sheetId: sheetId,
          startRowIndex: 27,
          endRowIndex: 28,
          startColumnIndex: 9,
          endColumnIndex: 10,
        },
        fields: "*",
        rows: [
          {
            values: [
              {
                userEnteredValue: {
                  stringValue: String(roundOff),
                },
                userEnteredFormat: {
                  borders: borderFormatting.bothVertical,
                },
              },
            ],
          },
        ],
      },
    },
    {
      updateCells: {
        range: {
          sheetId: sheetId,
          startRowIndex: 28,
          endRowIndex:29,
          startColumnIndex: 9,
          endColumnIndex: 10,
        },
        fields: "*",
        rows: [
          {
            values: [
              {
                userEnteredValue: {
                  stringValue: String(roundedTotalAmountWithGst),
                },
                userEnteredFormat: {
                  borders: borderFormatting.bothVertical,
                },
              },
            ],
          },
        ],
      },
    },
    {
      updateCells: {
        range: {
          sheetId: sheetId,
          startRowIndex: 31,
          endRowIndex: 32,
          startColumnIndex: 1,
          endColumnIndex: 2,
        },
        fields: "*",
        rows: [
          {
            values: [
              {
                userEnteredValue: {
                  stringValue: "INR " + String(totalAmountInWords) + " Only",
                },
                userEnteredFormat: {
                  borders: {
                    ...borderFormatting.bothHorizontal,
                    ...borderFormatting.left,
                  },
                },
              },
            ],
          },
        ],
      },
    },
    ...productListCells,
  ];
};