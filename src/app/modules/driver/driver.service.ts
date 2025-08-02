import { IDriver, IDrivePostStatus } from "./driver.interface";
import AppError from "../../errorHandler/AppError";
import httpStatus from 'http-status-codes'
import { Driver } from "./driver.model";
import { QueryBuilder } from "../../utils/queryBuilder";
import { driverSearchableFields } from "./driverConstant";




const createDriverPost = async (payload: IDriver): Promise<IDriver> => {
    const result = await Driver.create(payload);
    return result
};


const getAllDriverPosts = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Driver.find(), query);
    const driverData = queryBuilder
        .filter()
        .search(driverSearchableFields)
        .sort()
        .fields()
        .pagination();
    const [data, meta] = await Promise.all([
        driverData.build(),
        driverData.getMeta()
    ])
    return { data, meta };
};


const getMyDriverPosts = async (driverId: string, query: Record<string, string>) => {
    const baseQuery = Driver.find({ driverId });
    const queryBuilder = new QueryBuilder(baseQuery, query);
    const driverDataQuery = queryBuilder
        .filter()
        .search(driverSearchableFields)
        .sort()
        .fields()
        .pagination();
    const [data, meta] = await Promise.all([
        driverDataQuery.build(),
        driverDataQuery.getMeta(),
    ]);
    return { data, meta };
};


const updatePostStatus = async (postId: string, postStatus: string) => {
    const validStatuses = Object.values(IDrivePostStatus);
    if (!validStatuses.includes(postStatus.toUpperCase() as IDrivePostStatus)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid post status');
    }
    const updatedPost = await Driver.findByIdAndUpdate(postId, { postStatus: postStatus.toUpperCase() }, { new: true });
    if (!updatedPost) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
    }
    return updatedPost;
};




const deleteMyDriverPost = async (postId: string, driverId: string) => {
    const deletedPost = await Driver.findOneAndDelete({ _id: postId, driverId });
    if (!deletedPost) {
        throw new AppError(httpStatus.NOT_FOUND, "Post not found or unauthorized");
    }
    return deletedPost;
};







export const DriverService = {
    createDriverPost,
    getAllDriverPosts,
    getMyDriverPosts,
    deleteMyDriverPost,
    updatePostStatus,
};