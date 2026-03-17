import { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import Header from './components/Header'
import LoadingScreen from './components/LoadingScreen'
import PageBackground from './components/PageBackground'
import Hero from './components/Hero'
import EventInfo from './components/EventInfo'
import Gallery from './components/Gallery'
import VideoSection from './components/VideoSection'
import RegisterForm from './components/RegisterForm'
import Countdown from './components/Countdown'
import ExpiredForm from './components/ExpiredForm'
import Footer from './components/Footer'
import './App.css'

const COUNTDOWN_MINUTES = 10
const COUNTDOWN_MS = COUNTDOWN_MINUTES * 60 * 1000

function App() {
  const [searchParams] = useSearchParams()
  const resetParam = searchParams.get('reset')

  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_MS)
  const [formExpired, setFormExpired] = useState(false)
  const [showForm, setShowForm] = useState(true)
  const [registrationClosed, setRegistrationClosed] = useState<boolean | null>(null)
  const [registrationSuccess, setRegistrationSuccess] = useState(() =>
    Boolean(typeof localStorage !== 'undefined' && localStorage.getItem('fest_registered'))
  )
  const [hasReachedForm, setHasReachedForm] = useState(false)
  const registerSectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = registerSectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasReachedForm(true)
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    fetch('/api/registration-status')
      .then((r) => r.json())
      .then((d) => setRegistrationClosed(!d.open))
      .catch(() => setRegistrationClosed(false))
  }, [])

  useEffect(() => {
    if (registrationClosed === true) {
      setFormExpired(true)
      setShowForm(false)
      return
    }
    if (registrationClosed === false) {
      setFormExpired(false)
      setShowForm(true)
    }

    if (registrationClosed !== false || !hasReachedForm) return

    if (resetParam === '1') {
      localStorage.removeItem('fest_countdown_end')
      window.history.replaceState({}, '', window.location.pathname)
    }

    const stored = localStorage.getItem('fest_countdown_end')
    const endTime = stored ? parseInt(stored, 10) : Date.now() + COUNTDOWN_MS

    if (!stored) {
      localStorage.setItem('fest_countdown_end', String(endTime))
    }

    const interval = setInterval(() => {
      const remaining = endTime - Date.now()
      if (remaining <= 0) {
        setTimeLeft(0)
        setFormExpired(true)
        setShowForm(false)
        clearInterval(interval)
      } else {
        setTimeLeft(remaining)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [resetParam, registrationClosed, hasReachedForm])

  return (
    <div className="app">
      <LoadingScreen />
      <PageBackground />
      <Header />
      <main className="main-content">
        <Hero />
      <EventInfo />
      <Gallery />
      <VideoSection />
      <section ref={registerSectionRef} id="register" className="section register-section">
        {registrationClosed !== true && !registrationSuccess && (
          <Countdown timeLeft={timeLeft} expired={formExpired} />
        )}
        <AnimatePresence mode="wait">
          {registrationClosed === true ? (
            <ExpiredForm key="expired" />
          ) : registrationSuccess ? (
            <RegisterForm key="form" initialSuccess />
          ) : showForm && !formExpired ? (
            <RegisterForm
              key="form"
              onSuccess={() => {
                setRegistrationSuccess(true)
                localStorage.setItem('fest_registered', '1')
              }}
            />
          ) : formExpired ? (
            <ExpiredForm key="expired" />
          ) : null}
        </AnimatePresence>
      </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
