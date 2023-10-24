const mongoose = require('mongoose');

/**
   * @remarks
     Lybrinth Model Schema
   *
*/
const labyrinthSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    structure: {
        type: Object,
        required: true,
    },
    start: {
        x: {
            type: Number,
        },
        y: {
            type: Number,
        },
    },
    end: {
        x: {
            type: Number,
        },
        y: {
            type: Number,
        },
    },
});

export default mongoose.model('Labyrinth', labyrinthSchema);
