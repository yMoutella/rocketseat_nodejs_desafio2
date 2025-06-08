declare module 'knex/types/tables' {
    export interface Tables {
        user: {
            id: string,
            name: string,
            created_at: string
        }
    }
}