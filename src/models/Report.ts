import type { ReportPage } from "./ReportPage"

export interface Report {
    id: string
    name: string
    details: {
        clientName: string
        number: string
        description: string
        address: string
        engineer: string
        crea: string
    }
    pages: ReportPage[]
    createdAt: Date
}
