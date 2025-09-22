import type { Photo } from './Photo'

export interface ReportPage {
    id: string
    title: string
    content: string
    photos: Photo[]
    order: number
    layout: {
        columns: number
        photoOrder: number[]
    }
}
