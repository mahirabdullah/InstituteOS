const Notice = require('../models/noticeModel');

// @desc    Get all notices
// @route   GET /api/notices
// @access  Private/Admin
const getNotices = async (req, res) => {
    const notices = await Notice.find({}).sort({ createdAt: -1 });
    res.json(notices);
};

// @desc    Create a notice
// @route   POST /api/notices
// @access  Private/Admin
const createNotice = async (req, res) => {
    const { title, content } = req.body;
    const notice = new Notice({
        title,
        content,
        postedBy: req.admin._id,
    });
    const createdNotice = await notice.save();
    res.status(201).json(createdNotice);
};

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin
const deleteNotice = async (req, res) => {
    const notice = await Notice.findById(req.params.id);
    if(notice) {
        await notice.deleteOne();
        res.json({ message: 'Notice removed' });
    } else {
        res.status(404).json({ message: 'Notice not found' });
    }
};

module.exports = { getNotices, createNotice, deleteNotice };