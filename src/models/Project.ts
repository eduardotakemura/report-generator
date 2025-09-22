import { ProjectStatus } from "./ProjectStatus"
import type { Report } from "./Report"
import type { Photo } from "./Photo"

export interface Project {
    id: string
    name: string
    address: string
    status: ProjectStatus
    photos: Photo[] // all project photos
    reports: Report[] // reports history
    createdAt: Date
    lastModified: Date
}
