import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Registro {
  id: number
  nombre: string
  email: string
  mensaje: string
  created_at: string
}

interface WaitlistItem {
  id: number
  email: string
  created_at: string
}

interface AdminData {
  registros: Registro[]
  waitlist: WaitlistItem[]
  totalRegistros: number
  totalWaitlist: number
  duplicados: Registro[]
  settings?: { registration_closed: boolean }
}

export default function Admin() {
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token') || '')
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [searchDebounce, setSearchDebounce] = useState('')
  const [toggling, setToggling] = useState(false)
  const [exporting, setExporting] = useState<'registros' | 'waitlist' | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounce(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const fetchData = async (authToken: string) => {
    setLoading(true)
    setError('')
    try {
      const url = searchDebounce
        ? `/api/admin/registros?search=${encodeURIComponent(searchDebounce)}`
        : '/api/admin/registros'
      const res = await fetch(url, {
        headers: { 'X-Admin-Password': authToken },
      })
      if (!res.ok) {
        if (res.status === 401) throw new Error('Contraseña incorrecta')
        throw new Error('Error al cargar')
      }
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleRegistration = async () => {
    if (!token || !data) return
    setToggling(true)
    try {
      const newState = !data.settings?.registration_closed
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': token,
        },
        body: JSON.stringify({ registration_closed: newState }),
      })
      if (!res.ok) throw new Error('Error al actualizar')
      await fetchData(token)
    } catch {
      setError('Error al cambiar estado')
    } finally {
      setToggling(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password) {
      sessionStorage.setItem('admin_token', password)
      setToken(password)
      fetchData(password)
    }
  }

  const handleExportCsv = async (type: 'registros' | 'waitlist') => {
    if (!token) return
    setExporting(type)
    try {
      const res = await fetch(`/api/admin/export/${type}.csv`, {
        headers: { 'X-Admin-Password': token },
      })
      if (!res.ok) throw new Error('Error al exportar')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type}-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Error al descargar CSV')
    } finally {
      setExporting(null)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token')
    setToken('')
    setData(null)
    setPassword('')
  }

  useEffect(() => {
    if (token) fetchData(token)
  }, [token, searchDebounce])

  if (!token) {
    return (
      <div className="admin-page">
        <motion.div
          className="admin-login"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>🔐 Admin</h1>
          <p>Ingresa la contraseña para ver los registros</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit">Entrar</button>
          </form>
          {error && <p className="admin-error">{error}</p>}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Registros Innovation Fest</h1>
        <a href="/" className="admin-back">← Volver al evento</a>
        <button onClick={handleLogout} className="admin-logout">Salir</button>
      </header>

      {loading ? (
        <p className="admin-loading">Cargando...</p>
      ) : data ? (
        <motion.div
          className="admin-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="admin-toolbar">
            <div className="admin-export">
              <button
                onClick={() => handleExportCsv('registros')}
                disabled={!!exporting}
                className="admin-export-btn"
                title="Descargar registros en CSV para Excel"
              >
                {exporting === 'registros' ? '...' : '📥 Exportar registros CSV'}
              </button>
              <button
                onClick={() => handleExportCsv('waitlist')}
                disabled={!!exporting}
                className="admin-export-btn"
                title="Descargar waitlist en CSV para Excel"
              >
                {exporting === 'waitlist' ? '...' : '📥 Exportar waitlist CSV'}
              </button>
            </div>
            <div className="admin-search">
              <input
                type="text"
                placeholder="Buscar por nombre, email o mensaje..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="admin-toggle">
              <span className="toggle-label">
                Registro: {data.settings?.registration_closed ? '🔒 Cerrado' : '✅ Abierto'}
              </span>
              <button
                onClick={handleToggleRegistration}
                disabled={toggling}
                className={`toggle-btn ${data.settings?.registration_closed ? 'closed' : ''}`}
              >
                {toggling ? '...' : data.settings?.registration_closed ? 'Abrir registro' : 'Cerrar registro'}
              </button>
            </div>
          </div>

          <div className="admin-stats">
            <div className="stat-card">
              <span className="stat-number">{data.totalRegistros}</span>
              <span className="stat-label">Registros completos</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{data.totalWaitlist}</span>
              <span className="stat-label">Waitlist (próximo evento)</span>
            </div>
            {data.duplicados?.length > 0 && (
              <div className="stat-card warning">
                <span className="stat-number">{data.duplicados.length}</span>
                <span className="stat-label">En ambos (registro + waitlist)</span>
              </div>
            )}
          </div>

          {data.duplicados && data.duplicados.length > 0 && (
            <section className="admin-section">
              <h2>⚠️ Duplicados (mismo email en registro y waitlist)</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.duplicados.map((r) => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.nombre}</td>
                        <td><a href={`mailto:${r.email}`}>{r.email}</a></td>
                        <td>{new Date(r.created_at).toLocaleString('es-MX')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="admin-section">
            <h2>✅ Registrados al evento</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Mensaje</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {data.registros.length === 0 ? (
                    <tr>
                      <td colSpan={5}>{search ? 'Sin resultados' : 'Sin registros aún'}</td>
                    </tr>
                  ) : (
                    data.registros.map((r) => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.nombre}</td>
                        <td><a href={`mailto:${r.email}`}>{r.email}</a></td>
                        <td className="msg-cell">{r.mensaje}</td>
                        <td>{new Date(r.created_at).toLocaleString('es-MX')}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-section">
            <h2>📧 Waitlist (próximo evento)</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Email</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {data.waitlist.length === 0 ? (
                    <tr>
                      <td colSpan={3}>{search ? 'Sin resultados' : 'Sin correos en waitlist'}</td>
                    </tr>
                  ) : (
                    data.waitlist.map((w) => (
                      <tr key={w.id}>
                        <td>{w.id}</td>
                        <td><a href={`mailto:${w.email}`}>{w.email}</a></td>
                        <td>{new Date(w.created_at).toLocaleString('es-MX')}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </motion.div>
      ) : (
        <p className="admin-error">{error}</p>
      )}
    </div>
  )
}
