import express, { Request, Response } from 'express'


const app = express()



app.get('/', (req: Request, res:Response)=>{
    res.status(200).json({
        message:'welcome to ride booking management system...!'
    })
})



export default app