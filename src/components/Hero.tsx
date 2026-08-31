import './Hero.css'

export function Hero() {
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
              <img
                src={`${import.meta.env.BASE_URL}portrait-800.webp`}
                srcSet={`${import.meta.env.BASE_URL}portrait-800.webp 800w, ${import.meta.env.BASE_URL}portrait-1600.webp 1600w`}
                sizes="(max-width: 900px) 240px, 400px"
                alt="לירן פרידמן"
                width={800}
                height={800}
                fetchPriority="high"
                decoding="async"
                className="hero__photo"
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
