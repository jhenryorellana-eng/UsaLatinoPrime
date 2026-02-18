import jsPDF from 'jspdf'
import { getWorkflow } from '@/lib/workflows'
import { evaluateCondition } from '@/lib/wizard/conditions'

const fieldLabels: Record<string, string> = {
  // Cónyuge
  spouse_dob: 'Fecha de nacimiento',
  spouse_in_us: 'En EE.UU.',
  marriage_date: 'Fecha de matrimonio',
  spouse_gender: 'Sexo',
  marriage_place: 'Lugar de matrimonio',
  spouse_a_number: 'Número A',
  spouse_last_name: 'Apellido',
  spouse_first_name: 'Nombre',
  spouse_middle_name: 'Segundo nombre',
  spouse_nationality: 'Nacionalidad',
  spouse_immigration_status: 'Estatus migratorio',
  spouse_include_in_application: 'Incluir en solicitud',
  // Hijos
  child_dob: 'Fecha de nacimiento',
  child_in_us: 'En EE.UU.',
  child_gender: 'Sexo',
  child_last_name: 'Apellido',
  child_first_name: 'Nombre',
  child_nationality: 'Nacionalidad',
  child_marital_status: 'Soltero/a',
  child_country_of_birth: 'País de nacimiento',
  child_include_in_application: 'Incluir en solicitud',
  // Residencia
  res_to: 'Hasta',
  res_from: 'Desde',
  res_city: 'Ciudad',
  res_address: 'Dirección',
  res_country: 'País',
  res_state: 'Estado',
  // Empleo
  emp_to: 'Hasta',
  emp_from: 'Desde',
  emp_address: 'Dirección',
  emp_employer: 'Empleador',
  emp_occupation: 'Ocupación',
  // Educación
  edu_to: 'Hasta',
  edu_from: 'Desde',
  edu_type: 'Tipo',
  edu_school: 'Escuela',
  edu_location: 'Ubicación',
}

function getLabel(key: string): string {
  return fieldLabels[key] || key
}

function isISODate(value: unknown): boolean {
  if (typeof value !== 'string') return false
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)
}

function formatDate(value: string): string {
  try {
    const d = new Date(value)
    if (isNaN(d.getTime())) return value
    return d.toLocaleDateString('es-US', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return value
  }
}

function isYearMonthObject(value: unknown): value is { year: number; month: number } {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  const obj = value as Record<string, unknown>
  return 'year' in obj && 'month' in obj && Object.keys(obj).length === 2
}

function formatSingleValue(value: unknown): string {
  if (value === undefined || value === null || value === '') return '\u2014'
  if (typeof value === 'boolean') return value ? 'Si' : 'No'
  if (typeof value === 'string' && isISODate(value)) return formatDate(value)
  if (isYearMonthObject(value)) {
    return `${String(value.month).padStart(2, '0')}/${value.year}`
  }
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${getLabel(k)}: ${formatSingleValue(v)}`)
      .join(', ')
  }
  return String(value)
}

function formatValue(value: unknown): string {
  if (value === undefined || value === null || value === '') return '\u2014'
  if (typeof value === 'boolean') return value ? 'Si' : 'No'
  if (typeof value === 'string' && isISODate(value)) return formatDate(value)
  if (Array.isArray(value)) {
    if (value.length === 0) return '\u2014'
    if (typeof value[0] === 'object') {
      return value
        .map((entry, i) =>
          `[${i + 1}] ` +
          Object.entries(entry)
            .map(([k, v]) => `${getLabel(k)}: ${formatSingleValue(v)}`)
            .join(', ')
        )
        .join(' | ')
    }
    return value.map(v => formatSingleValue(v)).join(', ')
  }
  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${getLabel(k)}: ${formatSingleValue(v)}`)
      .join(', ')
  }
  return String(value)
}

interface CasePDFInput {
  caseNumber: string
  serviceName: string
  serviceSlug: string
  clientName: string
  clientEmail: string
  createdAt: string
  formData: Record<string, unknown>
}

export function generateCasePDF(input: CasePDFInput): jsPDF {
  const { caseNumber, serviceName, serviceSlug, clientName, clientEmail, createdAt, formData } = input
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = margin

  function checkPageBreak(neededSpace: number) {
    if (y + neededSpace > pageHeight - 30) {
      addFooter()
      doc.addPage()
      y = margin
    }
  }

  function addFooter() {
    doc.setFontSize(7)
    doc.setTextColor(160, 160, 160)
    doc.text(`UsaLatinoPrime \u2014 Caso #${caseNumber}`, margin, pageHeight - 12)
    const genDate = new Date().toLocaleString('es-US')
    doc.text(`Generado: ${genDate}`, pageWidth - margin, pageHeight - 12, { align: 'right' })
    doc.setDrawColor(230, 230, 230)
    doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16)
  }

  // === HEADER ===
  doc.setFontSize(18)
  doc.setTextColor(0, 40, 85) // Utah navy blue #002855
  doc.setFont('helvetica', 'bold')
  doc.text('UsaLatinoPrime', margin, y)
  y += 8

  // Gold line (Utah flag)
  doc.setDrawColor(242, 169, 0)
  doc.setLineWidth(0.8)
  doc.line(margin, y, pageWidth - margin, y)
  y += 6

  doc.setFontSize(12)
  doc.setTextColor(80, 80, 80)
  doc.setFont('helvetica', 'normal')
  doc.text(`Caso #${caseNumber} \u2014 ${serviceName}`, margin, y)
  y += 6

  doc.setFontSize(9)
  doc.setTextColor(120, 120, 120)
  doc.text(`Cliente: ${clientName} (${clientEmail})`, margin, y)
  y += 5
  doc.text(`Creado: ${new Date(createdAt).toLocaleDateString('es-US')}`, margin, y)
  y += 10

  // === FORM DATA BY STEPS ===
  const workflow = getWorkflow(serviceSlug)
  const formSteps = workflow?.steps.filter((s) => s.fields && s.fields.length > 0) || []

  for (const step of formSteps) {
    checkPageBreak(20)

    // Section title
    doc.setFontSize(11)
    doc.setTextColor(0, 40, 85) // Utah navy
    doc.setFont('helvetica', 'bold')
    doc.text(`Paso ${step.step}: ${step.title}`, margin, y)
    y += 1.5
    doc.setDrawColor(229, 231, 235)
    doc.setLineWidth(0.3)
    doc.line(margin, y, pageWidth - margin, y)
    y += 5

    for (const field of step.fields!) {
      if (!evaluateCondition(field.conditional, formData)) continue
      const value = formData[field.key]
      const displayValue = formatValue(value)

      // Check if label is long (would overlap with value column)
      const labelMaxWidth = contentWidth * 0.33
      doc.setFontSize(8)
      const labelWidth = doc.getTextWidth(field.label)
      const labelIsLong = labelWidth > labelMaxWidth

      if (labelIsLong) {
        // Long label: render label on its own line, value below
        checkPageBreak(14)

        // Label
        doc.setFontSize(8)
        doc.setTextColor(140, 140, 140)
        doc.setFont('helvetica', 'normal')
        const labelLines = doc.splitTextToSize(field.label, contentWidth)
        doc.text(labelLines, margin, y)
        y += labelLines.length * 3.5 + 1

        // Value below label
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        if (displayValue === '\u2014') {
          doc.setTextColor(180, 180, 180)
        } else {
          doc.setTextColor(40, 40, 40)
        }
        const valueLines = doc.splitTextToSize(displayValue, contentWidth)
        doc.text(valueLines, margin + 2, y)
        y += Math.max(valueLines.length * 4, 5)
      } else {
        // Short label: side by side
        checkPageBreak(10)

        // Label
        doc.setFontSize(8)
        doc.setTextColor(140, 140, 140)
        doc.setFont('helvetica', 'normal')
        doc.text(field.label, margin, y)

        // Value
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        const valueX = margin + contentWidth * 0.38
        const valueWidth = contentWidth * 0.62
        if (displayValue === '\u2014') {
          doc.setTextColor(180, 180, 180)
        } else {
          doc.setTextColor(40, 40, 40)
        }
        const valueLines = doc.splitTextToSize(displayValue, valueWidth)
        doc.text(valueLines, valueX, y)
        y += Math.max(valueLines.length * 4, 5)
      }

      // Subtle separator
      doc.setDrawColor(245, 245, 245)
      doc.setLineWidth(0.15)
      doc.line(margin, y, pageWidth - margin, y)
      y += 3
    }

    y += 4
  }

  // Footer on last page
  addFooter()

  return doc
}
