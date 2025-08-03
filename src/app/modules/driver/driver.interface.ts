import { Types } from "mongoose";



export enum IDrivePostStatus {
    APPROVED = 'APPROVED',
    BLOCKED = 'BLOCKED'
}

export interface IDriver {
    _id?: Types.ObjectId
    title: string
    from: string
    to: string
    amount: number
    driverId: Types.ObjectId
    driverName: string
    driverEmail: string
    postStatus: IDrivePostStatus
    phoneNumber?: string
    vehicleNumber?: string
    vehicleType?: string
    licenseNumber?: string
    available?: boolean 
}