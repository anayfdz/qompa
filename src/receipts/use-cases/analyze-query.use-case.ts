import { ReceiptsRepository } from "../receipts.repository"

export class AnalyzeQueryUseCase {
  constructor(private readonly repo: ReceiptsRepository) {}

  async handle(question: string): Promise<string> {
    const lower = question.toLowerCase()
    const match = lower.match(/validados en (\w+)/)

    if (!match) return 'No se pudo entender la pregunta.'

    const month = match[1]

    const monthMap = {
      enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
      julio: 7, agosto: 8, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12
    } as const

    type MonthName = keyof typeof monthMap

    if (!(month in monthMap)) return 'Mes no reconocido.'

    const monthNum = monthMap[month as MonthName]
    const total = await this.repo.sumValidatedInMonth(monthNum)

    return `El total de comprobantes validados en ${month} es S/. ${total.toFixed(2)}`
  }
}
