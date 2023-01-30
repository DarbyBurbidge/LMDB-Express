import { Database } from "lmdb"

export const checkKey = (key: string, db: Database): boolean => {
    const result = db.get(key)
    return result ? true : false
}