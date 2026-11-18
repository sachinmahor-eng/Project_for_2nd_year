
import { useEffect, useState } from "react";

function TodoForm({ onSubmit, editingTodo, cancelEdit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (editingTodo) {
      setFormData({
        title: editingTodo.title,
        description: editingTodo.description || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
      });
    }
  }, [editingTodo]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    onSubmit(formData);

    setFormData({
      title: "",
      description: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-sm border space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        {editingTodo ? "Update Todo" : "Create New Todo"}
      </h2>

      <input
        type="text"
        name="title"
        placeholder="Enter todo title"
        value={formData.title}
        onChange={handleChange}
        required
        className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        name="description"
        placeholder="Enter description"
        value={formData.description}
        onChange={handleChange}
        rows="3"
        className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          {editingTodo ? "Update Todo" : "Add Todo"}
        </button>

        {editingTodo && (
          <button
            type="button"
            onClick={cancelEdit}
            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TodoForm;
