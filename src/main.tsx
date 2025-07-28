import "antd-mobile/es/global";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "@/routes";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>,
);
