import { Types } from "mongoose";

export enum IWant {
  RIDER = "RIDER",
  DRIVER = "DRIVER",
}

export interface IApply {
  _id?: Types.ObjectId
  userId: Types.ObjectId
  want: IWant
  email:string
//   name:string
  isApproved?: boolean
}
