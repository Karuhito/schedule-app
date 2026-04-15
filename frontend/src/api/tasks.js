import api from './axios'

export const getTasks = (date = null, sort = 'asc', incompleteOnly = false, category = '', noDate = false) =>
    api.get('/tasks/', {
        params: {
            ...(noDate ? { no_date:'true' } : date ? { date } : {}),
            sort,
            incomplete_only: incompleteOnly ? 'true' : 'false',
            ...(category ? { category } : {}),
        },
    })
export const createTask = (data) => api.post('/tasks/', data)
export const updateTask = (id, data) => api.patch(`/tasks/${id}/`, data)
export const deleteTask = (id) => api.delete(`/tasks/${id}/`)
export const analyzePriorities = (targetDate) =>
    api.post('/ai/prioritize/', { target_date: targetDate })
export const applyPriorities = (data) => api.post('/ai/apply/', data)