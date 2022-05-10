const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({

    title: { type: String, required: true },
    description: { type: String},
    date: { type: Date},
    modality: { type: String},
    category: { type: String},
    sponsors: { type: String},
    participant_number: { type: Number},
    fee_participation: { type: Number },
    program: { type: String},
    eventImage:{type: String },

    
    
},
 {
    timestamps: true,
}

);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;