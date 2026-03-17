import { motion } from 'framer-motion'

interface CountdownProps {
  timeLeft: number
  expired: boolean
}

function pad(n: number) {
  return String(Math.floor(n)).padStart(2, '0')
}

export default function Countdown({ timeLeft, expired }: CountdownProps) {
  if (expired) return null

  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
  const isUrgent = timeLeft < 3 * 60 * 1000
  const isCritical = timeLeft < 60 * 1000

  return (
    <motion.div
      className={`countdown ${isUrgent ? 'urgent' : ''} ${isCritical ? 'critical' : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3>⚡ EL TIEMPO CORRE</h3>
      <p className="countdown-copy">Este formulario desaparece en:</p>
      <div className="countdown-display">
        <span className="countdown-value">{pad(minutes)}</span>
        <span className="countdown-sep">:</span>
        <span className="countdown-value">{pad(seconds)}</span>
        <span className="countdown-unit">minutos</span>
      </div>
      <p className="countdown-cta">Las emociones no esperan. ¿Y tú?</p>
    </motion.div>
  )
}
