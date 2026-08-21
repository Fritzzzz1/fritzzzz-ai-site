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
              src={`${import.meta.env.BASE_URL}headshot.png`}
              alt="לירן פרידמן"
              width={368}
              height={369}
              className="why__photo"
            />
          </div>
          <p className="why__caption-name">לירן פרידמן</p>
          <p className="why__caption-handle">fritzzzz_ai</p>
        </div>

        <div className="why__copy">
          <p className="eyebrow">למה אני</p>
          <h2 className="why__title">רופא, לא ספק שירות.</h2>
          <p className="why__paragraph">
            מגיעים, מאבחנים, ורק אז ממליצים — גם כשההמלצה היא "אל תבנה כלום". המצרך הנדיר הוא
            אדם אחד שמכיר את הכלים, ממפה את הכאבים שלכם, בונה ומלמד — החיבור עצמו.
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
