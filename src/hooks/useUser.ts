import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/lib/api';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userApi.getAll();
      return response.data;
    },
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const response = await userApi.getOne(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useTopup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, amount }: { userId: number; amount: number }) => 
      userApi.topup(userId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useTransfer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ fromUserId, toUserId, amount }: { 
      fromUserId: number; 
      toUserId: number; 
      amount: number;
    }) => userApi.transfer(fromUserId, toUserId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}