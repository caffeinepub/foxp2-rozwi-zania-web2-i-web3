import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ContactMessage, Web3Card } from '../backend';
import type { Principal } from '@dfinity/principal';

export function useSubmitContactMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      firstName,
      lastName,
      email,
      phone,
      message,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string | null;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      const result = await actor.submitContactMessage(firstName, lastName, email, phone, message);
      if (!result) {
        throw new Error('Failed to submit contact message');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
    },
  });
}

export function useGetContactMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactMessage[]>({
    queryKey: ['contactMessages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContactMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteContactMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteContactMessage(messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerPrincipalAndAdminStatus() {
  const { actor, isFetching } = useActor();

  return useQuery<{ principal: Principal; isAdmin: boolean } | null>({
    queryKey: ['callerPrincipalAndAdminStatus'],
    queryFn: async () => {
      if (!actor) return null;
      const [principal, isAdmin] = await actor.getCallerPrincipalAndAdminStatus();
      return { principal, isAdmin };
    },
    enabled: !!actor && !isFetching,
  });
}

// Web3 Card Management Hooks
export function useGetWeb3Cards() {
  const { actor, isFetching } = useActor();

  return useQuery<Web3Card[]>({
    queryKey: ['web3Cards'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWeb3Cards();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddWeb3Card() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (card: Web3Card) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addWeb3Card(card);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['web3Cards'] });
    },
  });
}

export function useUpdateWeb3Card() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (card: Web3Card) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateWeb3Card(card);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['web3Cards'] });
    },
  });
}

export function useDeleteWeb3Card() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cardId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteWeb3Card(cardId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['web3Cards'] });
    },
  });
}
