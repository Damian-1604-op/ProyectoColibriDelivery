import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api/users";

import UserForm from "../components/UserForm";
import UsersTable from "../components/UsersTable";

import "./users.css";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const loadUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (data) => {
    if (editingUser) {
      await updateUser(editingUser.id_user, data);
      setEditingUser(null);
    } else {
      await createUser(data);
    }

    loadUsers();
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar usuario?")) {
      await deleteUser(id);
      loadUsers();
    }
  };

  return (
    <div className="container">
      <h1>Panel de Usuarios </h1>

      <UserForm onSubmit={handleSubmit} editingUser={editingUser} />

      <UsersTable
        users={users}
        onEdit={setEditingUser}
        onDelete={handleDelete}
      />
    </div>
  );
}
