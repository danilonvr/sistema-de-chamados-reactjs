import './reset.css'
import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import AuthProvider from './contexts/user'
import {BrowserRouter} from 'react-router-dom'
import Routes from './routes'
function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
    <ToastContainer autoClose={3000} />
      <Routes/>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
