import { Model, Document } from 'mongoose';
import { createSchema, Type, typedModel } from 'ts-mongoose';
import UserModel from "../user/user";

const {User, UserSchema} = UserModel;

const MessageText = createSchema(
    {
        text: Type.string({ required: true })
    },
    {
        _id: false
    }
);

/*
TODO: building out structure for attachment types
*/

const MessageAttachment = createSchema(
    {

    },
    {
        _id: false
    }

);

const Message = createSchema(
    //TODO
);

const GroupMember = createSchema(
    {

    }
);

const GroupSchema = createSchema(
    {
        title: Type.string({ required: true }),
        creator: null,
        messages: Type.array().of(Message),
        members: null
    }
);

const Group = typedModel('Group', GroupSchema);

export default Group;

/**
 *  Necessary functions:
 *      -on user delete
 *  
 */