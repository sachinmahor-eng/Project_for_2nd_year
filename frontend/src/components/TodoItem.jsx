
function TodoItem({ todo, onEdit, onDelete, onToggle }) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3
            className={`text-lg font-semibold ${
              todo.completed
                ? "line-through text-gray-400"
                : "text-gray-800"
            }`}
          >
            {todo.title}
          </h3>

          <p className="text-gray-500 mt-2">
            {todo.description || "No description"}
          </p>

          <span
            className={`inline-block mt-3 text-sm px-3 py-1 rounded-full ${
              todo.completed
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {todo.completed ? "Completed" : "Pending"}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-5">
        <button
          onClick={() => onToggle(todo)}
          className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700"
        >
          {todo.completed ? "Mark Pending" : "Complete"}
        </button>

        <button
          onClick={() => onEdit(todo)}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(todo._id)}
          className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
