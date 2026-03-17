import { motion } from 'framer-motion'
import SectionTitle from './SectionTitle'

const cards = [
  {
    icon: '📅',
    title: 'FECHA',
    value: '18 & 19 MARZO 2026',
    desc: '48 horas de inmersión total',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80',
  },
  {
    icon: '📍',
    title: 'FORMATO',
    value: '100% DIGITAL',
    desc: 'Pero con alma de presencial. Acceso desde cualquier dispositivo',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
  },
  {
    icon: '🎪',
    title: 'EXPERIENCIAS',
    value: '6 BLOQUES',
    desc: 'Keynotes XR • Live demos AR/VR • Networking • Workshops 3D • Virtual OOH • Hackathon',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
  },
  {
    icon: '🎟️',
    title: 'CUPOS',
    value: 'SOLO 500 LUGARES',
    desc: 'El tiempo corre... las emociones no esperan',
    image: 'https://images.unsplash.com/photo-1540575467063-178bf50d2f42?w=600&q=80',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
}

export default function EventInfo() {
  return (
    <section className="section event-info" id="info">
      <SectionTitle className="section-title">LO QUE VAS A VIVIR</SectionTitle>
      <motion.div
        className="cards-grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
      >
        {cards.map((card) => (
          <motion.div
            key={card.title}
            className="info-card"
            variants={item}
            whileHover={{
              scale: 1.08,
              y: -12,
              boxShadow: '0 24px 48px rgba(107, 78, 255, 0.25)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            <div className="info-card-bg">
              <img src={card.image} alt="" loading="lazy" />
            </div>
            <div className="info-card-content">
              <span className="card-icon">{card.icon}</span>
              <h3>{card.title}</h3>
              <p className="card-value">{card.value}</p>
              <p className="card-desc">{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
