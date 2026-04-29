'use client'

import { useState } from 'react'
import { revalidateClase } from '@/app/actions/revalidate'

export default function RevalidateButton({ path }: { path: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  async function handleClick() {
    setState('loading')
    try {
      const data = await revalidateClase(path)
      if (data.ok) {
        setState('ok')
        setTimeout(() => window.location.reload(), 600)
      } else {
        setState('error')
        console.error('Revalidate error:', data)
      }
    } catch (err) {
      setState('error')
      console.error('Revalidate failed:', err)
    }
  }

  const label =
    state === 'loading' ? 'Actualizando…' :
    state === 'ok' ? '✓ Actualizado' :
    state === 'error' ? 'Error — reintentar' :
    '↻ Actualizar'

  return (
    <button onClick={handleClick} disabled={state === 'loading'} title={`Invalida la cache de ${path}`}>
      {label}
    </button>
  )
}
