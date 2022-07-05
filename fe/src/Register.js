import { observer, useLocalObservable } from "mobx-react";
import { useStore } from "./store/store";
import { useCallback } from "react";

const Register = observer(() => {
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
            authStore.register(state.fields.username, state.fields.password);
        },
        [authStore, state]
    );

    return (
        <form onSubmit={handleSubmit} className="myform">
            {!!authStore.registerError && <span>{authStore.registerError}</span>}
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
            <button>Register</button>
        </form>
    );
});

export default Register;
