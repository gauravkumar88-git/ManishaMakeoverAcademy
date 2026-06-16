const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { Blog } = require('../models/index');
const { uploadImage } = require('../config/cloudinary');

router.get('/', async (req, res) => {
  const blogs = await Blog.find({ published: true }).populate('author', 'name avatar').sort({ createdAt: -1 });
  res.json({ success: true, blogs });
});

router.get('/:slug', async (req, res) => {
  const blog = await Blog.findOneAndUpdate({ slug: req.params.slug, published: true }, { $inc: { views: 1 } }, { new: true }).populate('author', 'name avatar');
  if (!blog) return res.status(404).json({ success: false, message: 'Blog not found.' });
  res.json({ success: true, blog });
});

router.post('/', protect, adminOnly, uploadImage.single('coverImage'), async (req, res) => {
  const { title, content, excerpt, tags, category, published } = req.body;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const blog = await Blog.create({
    title, slug, content, excerpt, tags: tags ? JSON.parse(tags) : [],
    category, published: published === 'true',
    coverImage: req.file ? req.file.path : '',
    author: req.user._id,
  });
  res.status(201).json({ success: true, blog });
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, blog });
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Blog deleted.' });
});

module.exports = router;
