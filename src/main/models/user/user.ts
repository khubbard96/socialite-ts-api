import { Model, Document } from 'mongoose';
import { createSchema, Type, typedModel } from 'ts-mongoose';

const EmailSchema = createSchema(
  {
    email: Type.string({ required: true, unique: true }),
  },
  {
    _id: false,
    timestamps: false
  }
);

const PhoneSchema = createSchema(
  {
    phoneNumber: Type.number({ required: true }),
    name: Type.string(),
  },
  {
    _id: false,
    timestamps: false,
  }
);

const UserSchema = createSchema(
  {
    id: Type.objectId({ required: true }),
    name: Type.string({ required: true }),
    phone: Type.schema({ required: true }).of(PhoneSchema),
    email: Type.schema({ required: true }),
  },
  { timestamps: { createdAt: true } }
);

const User = typedModel('User', UserSchema);

export default {User, UserSchema};


