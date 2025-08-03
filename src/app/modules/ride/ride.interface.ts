import { Types } from "mongoose";



export enum IRiderPostStatus {
    APPROVED = 'APPROVED',
    BLOCKED = 'BLOCKED'
}

export interface IRider {
    _id?: Types.ObjectId
    title: string
    from: string
    to: string
    amount: number
    riderId: Types.ObjectId
    riderName: string
    riderEmail: string
    postStatus: IRiderPostStatus
    phoneNumber?: string
    vehicleNumber?: string
    vehicleType?: string
    licenseNumber?: string
    available?: boolean
}