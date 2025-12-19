const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Get all evaluations (with pagination)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('evaluations')
      .select('id, evaluation_id, data, created_at, updated_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Extract key info for list display
    const evaluations = data.map(item => ({
      id: item.id,
      evaluation_id: item.evaluation_id,
      brand: item.data?.brand || '',
      model: item.data?.model || '',
      registration_no: item.data?.registration_no || '',
      inspection_date: item.data?.evaluation_date || '',
      created_at: item.created_at,
      updated_at: item.updated_at
    }));

    res.json({
      evaluations,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    res.status(500).json({ error: 'Failed to fetch evaluations', details: error.message });
  }
});

// Get single evaluation by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching evaluation:', error);
    res.status(500).json({ error: 'Failed to fetch evaluation', details: error.message });
  }
});

// Create new evaluation
router.post('/', async (req, res) => {
  try {
    const { evaluation_id, data, images } = req.body;

    const { data: created, error } = await supabase
      .from('evaluations')
      .insert([{
        evaluation_id: evaluation_id || `EVL-${Date.now()}`,
        data,
        images: images || {}
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating evaluation:', error);
    res.status(500).json({ error: 'Failed to create evaluation', details: error.message });
  }
});

// Update evaluation
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, images } = req.body;

    const { data: updated, error } = await supabase
      .from('evaluations')
      .update({
        data,
        images: images || {},
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!updated) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating evaluation:', error);
    res.status(500).json({ error: 'Failed to update evaluation', details: error.message });
  }
});

// Delete evaluation
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // First, get the evaluation to find associated images
    const { data: evaluation } = await supabase
      .from('evaluations')
      .select('images')
      .eq('id', id)
      .single();

    // Delete images from storage if they exist
    if (evaluation && evaluation.images) {
      const imagePaths = Object.values(evaluation.images)
        .filter(url => url && typeof url === 'string')
        .map(url => {
          // Extract path from Supabase URL
          const match = url.match(/evaluation-images\/(.+)/);
          return match ? match[1] : null;
        })
        .filter(Boolean);

      if (imagePaths.length > 0) {
        await supabase.storage.from('evaluation-images').remove(imagePaths);
      }
    }

    // Delete the evaluation record
    const { error } = await supabase
      .from('evaluations')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Evaluation deleted successfully' });
  } catch (error) {
    console.error('Error deleting evaluation:', error);
    res.status(500).json({ error: 'Failed to delete evaluation', details: error.message });
  }
});

module.exports = router;
