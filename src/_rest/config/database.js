import { connect } from "mongoose";

export const connectDatabase = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) console.log("no database uri"); // end process
  await connect(uri, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  });
  console.log("mongodb connection established..");
};
