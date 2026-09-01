import { useEffect, useState } from 'react'
import './Hero.css'

const PHOTOS = [
  `${import.meta.env.BASE_URL}portrait-800.webp`,
  ...Array.from(
    { length: 15 },
    (_, i) =>
      `${import.meta.env.BASE_URL}hero/gen-${String(i + 1).padStart(2, '0')}.jpg`,
  ),
]
const ROTATE_MS = 7500

export function Hero() {
  const [photo, setPhoto] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(
      () => setPhoto((current) => (current + 1) % PHOTOS.length),
      ROTATE_MS,
    )
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    new Image().src = PHOTOS[(photo + 1) % PHOTOS.length]
  }, [photo])

  const previous = (photo + PHOTOS.length - 1) % PHOTOS.length
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow eyebrow--on-dark">ייעוץ, הדרכה ובנייה עם AI — לעצמאים ולעסקים</p>
          <h1 className="hero__title">
            <span className="hero__title-line">אני עוזר לעסקים לעבוד חכם יותר</span>
            <span className="hero__title-line hero__title-accent">ולפתור בעיות באמצעות AI.</span>
          </h1>
          <p className="hero__lead">
            ה-AI זמין היום לכולם. הזמן ללמוד אותו, והידע לבחור נכון מתוך ים האפשרויות — הרבה
            פחות. מה שחסר הוא החיבור שלהם לעבודה האמיתית שלכם.
          </p>
          <div className="hero__actions">
            <a
              href={`https://wa.me/972543517191?text=${encodeURIComponent('היי לירן, הגעתי מהאתר ואשמח לשיחת היכרות 🙂')}`}
              target="_blank"
              rel="noopener"
              className="btn btn--primary"
            >
              שיחת היכרות — בלי התחייבות
            </a>
            <a href="#method" className="btn btn--outline-on-dark">
              איך זה עובד
            </a>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__photo-block">
            <div className="hero__photo-frame">
              {photo !== 0 && (
                <img
                  key={`under-${previous}`}
                  src={PHOTOS[previous]}
                  alt=""
                  width={900}
                  height={900}
                  decoding="async"
                  className="hero__photo hero__photo--under"
                />
              )}
              <img
                key={`over-${photo}`}
                src={PHOTOS[photo]}
                alt={photo === 0 ? 'לירן פרידמן' : 'עבודת AI של fritzzzz_ai'}
                width={900}
                height={900}
                fetchPriority={photo === 0 ? 'high' : undefined}
                decoding="async"
                className="hero__photo hero__photo--over"
              />
            </div>
            <p className="hero__caption-name">לירן פרידמן</p>
            <p className="hero__caption-handle">
              <a
                href="https://www.instagram.com/fritzzzz_ai/"
                target="_blank"
                rel="noopener"
                aria-label="fritzzzz_ai באינסטגרם"
              >
                fritzzzz_ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
