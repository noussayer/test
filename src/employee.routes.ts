import * as express from 'express'
import * as mongodb from 'mongodb'
import { collections } from './database'

export const employeeRouter = express.Router()
employeeRouter.use(express.json())

employeeRouter.post('/', async (req,res) => {
    try{
        const employee = req.body;
        const result = await collections.employees?.insertOne(employee)
        if (result?.acknowledged){
            res.status(201).send('Created a new Employee')
        }
        else {
            res.status(500).send('Failed to create new employee')
        }

    }catch(error){
        console.error(error)
        res.status(400)

    }
})


employeeRouter.get('/', async(_req,res) =>{
    try{
        const employees = await collections.employees?.find({}).toArray()
        res.status(200).send(employees)

    }

    catch(error){
        res.status(500)
    }
})

employeeRouter.get('/:id', async (req, res) => {
    try{
        const id = req?.params?.id
        const query = {_id: new mongodb.ObjectId(id)}
        const employee = await collections.employees?.findOne(query)
        if (employee) {
            res.status(200).send(employee)
        }
        else {
            res.status(404).send('Failed to find an employee')
        }

    }
    catch(error){
        res.status(404).send('Failed to found employee')
    }
})

employeeRouter.put('/:id', async (req, res) => {
    try {
        const id = req?.params?.id
        const employee = req.body
        const query = {_id: new mongodb.ObjectId(id)}
        const result = await collections.employees?.updateOne(query, {$set: employee})
        if (result && result.matchedCount){
            res.status(200).send('updated an employee')
        }
        else if (!result?.matchedCount) {
            res.status(404).send('Failed to updated')

        }
        else {
            res.status(404).send('Failed to updated')

        }

    }catch(error){
        res.status(400)
    }
})

employeeRouter.delete('/:id', async (req, res)=> {
    try{
        const id = req?.params?.id
        const query = {_id: new mongodb.ObjectId(id)}
        const result = await collections.employees?.deleteOne(query)
        if (result && result.deletedCount) {
            res.status(202).send('Removed an employee')
        }
        else if (!result){
            res.status(400).send('Failed to remove an employee')

        }
        else {
            res.status(404).send('Failed to remove an employee')
        }

    }catch(error){
        console.error(error)
        res.status(400)
    }
})