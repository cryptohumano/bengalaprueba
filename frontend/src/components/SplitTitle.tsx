import { motion } from 'framer-motion'

type SplitTitleProps = {
  text: string
  className?: string
  delay?: number
  stagger?: number
  as?: 'h1' | 'h2' | 'h3' | 'span'
  splitBy?: 'letters' | 'words'
}

export default function SplitTitle({
  text,
  className = '',
  delay = 0,
  stagger = 0.03,
  as: Tag = 'h2',
  splitBy = 'letters',
}: SplitTitleProps) {
  const parts = splitBy === 'letters'
    ? text.split('').filter((c) => c !== ' ')
    : text.split(/\s+/)

  const isSpace = (char: string) => char === ' ' || char === '\u00A0'

  if (splitBy === 'letters') {
    return (
      <Tag className={className} style={{ display: 'block' }}>
        <span className="inline-block" style={{ whiteSpace: 'nowrap' }}>
          {text.split('').map((char, i) =>
            isSpace(char) ? (
              <span key={i} className="inline-block" style={{ width: '0.25em' }} />
            ) : (
              <motion.span
                key={i}
                className="inline-block"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: delay + i * stagger,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -4,
                color: 'var(--cyan)',
                textShadow: '0 0 20px rgba(0, 212, 255, 0.6)',
                transition: { duration: 0.2 },
              }}
            >
              {char}
            </motion.span>
          )
        )}
        </span>
      </Tag>
    )
  }

  return (
    <Tag className={className}>
      {parts.map((word, i) => (
        <span key={i} className="inline-block mr-[0.25em]">
          {word.split('').map((char, j) => (
            <motion.span
              key={j}
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: delay + (i * parts[0]?.length + j) * stagger,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -3,
                color: 'var(--cyan)',
                transition: { duration: 0.15 },
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </Tag>
  )
}
