import './Why.css'

const BULLETS = [
  'הטכנולוגיה היא האמצעי; התוצאה העסקית היא המוצר.',
  'המודל פשוט ושקוף: משלמים רק על עבודה בפועל.',
  'ומדד ההצלחה שלי פשוט: שבשלב מסוים — לא תצטרכו אותי.',
]

export function Why() {
  return (
    <section id="why" className="why">
      <div className="container why__inner">
        <div className="why__photo-block">
          <div className="why__photo-frame">
            <img
              src={`${import.meta.env.BASE_URL}portrait-800.webp`}
              srcSet={`${import.meta.env.BASE_URL}portrait-800.webp 800w, ${import.meta.env.BASE_URL}portrait-1600.webp 1600w`}
              sizes="(max-width: 800px) 220px, 320px"
              alt="לירן פרידמן"
              width={800}
              height={800}
              loading="lazy"
              decoding="async"
              className="why__photo"
            />
          </div>
          <p className="why__caption-name">לירן פרידמן</p>
          <p className="why__caption-handle">
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

        <div className="why__copy">
          <p className="eyebrow">למה אני</p>
          <h2 className="why__title">קודם מבינים. אחר כך ממליצים.</h2>
          <p className="why__paragraph">
            אני לא מגיע עם פתרון מוכן. קודם אני לומד איך העסק שלכם עובד — האנשים, התהליכים, איפה
            הזמן הולך לאיבוד — ורק אז ממליץ, גם כשההמלצה היא לא לבנות כלום. הדרכות וכלים יש בשפע;
            מה שנדיר הוא אדם אחד שמכיר את הכלים, ממפה את הכאבים שלכם, בונה ומלמד — ונשאר עד שאתם
            בשליטה.
          </p>
          <ul className="why__bullets">
            {BULLETS.map((bullet) => (
              <li key={bullet} className="why__bullet">
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
