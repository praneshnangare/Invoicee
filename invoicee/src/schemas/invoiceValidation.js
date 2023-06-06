import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  invoiceDate: Yup.date().required('Invoice Date is required'),
  invoiceNumber: Yup.string().required('Invoice Number is required'),
  selectedCustomer: Yup.object().shape({
    name: Yup.string().required('Customer Name is required'),
    address: Yup.string().required('Customer Address is required'),
    gstNumber: Yup.string().required('Customer GST Number is required'),
    state: Yup.string().required('Customer State is required'),
  }),
  products: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Product Name is required'),
      quantity: Yup.number().required('Quantity is required').positive('Quantity must be a positive number'),
      price: Yup.number().required('Price is required').positive('Price must be a positive number'),
    })
  ).min(1, 'At least one product is required'),
});

export default validationSchema;
