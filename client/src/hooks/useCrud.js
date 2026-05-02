import { useState, useEffect, useCallback } from 'react';

export const useCrud = (service) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    // Only set loading if it's not already true to avoid redundant renders in useEffect
    setLoading(prev => prev ? prev : true);
    try {
      const response = await service.getAll();
      setData(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    queueMicrotask(() => {
      fetchAll();
    });
  }, [fetchAll]);

  const createItem = async (payload) => {
    try {
      await service.create(payload);
      await fetchAll();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to create item.' };
    }
  };

  const updateItem = async (id, payload) => {
    try {
      await service.update(id, payload);
      await fetchAll();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to update item.' };
    }
  };

  const deleteItem = async (id) => {
    try {
      await service.delete(id);
      await fetchAll();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to delete item.' };
    }
  };

  return { 
    data, 
    loading, 
    error, 
    setError, 
    createItem, 
    updateItem, 
    deleteItem, 
    refresh: fetchAll 
  };
};
