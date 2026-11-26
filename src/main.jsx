import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "./components/ui/sonner.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

const persistor = persistStore(store);

const PersistLoadingFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans">
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
        H
      </div>
      <span className="text-2xl font-bold tracking-tight text-gray-900">
        Hire<span className="text-blue-600">HoriZon</span>
      </span>
    </div>
    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
      <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      <span>Starting workspace...</span>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<PersistLoadingFallback />} persistor={persistor}>
        <App />
        <Toaster />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
