export default function UsersTable({ users, onEdit, onDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user.id_user}>
            <td>{user.id_user}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>

            <td className="actions">
              <button className="edit" onClick={() => onEdit(user)}>
                Editar
              </button>

              <button className="delete" onClick={() => onDelete(user.id_user)}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
