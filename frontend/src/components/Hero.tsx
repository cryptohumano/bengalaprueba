import { motion } from 'framer-motion'
import SplitTitle from './SplitTitle'

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-content">
        <h1 className="hero-title">
          <SplitTitle text="EMOCIONES" delay={0.2} stagger={0.04} as="span" />
          <br />
          <SplitTitle text="DIGITALES" delay={0.5} stagger={0.04} as="span" />
        </h1>
        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Únete al festival que está redefiniendo
          <br />
          cómo sentimos la tecnología
        </motion.p>
        <motion.a
          href="#register"
          className="hero-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          whileHover={{ scale: 1.1, boxShadow: '0 0 40px rgba(255, 46, 158, 0.6)' }}
          whileTap={{ scale: 0.98 }}
        >
          Regístrate gratis →
        </motion.a>
      </div>
      <motion.a
        href="#info"
        className="scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.1 }}
      >
        <span className="scroll-hint-text">ESCROLEA</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          ↓
        </motion.span>
      </motion.a>
    </section>
  )
}
