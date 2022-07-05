import { makeAutoObservable, runInAction } from "mobx";
import axios, { axiosPrivate, axiosInterceptors } from "../../api/axios";

class AuthStore {
    constructor(root) {
        makeAutoObservable(this);
        this.root = root;

        if (this.persist) {
            this.refreshToken();
        } else {
            runInAction(() => (this.isLoading = false));
        }

        axiosPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await this.refreshToken();
                    prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );
    }

    isLoading = true;
    auth = null;
    persist = JSON.parse(localStorage.getItem("persist")) || false;
    registerError = false;
    loginError = false;

    register = async (user, pwd) => {
        try {
            runInAction(() => (this.isLoading = true));
            //const response =
            await axios.post("/register", JSON.stringify({ user, pwd }), {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            runInAction(() => (this.registerError = false));
            this.login(user, pwd);
        } catch (err) {
            runInAction(() => {
                if (!err?.response) {
                    this.registerError = "No Server Response";
                } else if (err.response?.status === 409) {
                    this.registerError = "Username Taken";
                } else {
                    this.registerError = "Registration Failed";
                }
                this.isLoading = false;
            });
        }
    };

    login = async (user, pwd) => {
        try {
            runInAction(() => (this.isLoading = true));
            const response = await axios.post("/auth", JSON.stringify({ user, pwd }), {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            const roles = response?.data?.roles;
            const accessToken = response?.data?.accessToken;

            runInAction(() => {
                this.loginError = false;
                this.auth = { user, roles, accessToken };
                this.isLoading = false;
            });

            this._addAccessTokenInterceptor();
        } catch (err) {
            runInAction(() => {
                if (!err?.response) {
                    this.loginError = "No Server Response";
                } else if (err.response?.status === 400) {
                    this.loginError = "Missing Username or Password";
                } else if (err.response?.status === 401) {
                    this.loginError = "Wrong Credentials!";
                } else {
                    this.loginError = "Login Failed";
                }
                this.isLoading = false;
            });
        }
    };

    logout = async () => {
        try {
            //const response =
            await axios("/logout", { withCredentials: true });
            runInAction(() => (this.auth = null));
        } catch (err) {
            console.error(err);
        }
    };

    togglePersist = () => {
        const persist = !this.persist;
        runInAction(() => (this.persist = persist));
        localStorage.setItem("persist", persist);
    };

    refreshToken = async () => {
        let newAccessToken = null;
        let isLoggedInRefresh = !!this.auth;

        try {
            if (!isLoggedInRefresh) {
                runInAction(() => (this.isLoading = true));
            }

            const response = await axios.get("/refresh", { withCredentials: true });
            const { roles, accessToken, username: user } = response?.data || {};
            newAccessToken = accessToken;

            runInAction(() => (this.auth = { user, accessToken, roles }));

            this._addAccessTokenInterceptor();
        } catch (err) {
            runInAction(() => (this.auth = null));
        } finally {
            if (!isLoggedInRefresh) {
                runInAction(() => (this.isLoading = false));
            }
        }

        return newAccessToken;
    };

    _addAccessTokenInterceptor = () => {
        if (axiosInterceptors.requestIntercept) {
            axiosPrivate.interceptors.request.eject(axiosInterceptors.requestIntercept);
        }

        axiosInterceptors.requestIntercept = axiosPrivate.interceptors.request.use(
            (config) => {
                if (!config.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${this.auth?.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    };
}

export default AuthStore;
