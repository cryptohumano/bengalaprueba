import HeroScene from './HeroScene'

export default function PageBackground() {
  return (
    <div className="page-bg" aria-hidden>
      <HeroScene />
      <div className="gradient-orb orb-1" />
      <div className="gradient-orb orb-2" />
      <div className="gradient-orb orb-3" />
      <div className="grid-overlay" />
    </div>
  )
}
