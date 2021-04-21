export function convertDurationToTimeString(durationInSeconds: number) {
  const hours = Math.floor(durationInSeconds / (60 * 60))
  const minutes = Math.floor(durationInSeconds % (60 * 60) / 60)
  const seconds = durationInSeconds % 60;
  const timeString = [hours, minutes, seconds]
    .map(unit => String(unit).padStart(2, '0'))
    .join(':')

  return timeString;
}