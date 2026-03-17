import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="footer">
      <motion.div
        className="footer-content"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h3>¿TIENES DUDAS?</h3>
        <div className="footer-contact">
          <p>
            <span className="footer-label">Email</span>
            <motion.a
              href="mailto:hola@casabengala.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              hola@casabengala.com
            </motion.a>
          </p>
          <p>
            <span className="footer-label">Dirección</span>
            Piñón 90, Lomas de San Mateo, Naucalpan, Edo.Méx.
          </p>
          <p>
            <span className="footer-label">WhatsApp</span>
            <motion.a
              href="https://wa.me/525522164511"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              55 2216 4511
            </motion.a>
          </p>
          <p>
            <span className="footer-label">Teléfono</span>
            <a href="tel:+525575910020">55 7591 0020</a>
          </p>
        </div>
        <p className="footer-credits">
          Hecho con 💜 y mucha pasión en CDMX
          <br />
          © 2026 Casa Bengala - Productora de Innovación
        </p>
      </motion.div>
    </footer>
  )
}
