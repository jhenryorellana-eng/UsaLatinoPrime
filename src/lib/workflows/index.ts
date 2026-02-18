import { asiloAfirmativoWorkflow } from './asilo-afirmativo'
import { asiloDefensivoWorkflow } from './asilo-defensivo'
import { visaJuvenilWorkflow } from './visa-juvenil'
import { cambioDeCorteWorkflow } from './cambio-de-corte'
import { taxesWorkflow } from './taxes'
import { itinNumberWorkflow } from './itin-number'
import { ajusteDeEstatusWorkflow } from './ajuste-de-estatus'
import { mocionesWorkflow } from './mociones'
import { licenciaDeConducirWorkflow } from './licencia-de-conducir'
import type { ServiceWorkflow } from '@/types/wizard'

const workflows: Record<string, ServiceWorkflow> = {
  'asilo-afirmativo': asiloAfirmativoWorkflow,
  'asilo-defensivo': asiloDefensivoWorkflow,
  'visa-juvenil': visaJuvenilWorkflow,
  'cambio-de-corte': cambioDeCorteWorkflow,
  'taxes': taxesWorkflow,
  'itin-number': itinNumberWorkflow,
  'ajuste-de-estatus': ajusteDeEstatusWorkflow,
  'mociones': mocionesWorkflow,
  'licencia-de-conducir': licenciaDeConducirWorkflow,
}

export function getWorkflow(slug: string): ServiceWorkflow | null {
  return workflows[slug] || null
}

export function getAllWorkflows(): ServiceWorkflow[] {
  return Object.values(workflows)
}

export function getWorkflowSlugs(): string[] {
  return Object.keys(workflows)
}

export {
  asiloAfirmativoWorkflow,
  asiloDefensivoWorkflow,
  visaJuvenilWorkflow,
  cambioDeCorteWorkflow,
  taxesWorkflow,
  itinNumberWorkflow,
  ajusteDeEstatusWorkflow,
  mocionesWorkflow,
  licenciaDeConducirWorkflow,
}
