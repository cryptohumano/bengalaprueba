import { motion } from 'framer-motion'

type SectionTitleProps = {
  children: string
  className?: string
}

export default function SectionTitle({ children, className = '' }: SectionTitleProps) {
  const words = children.split(/\s+/)

  return (
    <motion.h2
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        visible: {
          transition: { staggerChildren: 0.06, delayChildren: 0.1 },
        },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.35em]"
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          whileHover={{
            y: -4,
            color: 'var(--cyan)',
            transition: { duration: 0.2 },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h2>
  )
}
