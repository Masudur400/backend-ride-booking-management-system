"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IBookingStatus = void 0;
var IBookingStatus;
(function (IBookingStatus) {
    IBookingStatus["CANCELLED"] = "CANCELLED";
    IBookingStatus["REQUESTED"] = "REQUESTED";
    IBookingStatus["ACCEPTED"] = "ACCEPTED";
    IBookingStatus["PICKED_UP"] = "PICKED_UP";
    IBookingStatus["IN_TRANSIT"] = "IN_TRANSIT";
    IBookingStatus["COMPLETED"] = "COMPLETED";
})(IBookingStatus || (exports.IBookingStatus = IBookingStatus = {}));
