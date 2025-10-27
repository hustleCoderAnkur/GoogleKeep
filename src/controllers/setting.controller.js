import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Settings } from "../Models/setting.modal.js";

const getUserSetting = asyncHandler(async (req, res) => {

    const userId = req.user._id
    let setting = await Settings.findOne({ userId })

    if (!setting) {
        setting = await Settings.create({ userId })
    }

    return res
        .status(200)
        .json(new ApiResponse(200, setting, "get user Setting successfully"))
})

const updateSetting = asyncHandler(async (req, res) => {

    const userId = req.user._id
    const updateData = req.body

    const update = await Settings.findOneAndUpdate(
        { userId },
        { $set: updateData },
        { new: true, upsert: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, update, "updated user setting successfully"))
})

export {
    getUserSetting,
    updateSetting
}