import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionTitle from './SectionTitle'

const items = [
  {
    src: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=85',
    srcFull: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=90',
    alt: 'Realidad virtual',
    caption: 'Realidad que se siente real',
    title: 'Realidad Virtual',
    description: 'Sumérgete en mundos donde la línea entre lo real y lo digital se desvanece. Experiencias inmersivas que activan todos tus sentidos y te transportan a dimensiones nuevas.',
    tags: ['VR', 'Inmersión', '3D'],
  },
  {
    src: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&q=85',
    srcFull: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=1200&q=90',
    alt: 'Experiencias digitales',
    caption: 'Donde lo digital cobra vida',
    title: 'Experiencias Digitales',
    description: 'La tecnología al servicio de las emociones. Interfaces que responden, espacios que se adaptan y narrativas que te involucran de forma activa.',
    tags: ['Digital', 'Interactivo', 'UX'],
  },
  {
    src: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&q=85',
    srcFull: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=1200&q=90',
    alt: 'XR inmersivo',
    caption: 'Experiencias que dejan huella',
    title: 'XR Inmersivo',
    description: 'Realidad extendida que combina lo físico y lo virtual. Demos en vivo, workshops y keynotes que exploran el futuro de la interacción humana.',
    tags: ['XR', 'AR', 'VR', 'Live'],
  },
  {
    src: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=85',
    srcFull: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=1200&q=90',
    alt: 'Tecnología emocional',
    caption: 'Tecnología con corazón',
    title: 'Tecnología Emocional',
    description: 'Innovación con propósito. Herramientas y plataformas que conectan con lo que sentimos y amplifican nuestra capacidad de crear y conectar.',
    tags: ['Innovación', 'Emociones', 'Futuro'],
  },
]

export default function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0) // 1 = next (down), -1 = prev (up)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedIndex])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedIndex !== null) {
        if (e.key === 'Escape') setSelectedIndex(null)
        if (e.key === 'ArrowLeft') setSelectedIndex((i) => (i === 0 ? items.length - 1 : i! - 1))
        if (e.key === 'ArrowRight') setSelectedIndex((i) => (i === items.length - 1 ? 0 : i! + 1))
      } else {
        if (e.key === 'ArrowUp') {
          setDirection(-1)
          setCurrentIndex((i) => (i === 0 ? items.length - 1 : i - 1))
        }
        if (e.key === 'ArrowDown') {
          setDirection(1)
          setCurrentIndex((i) => (i === items.length - 1 ? 0 : i + 1))
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectedIndex])

  const goTo = (i: number) => {
    setDirection(i > currentIndex ? 1 : -1)
    setCurrentIndex(i)
  }
  const prev = () => {
    setDirection(-1)
    setCurrentIndex((i) => (i === 0 ? items.length - 1 : i - 1))
  }
  const next = () => {
    setDirection(1)
    setCurrentIndex((i) => (i === items.length - 1 ? 0 : i + 1))
  }

  return (
    <section className="section gallery gallery-carousel" id="galeria">
      <SectionTitle className="section-title">UN VISTAZO AL FUTURO</SectionTitle>

      <div className="gallery-carousel-wrap">
        <button
          className="gallery-carousel-arrow gallery-carousel-prev"
          onClick={prev}
          aria-label="Anterior"
        >
          ↑
        </button>

        <div className="gallery-carousel-track">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.figure
              key={currentIndex}
              className="gallery-carousel-slide"
              custom={direction}
              initial={{ opacity: 0, y: direction >= 0 ? 80 : -80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: direction >= 0 ? -80 : 80 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setSelectedIndex(currentIndex)}
            >
              <div className="gallery-carousel-img-wrap">
                <img src={items[currentIndex].src} alt={items[currentIndex].alt} />
                <div className="gallery-carousel-overlay" />
                <div className="gallery-carousel-hint">Click para ampliar</div>
              </div>
              <figcaption>{items[currentIndex].caption}</figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <button
          className="gallery-carousel-arrow gallery-carousel-next"
          onClick={next}
          aria-label="Siguiente"
        >
          ↓
        </button>
      </div>

      <div className="gallery-carousel-dots">
        {items.map((_, i) => (
          <button
            key={i}
            className={`gallery-carousel-dot ${i === currentIndex ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Ir a imagen ${i + 1}`}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedIndex(null)}
          >
            {items.length > 1 && (
              <>
                <button
                  className="gallery-lightbox-nav gallery-lightbox-prev"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedIndex((i) => (i === 0 ? items.length - 1 : i! - 1))
                  }}
                  aria-label="Anterior"
                >
                  ‹
                </button>
                <button
                  className="gallery-lightbox-nav gallery-lightbox-next"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedIndex((i) => (i === items.length - 1 ? 0 : i! + 1))
                  }}
                  aria-label="Siguiente"
                >
                  ›
                </button>
              </>
            )}
            <motion.div
              className="gallery-lightbox-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="gallery-lightbox-close"
                onClick={() => setSelectedIndex(null)}
                aria-label="Cerrar"
              >
                ✕
              </button>
              <div className="gallery-lightbox-body">
                <div className="gallery-lightbox-img-wrap">
                  <img src={items[selectedIndex].srcFull} alt={items[selectedIndex].alt} />
                </div>
                <div className="gallery-lightbox-info">
                  <h3 className="gallery-lightbox-title">{items[selectedIndex].title}</h3>
                  <p className="gallery-lightbox-caption">{items[selectedIndex].caption}</p>
                  <p className="gallery-lightbox-description">{items[selectedIndex].description}</p>
                  <div className="gallery-lightbox-tags">
                    {items[selectedIndex].tags.map((tag) => (
                      <span key={tag} className="gallery-lightbox-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
