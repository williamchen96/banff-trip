type DateChipsProps = {
  tripDays: { dateLabel: string }[]
  selectedIndex: number
  onSelectDate: (index: number) => void
}

export function DateChips({ tripDays, selectedIndex, onSelectDate }: DateChipsProps) {
  return (
    <nav className="date-nav" aria-label="Trip dates">
      <div className="date-chips" role="list">
        {tripDays.map((tripDay, index) => {
          const [month, day] = tripDay.dateLabel.split(' ')

          return (
            <button
              key={tripDay.dateLabel}
              type="button"
              className={`date-chip ${index === selectedIndex ? 'active' : ''}`}
              onClick={() => onSelectDate(index)}
              aria-current={index === selectedIndex ? 'date' : undefined}
            >
              <span>{month}</span>
              <strong>{day}</strong>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
