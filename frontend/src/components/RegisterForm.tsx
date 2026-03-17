import { useState } from 'react'
import { motion } from 'framer-motion'

interface FormData {
  nombre: string
  email: string
  mensaje: string
}

interface ApiError {
  field: string
  message: string
}

interface RegisterFormProps {
  onSuccess?: () => void
  initialSuccess?: boolean
}

export default function RegisterForm({ onSuccess, initialSuccess = false }: RegisterFormProps) {
  const [form, setForm] = useState<FormData>({ nombre: '', email: '', mensaje: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(initialSuccess)
  const [errors, setErrors] = useState<ApiError[]>([])
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors([])
    setSubmitError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])
    setSubmitError('')

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      const msg = data?.message || 'Error al registrar'

      if (res.ok && data.success) {
        setSuccess(true)
        setForm({ nombre: '', email: '', mensaje: '' })
        onSuccess?.()
      } else {
        if (data.errors) setErrors(data.errors)
        else setSubmitError(msg)
      }
    } catch {
      setSubmitError('Error de conexión. ¿Está corriendo el backend en el puerto 3001?')
    } finally {
      setLoading(false)
    }
  }

  const getError = (field: string) => errors.find((e) => e.field === field)?.message

  if (success) {
    return (
      <motion.div
        className="success-message"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>🎉 ¡BIENVENIDO A BORDO!</h2>
        <p>Revisa tu correo en los próximos minutos.</p>
        <p>Las emociones están por comenzar...</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="form-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="form-title">¿LISTO PARA SENTIRLO?</h2>
      <p className="form-subtitle">
        Únete a la revolución de las emociones digitales.
        <br />
        Tu lugar está esperando... pero no por mucho tiempo.
      </p>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="nombre">¿CÓMO TE LLAMAS?</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Tu nombre completo"
            value={form.nombre}
            onChange={handleChange}
            className={getError('nombre') ? 'error' : ''}
            required
          />
          <span className="hint">Tu nombre completo (sin abreviaturas, por favor)</span>
          {getError('nombre') && <span className="field-error">{getError('nombre')}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email">TU CORREO</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={form.email}
            onChange={handleChange}
            className={getError('email') ? 'error' : ''}
            required
          />
          <span className="hint">Donde te llegará el acceso mágico ✨</span>
          {getError('email') && <span className="field-error">{getError('email')}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="mensaje">¿POR QUÉ QUIERES VIVIRLO?</label>
          <textarea
            id="mensaje"
            name="mensaje"
            placeholder="Cuéntanos en 2-3 líneas qué te emociona..."
            value={form.mensaje}
            onChange={handleChange}
            rows={4}
            className={getError('mensaje') ? 'error' : ''}
            required
          />
          <span className="hint">Cuéntanos en 2-3 líneas qué te emociona de esto</span>
          {getError('mensaje') && <span className="field-error">{getError('mensaje')}</span>}
        </div>
        {submitError && <p className="submit-error">{submitError}</p>}
        <motion.button
          type="submit"
          className="submit-btn"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Cargando emociones...' : '¡QUIERO VIVIRLO!'}
        </motion.button>
      </form>
    </motion.div>
  )
}
