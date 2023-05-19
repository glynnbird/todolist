export const useTodos = () => useState<Array<object>>('todos', () => [])
export const useAlert = () => useState<object>('alert', () => { return {} })
export const useAuth = () => useState<object>('auth', () => { return { authenticated: false } })