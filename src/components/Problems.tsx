import { useInView } from '../hooks/useInView'
import './Problems.css'

const PROBLEMS = [
  {
    number: '01',
    title: 'משימות חוזרות נעשות מעצמן',
    body: 'העבודה הידנית שחוזרת על עצמה כל שבוע — הופכת לאוטומטית.',
  },
  {
    number: '02',
    title: 'העסק עובד גם כשאתם לא',
    body: 'דוחות, מעקבים ותזכורות שרצות עצמאית — כל יום, כל חודש.',
  },
  {
    number: '03',
    title: 'עוזר דיגיטלי שמכיר את העסק',
    body: 'עונה, מסכם, מכין ובודק — זמין בכל רגע.',
  },
  {
    number: '04',
    title: 'סדר בידע של הארגון',
    body: 'המידע העסקי מאורגן, נגיש, ועובד בשבילכם.',
  },
  {
    number: '05',
    title: 'הצוות שלכם לומד לעבוד נכון',
    body: 'הדרכה אישית ולצוות — היכולת נשארת אצלכם.',
  },
  {
    number: '06',
    title: 'חוות דעת בלתי תלויה',
    body: 'קיבלתם הצעת AI מספק? אבדוק בשבילכם אם היא נכונה, ובאיזה מחיר.',
  },
]

export function Problems() {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <section id="problems" className="problems">
      <div className="container">
        <p className="eyebrow">השירותים</p>
        <h2 className="problems__title">
          דברים שאני פותר.
        </h2>
        <div ref={ref} className="problems__grid">
          {PROBLEMS.map((problem, index) => (
            <article
              key={problem.number}
              className={`problems__card reveal${inView ? ' in-view' : ''}`}
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              <span className="problems__number">{problem.number}</span>
              <h3 className="problems__card-title">{problem.title}</h3>
              <p className="problems__card-body">{problem.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
