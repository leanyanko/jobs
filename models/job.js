var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var job = new Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  company: {
    type: String
  },
  date_posted: {
    type: Date
  },
  location: {
    type: String
  },
  department: {
    type: String
  },
  group: {
    type: String
  },
  website: {
    type: String
  }
});

module.exports = mongoose.model("job", job);
