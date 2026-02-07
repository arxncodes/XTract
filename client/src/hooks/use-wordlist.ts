import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type GenerateWordlistRequest, type WordlistResponse } from "@shared/routes";

// GET /api/history - Fetch past generation requests
export function useHistory() {
  return useQuery({
    queryKey: [api.wordlist.history.path],
    queryFn: async () => {
      const res = await fetch(api.wordlist.history.path, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch history');
      return api.wordlist.history.responses[200].parse(await res.json());
    },
  });
}

// POST /api/generate - Generate the wordlist
export function useGenerateWordlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: GenerateWordlistRequest) => {
      // Ensure numbers are coerced correctly before sending if needed,
      // though Zod schema handles coercing on backend validation usually.
      // Frontend form libraries usually handle types, but we double check.
      const res = await fetch(api.wordlist.generate.path, {
        method: api.wordlist.generate.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.wordlist.generate.responses[400].parse(await res.json());
          throw new Error(error.message || 'Validation failed');
        }
        throw new Error('Generation failed');
      }

      return api.wordlist.generate.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      // Refresh history after a successful generation
      queryClient.invalidateQueries({ queryKey: [api.wordlist.history.path] });
    },
  });
}
