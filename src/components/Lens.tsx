import './Lens.css'

export function Lens() {
  return (
    <div className="lens">
      <div className="lens__stage">
      <svg
        className="lens__svg"
        viewBox="-40 -40 380 380"
        role="img"
        aria-label="דיאגרמת האבחון: מרכז המחובר לשלושה צמתים — ללמד, לבנות לשימוש, מערכת שלמה"
      >
        <circle className="lens__ring" cx="150" cy="150" r="108" pathLength={1} />
        <line className="lens__spoke lens__spoke--1" x1="150" y1="150" x2="56" y2="56" pathLength={1} />
        <line className="lens__spoke lens__spoke--2" x1="150" y1="150" x2="244" y2="56" pathLength={1} />
        <line className="lens__spoke lens__spoke--3" x1="150" y1="150" x2="150" y2="282" pathLength={1} />

        <circle className="lens__center" cx="150" cy="150" r="24" />

        <circle className="lens__node lens__node--1" cx="56" cy="56" r="17" />
        <circle className="lens__node lens__node--2" cx="244" cy="56" r="17" />
        <circle className="lens__node lens__node--3" cx="150" cy="282" r="17" />

        <line className="lens__handle" x1="234" y1="234" x2="279" y2="279" strokeLinecap="round" />
      </svg>

      <span className="lens__hit lens__hit--1" aria-hidden="true" />
      <span className="lens__hit lens__hit--2" aria-hidden="true" />
      <span className="lens__hit lens__hit--3" aria-hidden="true" />

      <span className="lens__label lens__label--1">ללמד</span>
      <span className="lens__label lens__label--2">לבנות לשימוש</span>
      <span className="lens__label lens__label--3">מערכת שלמה</span>
      </div>

      <p className="lens__caption">ולפעמים המסקנה: לא צריך לבנות כלום.</p>
    </div>
  )
}
