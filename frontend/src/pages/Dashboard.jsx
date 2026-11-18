
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";

function Dashboard() {
  const { token } = useAuth();

  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTodos = async () => {
    try {
      setError("");

      const query =
        filter === "all" ? "" : `?completed=${filter === "completed"}`;

      const data = await api(`/todos${query}`, {}, token);

      setTodos(data.todos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [filter, token]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      setError("");

      if (editingTodo) {
        await api(
          `/todos/${editingTodo._id}`,
          {
            method: "PATCH",
            body: JSON.stringify(formData),
          },
          token
        );

        setEditingTodo(null);
      } else {
        await api(
          "/todos",
          {
            method: "POST",
            body: JSON.stringify(formData),
          },
          token
        );
      }

      await loadTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this todo?"
    );

    if (!confirmed) return;

    try {
      await api(
        `/todos/${id}`,
        { method: "DELETE" },
        token
      );

      await loadTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (todo) => {
    try {
      await api(
        `/todos/${todo._id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            completed: !todo.completed,
          }),
        },
        token
      );

      await loadTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const pendingCount = todos.filter(
    (todo) => !todo.completed
  ).length;

  const completedCount = todos.filter(
    (todo) => todo.completed
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            My Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Organize your tasks and stay productive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-gray-500">Total Todos</p>
            <h2 className="text-3xl font-bold mt-2">
              {todos.length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-gray-500">Pending</p>
            <h2 className="text-3xl font-bold text-yellow-600 mt-2">
              {pendingCount}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-gray-500">Completed</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {completedCount}
            </h2>
          </div>
        </div>

        <div className="mb-8">
          <TodoForm
            onSubmit={handleCreateOrUpdate}
            editingTodo={editingTodo}
            cancelEdit={() => setEditingTodo(null)}
          />
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
          <h2 className="text-2xl font-bold text-gray-800">
            My Todos
          </h2>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 bg-white rounded-lg px-4 py-2 outline-none"
          >
            <option value="all">All Todos</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-gray-500">Loading todos...</p>
        ) : todos.length === 0 ? (
          <div className="bg-white p-10 rounded-xl text-center">
            <h3 className="text-xl font-semibold text-gray-700">
              No todos found
            </h3>
            <p className="text-gray-500 mt-2">
              Create your first todo to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
