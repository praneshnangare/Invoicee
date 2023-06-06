import {Route} from 'react-router-dom';
import InvoiceForm from '../features/createInvoice/InvoiceForm';
import LoginComponent from '../features/login/LoginComponent';

const Routes = () => {
  return (
    <>
      <Route path="/" element={<LoginComponent />}></Route>
      <Route path="/create-invoice" element={<InvoiceForm />}></Route>
    </>
  );
}

export default Routes;