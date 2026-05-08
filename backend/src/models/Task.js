const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(

  {

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    priority: {
      type: String,

      enum: [
        "low",
        "medium",
        "high"
      ],

      default: "medium"
    },

    status: {
      type: String,

      enum: [
        "todo",
        "in-progress",
        "done",
        "overdue"
      ],

      default: "todo"
    },

    dueDate: {
      type: Date,
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",

      required: true
    }

  },

  {
    timestamps: true
  }
);

module.exports =
  mongoose.model(
    "Task",
    taskSchema
  );