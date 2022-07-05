import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";
import AuthStore from "./stores/AuthStore";
import ThemeStore from "./stores/ThemeStore";
import UsersStore from "./stores/UsersStore";

class Store {
    constructor() {
        makeAutoObservable(this);
        this.authStore = new AuthStore(this);
        this.themeStore = new ThemeStore(this);
        this.usersStore = new UsersStore(this);
    }
}

const store = new Store();

const StoreContext = createContext(store);
const useStore = () => useContext(StoreContext);

export { store, StoreContext, useStore };
