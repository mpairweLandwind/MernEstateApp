import React from 'react'; // Make sure to import React
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { persistor, store } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import '../i18n';
import { SocketContextProvider } from './context/SocketContext.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
 <React.StrictMode> {/* Wrap your application with StrictMode */}
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>     
       <SocketContextProvider>
        <App />
         </SocketContextProvider>           
      </PersistGate>
    </Provider>
 </React.StrictMode>
);
