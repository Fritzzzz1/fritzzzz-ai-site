import { Lens } from './Lens'
import './Hero.css'

export function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow eyebrow--on-dark">AI בעבודה האמיתית של העסק</p>
          <h1 className="hero__title">
            <span className="hero__title-line">פחות ניסוי וטעייה.</span>
            <span className="hero__title-line hero__title-accent">יותר עבודה שעובדת.</span>
          </h1>
          <p className="hero__lead">
            ה-AI זמין היום לכולם. הזמן ללמוד אותו, והידע לבחור נכון מתוך ים האפשרויות — הרבה
            פחות. מה שחסר הוא החיבור שלהם לעבודה האמיתית שלכם.
          </p>
          <div className="hero__actions">
            <a href="https://wa.me/972543517191" className="btn btn--primary">
              שיחת היכרות — בלי התחייבות
            </a>
            <a href="#method" className="btn btn--outline-on-dark">
              איך זה עובד
            </a>
          </div>
        </div>
        <div className="hero__visual">
          <Lens />
        </div>
      </div>
    </section>
  )
}
