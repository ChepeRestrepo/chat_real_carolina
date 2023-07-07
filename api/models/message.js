import mongoose from "mongoose";
//Se crea el esquema de la DB

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  // recipient: {
  //   type: String,
  //   required: true,
  // },
  // date: {
  //   type: Date,
  //   default: Date.now,
  // },
});
messageSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
