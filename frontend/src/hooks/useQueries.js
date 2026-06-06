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
      return data.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const usePresencesSummary = (filters = {}) => {
  return useQuery({
    queryKey: ['presences-summary', filters],
    queryFn: async () => {
      const { data } = await api.get('/presences/summary', { params: filters });
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// --- Formateurs & Affectations ---
export const useFormateurs = () => {
  return useQuery({
    queryKey: ['formateurs'],
    queryFn: async () => {
      const { data } = await api.get('/users/formateurs');
      return data.data;
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData) => {
      const { data } = await api.post('/users', userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formateurs'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formateurs'] });
    },
  });
};

export const useUpdateAffectations = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/affectations', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formateurs'] });
    },
  });
};

// --- Notifications ---
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await api.get('/notifications');
      return data.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.put(`/notifications/${id}/read`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.put('/notifications/read-all');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// --- Stages ---
export const useStages = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['stages', filters],
    queryFn: async () => {
      const { data } = await api.get('/stages', { params: filters });
      return data;
    },
    ...options,
  });
};

export const useMyStage = () => {
  return useQuery({
    queryKey: ['my-stage'],
    queryFn: async () => {
      const { data } = await api.get('/stages/my-stage');
      return data.data;
    },
  });
};

export const useCreateStage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newStage) => {
      const { data } = await api.post('/stages', newStage);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stages'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
};

export const useUpdateStage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await api.put(`/stages/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stages'] });
      queryClient.invalidateQueries({ queryKey: ['my-stage'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
};

export const useSubmitStageForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/stages/submit-form', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stages'] });
      queryClient.invalidateQueries({ queryKey: ['my-stage'] });
    },
  });
};

export const useCheckStageNotifications = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/stages/check-notifications');
      return data;
    },
  });
};

