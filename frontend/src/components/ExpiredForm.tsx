import { useState } from 'react'
import { motion } from 'framer-motion'

interface ApiError {
  field: string
  message: string
}

export default function ExpiredForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<ApiError[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setErrors([])

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (data.success) {
        setSuccess(true)
        setEmail('')
      } else {
        if (data.errors) setErrors(data.errors)
        else setError(data.message || 'Error al enviar')
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const emailError = errors.find((e) => e.field === 'email')?.message

  if (success) {
    return (
      <motion.div
        className="success-message"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2>✅ ¡Listo!</h2>
        <p>Te avisaremos del próximo evento.</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="expired-message"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>🚪 LA PUERTA SE CERRÓ</h2>
      <p>Pero las emociones quedan.</p>
      <p>Déjanos tu correo para el próximo evento.</p>
      <form onSubmit={handleSubmit} className="waitlist-form">
        <input
          type="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError('')
            setErrors([])
          }}
          className={emailError ? 'error' : ''}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Avisarme del próximo →'}
        </button>
        {(emailError || error) && (
          <span className="field-error">{emailError || error}</span>
        )}
      </form>
    </motion.div>
  )
}
