import { useInView } from '../hooks/useInView'
import './Method.css'

const STEPS = [
  {
    number: '1',
    title: 'אבחון',
    body: 'מבינים את העסק, האנשים והתהליכים. לפעמים די בפגישה אחת.',
  },
  {
    number: '2',
    title: 'תכנון',
    body: 'תוכנית עבודה במידות של הארגון — בלי לקפוץ לפתרון כבד.',
  },
  {
    number: '3',
    title: 'יישום',
    body: 'אוטומציות, תשתית עבודה עם AI, ולפעמים פיתוח ייעודי.',
  },
  {
    number: '4',
    title: 'הכשרה',
    body: 'בונים יכולת בארגון, לא תלות.',
  },
  {
    number: '5',
    title: 'ליווי',
    body: 'זמין להמשך. משלמים רק על עבודה בפועל.',
  },
]

export function Method() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.35 })

  return (
    <section id="method" className="method">
      <div className="container">
        <p className="eyebrow">השיטה</p>
        <h2 className="method__title">מאבחנים לפני שבונים.</h2>
        <p className="method__intro">
          מתחילים בשיחת היכרות: אתם מספרים על הכאבים של העסק, ואני מציע דרכים להתמודדות
          ולשיפור. כבר מהמפגש הזה תצאו עם טיפים ראשונים, הבנה איך מתקדמים, ומגוון אפשרויות
          להמשך.
        </p>

        <div ref={ref} className={`method__flow${inView ? ' in-view' : ''}`}>
          <div className="method__track">
            <div className="method__track-fill" />
          </div>
          {STEPS.map((step) => (
            <div key={step.number} className="method__step">
              <span className="method__node">{step.number}</span>
              <h3 className="method__step-title">{step.title}</h3>
              <p className="method__step-body">{step.body}</p>
            </div>
          ))}
        </div>

        <p className="method__closing">
          אדם אחד לכל הדרך: מאבחן, מתכנן, בונה, מלמד — ליווי אישי צמוד עד שאתם בשליטה.
        </p>
      </div>
    </section>
  )
}
