import { observer, useLocalObservable } from "mobx-react";
import { useStore } from "./store/store";
import { useCallback } from "react";

const Login = observer(() => {
    const { authStore } = useStore();

    const state = useLocalObservable(() => ({
        fields: {},
        setField: ({ target: { name, value } }) => {
            state.fields[name] = value.trim();
        },
    }));

    const handleSubmit = useCallback(
        (ev) => {
            ev.preventDefault();
            if (authStore.isLoading) return;
            authStore.login(state.fields.username, state.fields.password);
        },
        [authStore, state]
    );

    return (
        <form onSubmit={handleSubmit} className="myform">
            {!!authStore.loginError && <span>{authStore.loginError}</span>}
            <label htmlFor="username">Username:</label>
            <input
                type="text"
                name="username"
                onChange={state.setField}
                value={state.fields.username || ""}
                required
                autoComplete="new-password"
            />

            <label htmlFor="password">Password:</label>
            <input
                type="password"
                name="password"
                onChange={state.setField}
                value={state.fields.password || ""}
                required
                autoComplete="new-password"
            />
            <button>Login</button>
            <div>
                <input type="checkbox" name="persist" onChange={authStore.togglePersist} checked={authStore.persist} />
                <label htmlFor="persist">Keep me logged in</label>
            </div>
        </form>
    );
});

export default Login;
