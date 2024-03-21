import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAppStore = create(
    persist(
      (set) => ({
        presences: null,
        role:'',
        selectedMonth: "",
        setSelectedMonth: (month) => set((state) => ({...state, selectedMonth: month })),
        setRole: (role) => set((state) => ({ ...state,role })),
        setPresences: (data) => set((state) => ({ ...state,presences: data })),
      }),
      {
        name: 'drh-storage', // name of the item in the storage (must be unique)
        storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      }
    )
  )