import { create } from 'zustand'
import {devtools, persist} from 'zustand/middleware'

interface UserState {
    id_user: number
    email_user: string
    tipoUser: boolean
    token: string
    amount: number

    setIdUser: (id_user: number) => void
    setEmailUser: (email_user: string) => void
    setTipoUser: (tipoUser: boolean) => void
    setToken: (token: string) => void
    setAmount: (amount: number) => void

    clearUser: () => void
}

export const useUserStore = create<UserState>()(
 
        persist(
            (set) => ({
                id_user: -1,
                email_user: '',
                tipoUser: false,
                token: '',
                amount: 1,

                setIdUser: (id_user) => set({ id_user }),
                setEmailUser: (email_user) => set({ email_user }),
                setTipoUser: (tipoUser) => set({ tipoUser }),
                setToken: (token) => set({ token }),
                setAmount: (amount) => set({ amount }),

                clearUser: () => set({ id_user: -1, email_user: '', tipoUser: false, token: '', amount: 0}),
            }),
            {
                name: 'user-storage',
            },
        ),
    )

