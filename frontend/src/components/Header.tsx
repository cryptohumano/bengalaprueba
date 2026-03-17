import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#info', label: 'Info' },
  { href: '#galeria', label: 'Galería' },
  { href: '#video', label: 'Video' },
  { href: '#register', label: 'Registro' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <motion.header
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <a href="#inicio" className="header-logo">
        INNOVATION FEST
      </a>
      <nav className="header-nav">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="header-link"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <button
        className="header-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menú"
      >
        {menuOpen ? '✕' : '☰'}
      </button>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="header-mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="header-mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
