import { useEffect, useState } from 'react'

type TripCountdownProps = {
  targetDate: Date
}

const getTimeParts = (targetDate: Date, now: Date) => {
  const totalSeconds = Math.max(0, Math.floor((targetDate.getTime() - now.getTime()) / 1000))
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds }
}

export function TripCountdown({ targetDate }: TripCountdownProps) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  const { days, hours, minutes, seconds } = getTimeParts(targetDate, now)

  return (
    <div className="countdown-card" role="timer" aria-live="polite">
      <div className="countdown-grid">
        <div className="countdown-unit">
          <span className="countdown-number">{days}</span>
          <span className="countdown-label">Days</span>
        </div>
        <div className="countdown-unit">
          <span className="countdown-number">{String(hours).padStart(2, '0')}</span>
          <span className="countdown-label">Hours</span>
        </div>
        <div className="countdown-unit">
          <span className="countdown-number">{String(minutes).padStart(2, '0')}</span>
          <span className="countdown-label">Min</span>
        </div>
        <div className="countdown-unit">
          <span className="countdown-number">{String(seconds).padStart(2, '0')}</span>
          <span className="countdown-label">Sec</span>
        </div>
      </div>
    </div>
  )
}
