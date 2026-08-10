import { useCallback, useState } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null)
  const notify = useCallback((message, type = 'success', title) => setToast({ message, type, title }), [])
  const clearToast = useCallback(() => setToast(null), [])
  return { toast, notify, clearToast }
}
