"use client"

import { store } from "@/state/store";
import React from "react";
import { Provider } from "react-redux";
import persistStore from "redux-persist/es/persistStore";
import { PersistGate } from "redux-persist/integration/react";

let persistor = persistStore(store);

export function UserProvider({children} : {children : React.ReactNode}) {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}