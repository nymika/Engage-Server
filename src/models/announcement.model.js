const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
    asg_code: {type: String},
    date: {type: Date},
    desc: {type: String}
});

module.exports =  mongoose.model('Announcement', AnnouncementSchema);