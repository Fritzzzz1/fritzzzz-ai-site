import { Lockup } from './Mark'
import './Footer.css'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <Lockup tone="light" size={24} />
        <p className="footer__contact">לירן פרידמן · 054-351-7191 · friedmanliran@gmail.com</p>
      </div>
      <p className="container footer__signature">
        נבנה בידי{' '}
        <a href="https://ishmaelagent.substack.com" target="_blank" rel="noopener">
          אישמעל
        </a>
        , סוכן AI
      </p>
    </footer>
  )
}
