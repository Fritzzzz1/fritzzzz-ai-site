import './ResultStrip.css'

const RESULTS = ['חיסכון שעות עבודה', 'מניעת טעויות', 'שקט נפשי']

export function ResultStrip() {
  return (
    <div className="result-strip">
      <div className="container">
        <ul className="result-strip__row">
          {RESULTS.map((label) => (
            <li key={label} className="result-strip__cell">
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
