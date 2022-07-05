import { makeAutoObservable, runInAction } from "mobx";
import { axiosPrivate } from "../../api/axios";

class UsersStore {
    constructor(root) {
        makeAutoObservable(this);
        this.root = root;
    }

    users = [];
    isLoading = false;
    usersError = null;

    getUsers = async () => {
        runInAction(() => {
            this.users = [];
            this.isLoading = true;
        });

        try {
            const response = await axiosPrivate.get("/users");
            runInAction(() => (this.users = response.data));
        } catch (err) {
            console.error(err);
            runInAction(() => (this.usersError = err));
        } finally {
            runInAction(() => (this.isLoading = false));
        }
    };
}

export default UsersStore;
