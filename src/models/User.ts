import mongoose from '../db/conn';
import { User as IUser} from '../types/User';
const { Schema } = mongoose;

export const User = mongoose.model("User", 
    new Schema<IUser>({
        name: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
    },{ timestamps: true },)
);
