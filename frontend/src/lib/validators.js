const GENDERS = new Set([
  'mulher',
  'homem',
  'nao_binario',
  'prefiro_nao_dizer',
])

export const GENDER_OPTIONS = [
  { value: 'mulher', label: 'Mulher' },
  { value: 'homem', label: 'Homem' },
  { value: 'nao_binario', label: 'Não binário' },
  { value: 'prefiro_nao_dizer', label: 'Prefiro não dizer' },
]

export function onlyDigits(value) {
  return String(value ?? '').replace(/\D/g, '')
}

export function formatCpf(value) {
  const digits = onlyDigits(value).slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function cpfCheckDigits(base) {
  let sum = 0
  for (let i = 0; i < base.length; i += 1) {
    sum += Number(base[i]) * (base.length + 1 - i)
  }
  const mod = (sum * 10) % 11
  return mod === 10 ? 0 : mod
}

export function isValidCpf(value) {
  const cpf = onlyDigits(value)
  if (cpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false

  const d1 = cpfCheckDigits(cpf.slice(0, 9))
  if (d1 !== Number(cpf[9])) return false

  const d2 = cpfCheckDigits(cpf.slice(0, 10))
  return d2 === Number(cpf[10])
}

export function ageFromBirthDate(birthDate) {
  if (!birthDate) return null
  const birth = new Date(`${birthDate}T00:00:00`)
  if (Number.isNaN(birth.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age -= 1
  }
  return age
}

export function isAdult(birthDate) {
  const age = ageFromBirthDate(birthDate)
  return age !== null && age >= 18
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email ?? '').trim())
}

export function isValidFullName(name) {
  const trimmed = String(name ?? '').trim().replace(/\s+/g, ' ')
  if (trimmed.length < 3) return false
  const parts = trimmed.split(' ').filter(Boolean)
  return parts.length >= 2 || trimmed.length >= 5
}

export function validateSignup({
  fullName,
  email,
  password,
  cpf,
  birthDate,
  gender,
}) {
  const errors = {}

  if (!isValidFullName(fullName)) {
    errors.fullName = 'Informe nome e sobrenome.'
  }

  if (!isValidEmail(email)) {
    errors.email = 'E-mail inválido.'
  }

  if (String(password ?? '').length < 8) {
    errors.password = 'A senha precisa ter pelo menos 8 caracteres.'
  }

  if (!isValidCpf(cpf)) {
    errors.cpf = 'CPF inválido.'
  }

  if (!birthDate) {
    errors.birthDate = 'Informe a data de nascimento.'
  } else if (!isAdult(birthDate)) {
    errors.birthDate = 'É necessário ter 18 anos ou mais.'
  }

  if (!GENDERS.has(gender)) {
    errors.gender = 'Selecione uma opção de gênero.'
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateLogin({ email, password }) {
  const errors = {}

  if (!isValidEmail(email)) {
    errors.email = 'E-mail inválido.'
  }

  if (!password) {
    errors.password = 'Informe a senha.'
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
  }
}

export function initialsFromName(name) {
  const parts = String(name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}
