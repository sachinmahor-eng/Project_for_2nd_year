const mongoose = require("mongoose");
const Todo = require("../models/Todo");

// POST /api/todos
exports.createTodo = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Todo title is required"
      });
    }

    if (
      description !== undefined &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        message: "Description must be a string"
      });
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description?.trim() || "",
      user: req.user.id
    });

    return res.status(201).json({
      message: "Todo created successfully",
      todo
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/todos
exports.getTodos = async (req, res, next) => {
  try {
    const filter = {
      user: req.user.id
    };

    if (req.query.completed !== undefined) {
      if (!["true", "false"].includes(req.query.completed)) {
        return res.status(400).json({
          message: "completed must be true or false"
        });
      }

      filter.completed = req.query.completed === "true";
    }

    const todos = await Todo.find(filter).sort({
      createdAt: -1
    });

    return res.status(200).json({
      count: todos.length,
      todos
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/todos/:id
exports.getTodoById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid todo ID"
      });
    }

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found"
      });
    }

    return res.status(200).json({ todo });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/todos/:id
exports.updateTodo = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid todo ID"
      });
    }

    const allowedFields = [
      "title",
      "description",
      "completed"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Provide at least one valid field to update"
      });
    }

    if (
      updates.title !== undefined &&
      (typeof updates.title !== "string" ||
        !updates.title.trim())
    ) {
      return res.status(400).json({
        message: "Title must be a non-empty string"
      });
    }

    if (
      updates.description !== undefined &&
      typeof updates.description !== "string"
    ) {
      return res.status(400).json({
        message: "Description must be a string"
      });
    }

    if (
      updates.completed !== undefined &&
      typeof updates.completed !== "boolean"
    ) {
      return res.status(400).json({
        message: "Completed must be a boolean"
      });
    }

    if (updates.title !== undefined) {
      updates.title = updates.title.trim();
    }

    if (updates.description !== undefined) {
      updates.description = updates.description.trim();
    }

    const todo = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      {
        $set: updates
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found"
      });
    }

    return res.status(200).json({
      message: "Todo updated successfully",
      todo
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/todos/:id
exports.deleteTodo = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid todo ID"
      });
    }

    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found"
      });
    }

    return res.status(200).json({
      message: "Todo deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};