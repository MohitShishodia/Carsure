// API service for communicating with the backend
const API_BASE_URL = 'https://carsure.onrender.com/api';

// Evaluation CRUD operations
export const evaluationsApi = {
  // Get all evaluations
  async getAll(page = 1, limit = 20) {
    const response = await fetch(`${API_BASE_URL}/evaluations?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch evaluations');
    return response.json();
  },

  // Get single evaluation by ID
  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/evaluations/${id}`);
    if (!response.ok) throw new Error('Failed to fetch evaluation');
    return response.json();
  },

  // Create new evaluation
  async create(data) {
    const response = await fetch(`${API_BASE_URL}/evaluations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create evaluation');
    return response.json();
  },

  // Update evaluation
  async update(id, data) {
    const response = await fetch(`${API_BASE_URL}/evaluations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update evaluation');
    return response.json();
  },

  // Delete evaluation
  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/evaluations/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete evaluation');
    return response.json();
  }
};

// Image upload operations
export const uploadApi = {
  // Upload single image
  async uploadImage(file, evaluationId, slotId) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('evaluationId', evaluationId || 'temp');
    formData.append('slotId', slotId);

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Failed to upload image');
    return response.json();
  },

  // Upload multiple images
  async uploadImages(files, slotIds, evaluationId) {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    formData.append('slotIds', JSON.stringify(slotIds));
    formData.append('evaluationId', evaluationId || 'temp');

    const response = await fetch(`${API_BASE_URL}/upload/images`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Failed to upload images');
    return response.json();
  },

  // Delete image
  async deleteImage(path) {
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path })
    });
    if (!response.ok) throw new Error('Failed to delete image');
    return response.json();
  },

  // Convert base64 to File object
  base64ToFile(base64, filename) {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
};

export default { evaluationsApi, uploadApi };
