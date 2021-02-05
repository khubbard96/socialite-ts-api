import { Document, Model, model, Types, Schema, Query } from "mongoose";

/* MESSAGE SCHEMA */
const GroupMessageSchema: Schema = new Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true
        },
        sender: {
            type: String,
            required: true,
            immutable: true
        },
        /*timestamp: {
            type: String,
            required: true,
            default: Date.now
        }*/
    },
    {
        timestamps: true
    }
);

export interface IGroupMessage {
    text: string,
    sender: string,
}

const GroupMemberSchema: Schema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            required: true,
            index: true
        },
        groupPermissions: {
            type: [String],
            required: true
        }
    },
    {
        _id: false
    }
);

export interface IGroupMember {
    userId: string
    groupPermissions: string[]
}

const GroupSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 64,
        },
        creator: {
            type: Types.ObjectId,
            required: true
        },
        members: {
            type: [GroupMemberSchema],
            required: true,
            unique: true,
        },
        messages: {
            type: [GroupMessageSchema],
            required: true,
        }
    }
);

GroupSchema.methods.postMessage = function (this:IGroup, message: IGroupMessage): Promise<IGroup> {
    this.messages.push(message);
    return this.save();
}


GroupSchema.statics.findByGroupMember = function (member: string): Query<IGroup[], IGroup, IGroup> {
    return Group.find({
        'members.userId': member
    });
}

GroupSchema.statics.findByIdAndGroupMember = function (member: string, groupId: string): Query<IGroup, IGroup, IGroup> {
    if (groupId.match(/^[0-9a-fA-F]{24}$/)) {
        return Group.find({
            _id: groupId,
            'members.userId': member
        });
    } else {
        return null;
    }
}

GroupSchema.statics.findByCreator = function (creator: string): Query<IGroup[], IGroup, IGroup> {
    return Group.find({
        creator
    });
}

GroupSchema.statics.createFromTitleAndCreator = function (title: string, creator: string): Promise<IGroup> {
    return Group.create({
        title,
        creator,
        members: [{
            userId: creator,
            groupPermissions: []
        }],
        messages: []
    });
}

// instance methods go here
export interface IGroup extends Document {
    title: string,
    creator: string,
    members: IGroupMember[],
    messages: IGroupMessage[]

    postMessage(message: IGroupMessage): Promise<IGroup>;
}

// statics go here
export interface IGroupModel extends Model<IGroup> {
    createFromTitleAndCreator(title: string, creator: string): Promise<IGroup>
    findByGroupMember(member: string): Query<IGroup[], IGroup, IGroup>
    findByCreator(creator: string): Query<IGroup[], IGroup, IGroup>
    findByIdAndGroupMember(member: string, groupId: string): Query<IGroup, IGroup, IGroup>
}

const Group: IGroupModel = model<IGroup, IGroupModel>('Group', GroupSchema, 'groups');

export default Group;


