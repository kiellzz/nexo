const youtubeHosts = new Set(['youtube.com', 'm.youtube.com', 'youtu.be'])

export function validarUrlYoutube(value: string): boolean {
  try {
    const url = new URL(value.trim())
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '')

    if (url.protocol !== 'https:' || !youtubeHosts.has(hostname)) return false

    if (hostname === 'youtu.be') return url.pathname.length > 1
    if (url.pathname === '/watch') return Boolean(url.searchParams.get('v'))

    return /^\/(embed|live|shorts)\/[^/]+/.test(url.pathname)
  } catch {
    return false
  }
}

export function validarUrlWeb(value: string): boolean {
  try {
    const url = new URL(value.trim())
    return (url.protocol === 'https:' || url.protocol === 'http:') && Boolean(url.hostname)
  } catch {
    return false
  }
}

export function validarUrlLinkedin(value: string): boolean {
  try {
    const url = new URL(value.trim())
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '')
    return (url.protocol === 'https:' || url.protocol === 'http:') && hostname === 'linkedin.com' && url.pathname.length > 1
  } catch {
    return false
  }
}