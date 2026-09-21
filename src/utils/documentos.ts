export function somenteDigitos(value: string): string {
  return value.replace(/\D/g, '')
}

function todosDigitosIguais(value: string): boolean {
  return /^(\d)\1+$/.test(value)
}

export function validarCpf(value: string): boolean {
  const cpf = somenteDigitos(value)
  if (cpf.length !== 11 || todosDigitosIguais(cpf)) return false

  const calcular = (base: string, pesoInicial: number) => {
    const soma = [...base].reduce((total, digito, index) => total + Number(digito) * (pesoInicial - index), 0)
    const resto = (soma * 10) % 11
    return resto === 10 ? 0 : resto
  }

  const primeiro = calcular(cpf.slice(0, 9), 10)
  const segundo = calcular(cpf.slice(0, 10), 11)
  return primeiro === Number(cpf[9]) && segundo === Number(cpf[10])
}

export function validarCnpj(value: string): boolean {
  const cnpj = somenteDigitos(value)
  if (cnpj.length !== 14 || todosDigitosIguais(cnpj)) return false

  const calcular = (base: string, pesos: number[]) => {
    const soma = [...base].reduce((total, digito, index) => total + Number(digito) * pesos[index], 0)
    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
  }

  const primeiro = calcular(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const segundo = calcular(cnpj.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  return primeiro === Number(cnpj[12]) && segundo === Number(cnpj[13])
}

export function mascararCpf(value: string): string {
  return somenteDigitos(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function mascararCnpj(value: string): string {
  return somenteDigitos(value)
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}
