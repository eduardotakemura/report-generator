export const ProjectStatus = {
    Active: 'Active',
    Completed: 'Completed', 
    Paused: 'Paused',
    Cancelled: 'Cancelled',
    Submitted: 'Submitted'
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];
