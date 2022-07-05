import "./App.css";
import { observer } from "mobx-react";
import { useStore } from "./store/store";
import Login from "./Login";
import Register from "./Register";
import ThemeSelector from "./ThemeSelector";
import Users from "./Users";

const App = observer(() => {
    const { authStore } = useStore();

    return (
        <div className="App">
            <ThemeSelector />
            {!authStore.auth ? (
                <>
                    <Login />
                    <Register />
                </>
            ) : (
                <>
                    <button onClick={authStore.logout}>Logout</button>
                    <Users />
                </>
            )}
        </div>
    );
});

export default App;
