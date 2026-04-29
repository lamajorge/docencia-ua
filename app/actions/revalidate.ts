'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateClase(path: string) {
  try {
    revalidatePath(path)
    return { ok: true, path, now: new Date().toISOString() }
  } catch (err) {
    return { ok: false, error: String(err) }
  }
}
