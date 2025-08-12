const mongoose = require('mongoose');

const noticeSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Admin' },
  },
  {
    timestamps: true,
  }
);

const Notice = mongoose.model('Notice', noticeSchema);
module.exports = Notice;