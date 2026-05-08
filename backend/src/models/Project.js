const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    status: {
        type: String,
        enum: ["In Progress", "Completed"],
        default: "In Progress"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Project", projectSchema);