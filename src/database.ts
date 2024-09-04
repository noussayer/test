import * as mongodb from 'mongodb'
import { Employee } from './employee'

export const collections :{
    employees?: mongodb.Collection<Employee>
 } ={}

 export async function connectToDatabase(uri:string) {
    const client = new mongodb.MongoClient(uri)
    await client.connect()
    const db=client.db("MEAN")
    await applySchemaValidation(db)

    const employeesConnection = db.collection<Employee>('employees')
    collections.employees=employeesConnection;

    
 }

 async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "position", "level"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                position: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                level: {
                    enum: ["junior", "mid", "senior"],
                    description: "can only be one of 'junior', 'mid', or 'senior' and is required"
                }
            }
        }}
    await db.command({
        collMod: 'employees',
        validator: 'jsonSchema'
    }).catch(async (error: mongodb.MongoServerError) =>{
        if (error.codeName === 'NamespaceNotFound'){
            await db.createCollection('employees', {validator: jsonSchema})
        }
    }
    )
    

}
