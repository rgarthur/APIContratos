export const PRODUCT_OPTIONS = [
  'FinanciamentoImobiliario',
  'CartaoDeCredito',
  'CreditoPessoal',
  'FinanciamentoVeiculo',
  'ChequeEspecial',
]

export function normalizeProductName(value) {
  if (value === undefined || value === null || value === '') {
    return ''
  }

  if (typeof value === 'number') {
    return PRODUCT_OPTIONS[value] ?? String(value)
  }

  const text = String(value)

  if (/^\d+$/.test(text)) {
    return PRODUCT_OPTIONS[Number(text)] ?? text
  }

  return text
}

export function formatProductName(value) {
  const normalized = normalizeProductName(value)
  return normalized || '-'
}
