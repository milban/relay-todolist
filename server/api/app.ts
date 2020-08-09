import { schema } from 'nexus'
import { db } from './db'

schema.addToContext(() => {
    return {
        db
    }
})