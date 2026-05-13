import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

// --- Stagiaires ---
export const useStagiaires = (filters = {}) => {
  return useQuery({
    queryKey: ['stagiaires', filters],
    queryFn: async () => {
      const { data } = await api.get('/stagiaires', { params: filters });
      return data;
    },
  });
};

export const useStagiaire = (id) => {
  return useQuery({
    queryKey: ['stagiaire', id],
    queryFn: async () => {
      const { data } = await api.get(`/stagiaires/${id}`);
      return data.data; // resource is wrapped in data
    },
    enabled: !!id,
  });
};

export const useCreateStagiaire = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newStagiaire) => {
      const { data } = await api.post('/stagiaires', newStagiaire);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stagiaires'] });
    },
  });
};

export const useUpdateStagiaire = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data } = await api.put(`/stagiaires/${id}`, updateData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stagiaires'] });
      queryClient.invalidateQueries({ queryKey: ['stagiaire'] });
    },
  });
};

export const useDeleteStagiaire = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/stagiaires/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stagiaires'] });
    },
  });
};

// --- Filières ---
export const useFilieres = () => {
  return useQuery({
    queryKey: ['filieres'],
    queryFn: async () => {
      const { data } = await api.get('/filieres');
      return data.data;
    },
  });
};

// --- Dashboard ---
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats');
      return data;
    },
  });
};
