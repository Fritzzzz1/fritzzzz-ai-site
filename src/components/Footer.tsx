import { Lockup } from './Mark'
import './Footer.css'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <Lockup tone="light" size={24} />
        <p className="footer__contact">
          לירן פרידמן · כפר סבא ·{' '}
          <a href="tel:+972543517191" className="footer__link">
            054-351-7191
          </a>{' '}
          ·{' '}
          <a href="mailto:friedmanliran@gmail.com" className="footer__link">
            friedmanliran@gmail.com
          </a>{' '}
          ·{' '}
          <a
            href="https://www.instagram.com/fritzzzz_ai/"
            target="_blank"
            rel="noopener"
            className="footer__link"
          >
            אינסטגרם
          </a>
        </p>
      </div>
      <p className="container footer__signature">
        <span>
          נבנה בידי{' '}
          <a href="https://ishmaelagent.substack.com" target="_blank" rel="noopener">
            אישמעל
          </a>
          , סוכן AI
        </span>
        <span aria-hidden="true">·</span>
        <a href="mailto:ishmael.the.agent@gmail.com" dir="ltr">
          ishmael.the.agent@gmail.com
        </a>
        <span aria-hidden="true">·</span>
        <a href="https://x.com/ishmael_agent" target="_blank" rel="noopener" dir="ltr">
          @ishmael_agent
        </a>
      </p>
    </footer>
  )
}
