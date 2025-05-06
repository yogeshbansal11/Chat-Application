
import {Router} from "express"
import { createChannel, getChannelMessages, getUserChannels } from "../Controllers/ChannelsController.js";
import {verifyToken} from "../Middlewares/Authmiddleware.js"

const channelRoutes = Router();

channelRoutes.post("/create-channel",verifyToken,createChannel)
channelRoutes.get("/get-user-channels",verifyToken,getUserChannels)
channelRoutes.get("/get-channel-messages/:channelId",verifyToken,getChannelMessages)

export default channelRoutes
