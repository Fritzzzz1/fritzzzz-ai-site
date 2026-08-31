import './Cta.css'

export function Cta() {
  return (
    <section className="cta">
      <div className="container cta__inner">
        <h2 className="cta__title">השלב הראשון: שיחת היכרות — בלי התחייבות.</h2>
        <p className="cta__sub">
          שיחה ראשונה על העסק ועל מה שמפריע בעבודה היום-יומית. כבר ממנה תצאו עם טיפים ראשונים ואפשרויות להמשך.
        </p>
        <div className="cta__actions">
          <a
            href={`https://wa.me/972543517191?text=${encodeURIComponent('היי לירן, קראתי באתר ואשמח לשיחת היכרות 🙂')}`}
            target="_blank"
            rel="noopener"
            className="btn btn--primary"
          >
            לכתוב לי בוואטסאפ
          </a>
          <a href="mailto:friedmanliran@gmail.com" className="btn btn--outline-on-dark">
            friedmanliran@gmail.com
          </a>
        </div>
      </div>
    </section>
  )
}
