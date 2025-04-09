import { model, Document, Schema, Types } from 'mongoose';

/* ===================== */

export interface IUser extends Document<Types.ObjectId> {
  email: string;
  passwordHash: string;

  fullName: string;
  gender?: 'male' | 'female' | 'notSpecified';
  bio?: string;
  dateOfBirth?: Date;

  addressCountry?: string;
  addressCity?: string;
  addressArea?: string;
  addressZip?: string;

  isBanned: boolean;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    fullName: { type: String, required: true },
    gender: {
      type: String,
      enum: ['male', 'female', 'notSpecified'],
      default: 'notSpecified',
    },
    bio: String,
    dateOfBirth: Date,
    addressCountry: String,
    addressCity: String,
    addressArea: String,
    addressZip: String,

    isBanned: { type: Boolean, default: false },
  },
  {
    toObject: { virtuals: true },
    toJSON: {
      virtuals: true,
      transform(doc, ret, options) {
        // Remove passwordHash from any JSON response
        delete ret.passwordHash;
        return ret;
      },
    },
  },
);

// prettier-ignore
export const UserModel = model('User', userSchema);
