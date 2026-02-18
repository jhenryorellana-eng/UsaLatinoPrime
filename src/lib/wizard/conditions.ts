/**
 * Evaluates a condition string against form data.
 * Supports: === comparison, !== comparison, includes (for arrays)
 * NO eval() - uses simple string parsing.
 */
export function evaluateCondition(
  condition: string | undefined,
  formData: Record<string, unknown>
): boolean {
  if (!condition) return true

  // Handle "includes" for multi_select arrays
  if (condition.includes(' includes ')) {
    const [key, rawValue] = condition.split(' includes ')
    const fieldKey = key.trim()
    const value = rawValue.trim().replace(/^'|'$/g, '')
    const fieldValue = formData[fieldKey]
    if (Array.isArray(fieldValue)) {
      return fieldValue.includes(value)
    }
    return false
  }

  // Handle "!=="
  if (condition.includes(' !== ')) {
    const [key, rawValue] = condition.split(' !== ')
    const fieldKey = key.trim()
    const value = parseConditionValue(rawValue.trim())
    return formData[fieldKey] !== value
  }

  // Handle "==="
  if (condition.includes(' === ')) {
    const [key, rawValue] = condition.split(' === ')
    const fieldKey = key.trim()
    const value = parseConditionValue(rawValue.trim())
    return formData[fieldKey] === value
  }

  return true
}

function parseConditionValue(raw: string): unknown {
  if (raw === 'true') return true
  if (raw === 'false') return false
  if (raw === 'null') return null
  if (raw.startsWith("'") && raw.endsWith("'")) return raw.slice(1, -1)
  if (raw.startsWith('"') && raw.endsWith('"')) return raw.slice(1, -1)
  const num = Number(raw)
  if (!isNaN(num)) return num
  return raw
}
