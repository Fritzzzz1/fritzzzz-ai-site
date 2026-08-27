import { useEffect, useState } from 'react'
import { Lockup } from './Mark'
import './Nav.css'

const LINKS = [
  { href: '#problems', label: 'מה אני פותר' },
  { href: '#method', label: 'איך זה עובד' },
  { href: '#why', label: 'למה אני' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <a href="#" className="nav__lockup" aria-label="fritzzzz_ai — לדף הבית">
          <Lockup tone="light" />
        </a>
        <nav className="nav__links" aria-label="ניווט ראשי">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="https://wa.me/972543517191"
          target="_blank"
          rel="noopener"
          className="btn btn--primary nav__cta"
        >
          שיחת היכרות
        </a>
      </div>
    </header>
  )
}
