"use client";

import { Provider } from "react-redux";
import { persistor, store } from "@/store";
import { ReactNode } from "react";
import { PersistGate } from "redux-persist/integration/react";
import Loading from "@/components/Loader";

interface ProviderProps {
  children: ReactNode;
}

export const ReduxProvider = ({ children }: ProviderProps) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
