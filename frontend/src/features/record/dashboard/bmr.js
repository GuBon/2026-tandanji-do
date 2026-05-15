export function calcBMR(gender, weight, height, age) {
  if (!weight || !height || !age) return null
  if (gender === 'M') return Math.round(88.4 + 13.4 * weight + 4.8 * height - 5.68 * age)
  if (gender === 'F') return Math.round(447.6 + 9.25 * weight + 3.1 * height - 4.33 * age)
  return null
}
