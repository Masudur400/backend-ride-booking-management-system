import httpStatus from 'http-status-codes';
import AppError from "../../errorHandler/AppError";
import { IApply, IWant } from "./apply.interface";
import { Apply } from "./apply.model";
import { User } from '../user/user.model';
import { Role } from '../user/user.interface'; 
import { QueryBuilder } from '../../utils/queryBuilder';
import { HydratedDocument } from 'mongoose';
import { applySearchableFields } from './applyConstant';




const createApplication = async (payload: IApply) => {
  const { userId, want, email  } = payload; 
  const isApplyExist = await Apply.findOne({ userId });
  if (isApplyExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You have already applied');
  } 
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  } 
  if (isUserExist.role !== Role.USER) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Only users can apply');
  } 
  const application = await Apply.create({
    userId,
    want,
    email 
  }); 
  return application;
}; 


const getMyApplication = async (userId: string) => {
    const application = await Apply.find({ userId });
    if (!application) {
        throw new AppError(httpStatus.NOT_FOUND, "Application not found");
    }
    return application;
};


const cancelApplication = async (userId: string) => {
    const application = await Apply.findOne({ userId });
    if (!application) {
        throw new AppError(httpStatus.NOT_FOUND, "Application not found");
    }
    if (application.isApproved) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot cancel an approved application");
    }
    const result = await Apply.findOneAndDelete({ userId });
    return result;
}; 


const getAllApplications = async (query: Record<string, string>) => { 
  const queryBuilder = new QueryBuilder<HydratedDocument<IApply>>(Apply.find(), query); 
  const applicationData = queryBuilder
    .search(applySearchableFields)
    .pagination(); 
  const [rawData, meta] = await Promise.all([
    applicationData.build(),
    queryBuilder.getMeta(),
  ]); 
  const userIds = rawData.map(app => app.userId.toString()); 
  const users = await User.find(
    { _id: { $in: userIds } },
    { name: 1, email: 1 }
  ); 
  const userMap = users.reduce((acc: Record<string, { name: string; email: string }>, user) => {
    acc[user._id.toString()] = { name: user.name, email: user.email };
    return acc;
  }, {}); 
  const formattedData = rawData.map(app => ({
    ...app.toObject(),
    userId: app.userId.toString(),
    userData: userMap[app.userId.toString()] || null,
  })); 
  return { data: formattedData, meta };
};
 


const approveApplication = async (applyId: string) => {
    const application = await Apply.findById(applyId);
    if (!application) {
        throw new AppError(httpStatus.NOT_FOUND, "Application not found");
    }
    if (application.isApproved) {
        throw new AppError(httpStatus.BAD_REQUEST, "Application already approved");
    }
    const user = await User.findById(application.userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    const requestedRole = application.want;
    const requestedRoleAsRole = requestedRole === IWant.DRIVER ? Role.DRIVER : Role.RIDER;
    if (user.role === requestedRoleAsRole) {
        await Apply.findByIdAndDelete(application._id);
        throw new AppError(httpStatus.BAD_REQUEST, `User is already a ${requestedRole}`);
    }
    const validRoles = {
        DRIVER: Role.DRIVER,
        RIDER: Role.RIDER,
    };
    if (!validRoles[requestedRole]) {
        await Apply.findByIdAndDelete(application._id);
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid role application");
    }
    user.role = requestedRoleAsRole;
    await user.save();
    application.isApproved = true;
    const updatedApplication = await application.save();
    return updatedApplication;
};





export const ApplyService = {
    createApplication,
    getMyApplication,
    cancelApplication,
    getAllApplications,
    approveApplication
};