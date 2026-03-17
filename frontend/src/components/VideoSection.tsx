import { motion } from 'framer-motion'

const YOUTUBE_ID = 'KPEcKJNfjkQ'
const EMBED_URL = `https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_ID}&controls=0&showinfo=0&rel=0`

export default function VideoSection() {
  return (
    <motion.section
      className="video-section"
      id="video"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px', amount: 0.1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="video-section-wrap">
        <div className="video-container">
          <iframe
            src={EMBED_URL}
            title="Innovation Immersion Fest - Timelapse"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </motion.section>
  )
}
