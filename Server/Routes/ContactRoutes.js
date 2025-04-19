import {Router} from "express"
import { searchContacts } from "../Controllers/ContactsController.js";
import {verifyToken} from "../Middlewares/Authmiddleware.js"


const contactsRoutes = Router();

contactsRoutes.post("/search",verifyToken,searchContacts)

export default contactsRoutes