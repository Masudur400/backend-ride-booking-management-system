import AppError from "../../errorHandler/AppError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { IRider, IRiderPostStatus } from "./ride.interface";
import { Rider } from "./ride.model";
import { riderSearchableFields } from "./rideConstant";
import httpStatus from 'http-status-codes'




const createRiderPost = async (payload: IRider): Promise<IRider> => {
    const result = await Rider.create(payload)
    return result
};


const getAllRiderPosts = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Rider.find(), query)
    const driverData = queryBuilder
        .filter()
        .search(riderSearchableFields)
        .sort()
        .fields()
        .pagination();
    const [data, meta] = await Promise.all([
        driverData.build(),
        driverData.getMeta()
    ])
    return { meta, data }
};


const getMyRiderPosts = async (riderId: string, query: Record<string, string>) => {
    const baseQuery = Rider.find({ riderId })
    const queryBuilder = new QueryBuilder(baseQuery, query)
    const driverDataQuery = queryBuilder
        .filter()
        .search(riderSearchableFields)
        .sort()
        .fields()
        .pagination()
    const [data, meta] = await Promise.all([
        driverDataQuery.build(),
        driverDataQuery.getMeta(),
    ])
    return { meta, data }
};


const updatePostStatus = async (postId: string, postStatus: string) => {
    const validStatuses = Object.values(IRiderPostStatus)
    if (!validStatuses.includes(postStatus.toUpperCase() as IRiderPostStatus)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid post status')
    }
    const updatedPost = await Rider.findByIdAndUpdate(postId, { postStatus: postStatus.toUpperCase() }, { new: true })
    if (!updatedPost) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found')
    }
    return updatedPost
};



const deleteMyRiderPost = async (postId: string, riderId: string) => {
    const deletedPost = await Rider.findOneAndDelete({ _id: postId, riderId });
    if (!deletedPost) {
        throw new AppError(httpStatus.NOT_FOUND, "Post not found")
    }
    return deletedPost
};




export const RiderService = {
    createRiderPost,
    getAllRiderPosts,
    getMyRiderPosts,
    deleteMyRiderPost,
    updatePostStatus,
}