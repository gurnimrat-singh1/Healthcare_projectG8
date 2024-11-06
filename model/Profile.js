const mongoose = require("mongoose");

const ProfieSchema = new mongoose.Schema({
    image: {
        type: String
    },
});

const Profie = mongoose.model("Profie", ProfieSchema);

module.exports = Profie;