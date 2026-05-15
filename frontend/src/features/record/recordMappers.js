export const EXERCISE_TYPE_EMOJIS = {
  '사이클': '🚴',
  '수영': '🏊',
  '자전거': '🚲',
  '헬스': '🏋️',
  '런닝': '🏃',
  '줄넘기': '🪢',
  '필라테스': '🧘',
  '기타': '···',
}

export function getExerciseTypeEmoji(typeName) {
  return EXERCISE_TYPE_EMOJIS[typeName] ?? '🏃'
}

export function toDietRecordItem(log) {
  return {
    id: String(log.logId),
    logId: log.logId,
    name: log.foodName || '(메뉴)',
    calories: log.logKcal || 0,
    carbs: log.logCarbs || 0,
    protein: log.logProtein || 0,
    fat: log.logFat || 0,
    mealType: log.mealType,
    time: log.ateAt ? new Date(log.ateAt) : null,
    imgUrl: log.imgUrl ?? null,
  }
}

export function toExerciseRecordItem(log) {
  return {
    id: String(log.exerciseId),
    name: log.typeName,
    detail: log.title || log.typeName,
    duration: log.durationMin,
    unit: 'min',
    calories: log.caloriesBurned,
    emoji: getExerciseTypeEmoji(log.typeName),
    typeId: log.typeId,
    exerciseId: log.exerciseId,
  }
}
