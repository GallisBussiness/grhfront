import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAppStore = create(
    persist(
      (set) => ({
        presences: null,
        selectedMonth: "",
        setSelectedMonth: (month) => set({selectedMonth:month}),
        setPresences: (data) => set({ presences: data }),
      }),
      {
        name: 'drh-storage', // name of the item in the storage (must be unique)
        storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      }
    )
  )