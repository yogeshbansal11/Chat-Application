import Message from "../Modules/MessagesModule.js"
import {mkdirSync, rename, renameSync} from 'fs'
import path from 'path';

export const getMessages = async (req, res, next) => {
  try {

      const user1 = req.userId;
      const user2 = req.body.id;

      if(!user1 || !user2){
        return res.status(400).send("Both user ID's are required !!")
      }
  
      const messages = await Message.find({
        $or:[
          {sender:user1, recipient: user2},
          {sender:user2, recipient: user1},
        ]
      }).sort({timestamp: 1})
      return res.status(200).json({messages})
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server error");
  }
};


export const uploadFile = async (req, res, next) => {
  try {
    const filePath = `/uploads/files/${req.file.filename}`;

    if(!req.file){
      return res.status(400).send("file is required");
    }
    const date = Date.now();
    let fileDir = `uploads/file/${date}`
    let fileName = `${fileDir}/${req.file.originalname}`

    mkdirSync(fileDir,{recursive: true});
    renameSync(req.file.path, fileName);

      return res.status(200).json({filePath: fileName})
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal server error");
  }
};




// export const uploadFile = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send("File is required");
//     }

//     const date = Date.now();
//     const fileDir = path.join(__dirname, `../uploads/file/${date}`);
//     const fileName = `${fileDir}/${req.file.originalname}`;

//     // Ensure the directory exists
//     mkdirSync(fileDir, { recursive: true });

//     // Move the uploaded file to the desired directory
//     renameSync(req.file.path, fileName);

//     // Construct the relative URL for the file (the path to be accessed by the client)
//     const fileUrl = `/uploads/file/${date}/${req.file.originalname}`;

//     return res.status(200).json({ filePath: fileUrl });
//   } catch (error) {
//     console.log({ error });
//     return res.status(500).send("Internal server error");
//   }
// };