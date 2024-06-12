const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,   //defining an objectId but but references to another model/schema
        ref: 'Client',  //should correspond to the Client model
    },
});

module.exports = mongoose.model('Project', ProjectSchema);