import type { ServiceWorkflow, WorkflowStep } from '@/types/wizard'
import { asiloAfirmativoWorkflow } from './asilo-afirmativo'

const courtInfoStep: WorkflowStep = {
  step: 8,
  title: 'Información del Tribunal de Inmigración',
  description: 'Detalles sobre su caso en la corte de inmigración',
  type: 'form',
  fields: [
    {
      key: 'nta_received',
      label: '¿Ha recibido un Notice to Appear (NTA)?',
      type: 'boolean',
      required: true,
    },
    { key: 'nta_date', label: 'Fecha del NTA', type: 'date' },
    {
      key: 'court_location',
      label: 'Ubicación de la corte de inmigración',
      type: 'text',
      required: true,
    },
    {
      key: 'court_date',
      label: 'Fecha de la próxima audiencia',
      type: 'date',
      required: true,
    },
    { key: 'case_number_eoir', label: 'Número de caso EOIR', type: 'text' },
    {
      key: 'previous_hearings',
      label: '¿Ha tenido audiencias previas?',
      type: 'boolean',
    },
    {
      key: 'previous_hearings_details',
      label: 'Detalles de audiencias previas',
      type: 'long_text',
      conditional: 'previous_hearings === true',
    },
    { key: 'has_attorney', label: '¿Tiene abogado actualmente?', type: 'boolean' },
    { key: 'ice_detained', label: '¿Está detenido por ICE?', type: 'boolean' },
    {
      key: 'detention_facility',
      label: 'Centro de detención',
      type: 'text',
      conditional: 'ice_detained === true',
    },
  ],
}

// Take steps 1-7 from afirmativo, add court info step, then docs + review
const baseSteps = asiloAfirmativoWorkflow.steps.slice(0, 7)
const docStep: WorkflowStep = {
  step: 9,
  title: 'Documentos de Soporte',
  description: 'Suba los documentos necesarios para respaldar su caso defensivo de asilo',
  type: 'documents',
}
const reviewStep: WorkflowStep = {
  step: 10,
  title: 'Revisión y Firma',
  description: 'Revise toda la información antes de presentarla al tribunal',
  type: 'review',
}

export const asiloDefensivoWorkflow: ServiceWorkflow = {
  slug: 'asilo-defensivo',
  name: 'Asilo Defensivo',
  steps: [
    ...baseSteps,
    courtInfoStep,
    docStep,
    reviewStep,
  ],
  required_documents: [
    ...asiloAfirmativoWorkflow.required_documents,
    {
      key: 'nta_copy',
      label: 'Copia del Notice to Appear (NTA)',
      required: true,
      category: 'corte',
      helper: 'El documento que le notificó de los procedimientos de deportación',
    },
    {
      key: 'court_notices',
      label: 'Notificaciones del tribunal',
      required: true,
      category: 'corte',
      multiple: true,
      helper: 'Todas las notificaciones recibidas del tribunal de inmigración',
    },
    {
      key: 'prior_orders',
      label: 'Órdenes previas del tribunal',
      required: false,
      category: 'corte',
      multiple: true,
      helper: 'Cualquier orden previa del juez de inmigración',
    },
  ],
  eligibility_questions: [
    {
      id: 'in_us',
      question: '¿Se encuentra actualmente en Estados Unidos?',
      type: 'boolean',
      required_answer: true,
      fail_message: 'Debe encontrarse físicamente en EE.UU. para solicitar asilo defensivo.',
    },
    {
      id: 'in_removal',
      question: '¿Está actualmente en proceso de deportación (removal proceedings)?',
      type: 'boolean',
      required_answer: true,
      fail_message:
        'El asilo defensivo es para personas en proceso de deportación. Si no está en proceso, considere asilo afirmativo.',
    },
    {
      id: 'persecution_basis',
      question: '¿Cuál es la base de su temor de persecución?',
      type: 'multi_select',
      options: [
        'Raza',
        'Religión',
        'Nacionalidad',
        'Opinión política',
        'Pertenencia a un grupo social particular',
      ],
      min_selections: 1,
      fail_message: 'El asilo requiere al menos una base protegida de persecución.',
    },
  ],
}
