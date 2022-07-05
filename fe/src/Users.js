import { observer } from "mobx-react";
import { useStore } from "./store/store";
import { useEffect } from "react";

const Users = observer(() => {
    const { authStore, usersStore } = useStore();

    useEffect(() => {
        if (authStore.auth && !authStore.isLoading && !usersStore.isLoading) {
            usersStore.getUsers();
        }
    }, [authStore, usersStore]);

    if (!authStore.auth) {
        if (authStore.isLoading) return null;
        else return <span>No permission</span>;
    }

    return (
        <>
            {usersStore.isLoading && <span>Users loading...</span>}
            {!!usersStore.usersError && <span>{usersStore.usersError}</span>}
            {usersStore.users?.length ? (
                <ul>
                    {usersStore.users.map((user, i) => (
                        <li key={i}>{user?.username}</li>
                    ))}
                </ul>
            ) : (
                <p>No users to display</p>
            )}
        </>
    );
});

export default Users;
