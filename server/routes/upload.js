const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../supabase');

// Configure multer for memory storage (we'll upload to Supabase)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Upload single image
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { evaluationId, slotId } = req.body;
    const file = req.file;
    
    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.originalname.split('.').pop();
    const filename = `${evaluationId || 'temp'}/${slotId || 'image'}_${timestamp}.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('evaluation-images')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('evaluation-images')
      .getPublicUrl(filename);

    res.json({
      success: true,
      url: urlData.publicUrl,
      path: filename
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image', details: error.message });
  }
});

// Upload multiple images
router.post('/images', upload.array('images', 30), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files provided' });
    }

    const { evaluationId } = req.body;
    const slotIds = JSON.parse(req.body.slotIds || '[]');
    const uploadedImages = {};

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const slotId = slotIds[i] || `image_${i}`;
      
      const timestamp = Date.now();
      const ext = file.originalname.split('.').pop();
      const filename = `${evaluationId || 'temp'}/${slotId}_${timestamp}.${ext}`;

      const { data, error } = await supabase.storage
        .from('evaluation-images')
        .upload(filename, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (error) {
        console.error(`Error uploading ${slotId}:`, error);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('evaluation-images')
        .getPublicUrl(filename);

      uploadedImages[slotId] = urlData.publicUrl;
    }

    res.json({
      success: true,
      images: uploadedImages
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: 'Failed to upload images', details: error.message });
  }
});

// Delete image
router.delete('/image', async (req, res) => {
  try {
    const { path } = req.body;

    if (!path) {
      return res.status(400).json({ error: 'Image path is required' });
    }

    const { error } = await supabase.storage
      .from('evaluation-images')
      .remove([path]);

    if (error) throw error;

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image', details: error.message });
  }
});

module.exports = router;
