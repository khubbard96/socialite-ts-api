import { Document, Model, model, Types, Schema, Query } from "mongoose";
import User from "../user";
import _ from "underscore";
import { v4 as uuidv4 } from 'uuid';

/* MESSAGE SCHEMA */
const GroupMessageSchema: Schema = new Schema(
    {
        _id: {
            type: String,
            required: true
        },
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
    },
    {
        timestamps: true
    }
);



export interface IGroupMessage {
    _id:string,
    text: string,
    sender: string,
}

const GroupMemberSchema: Schema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            required: true,
            index: true,
            validate: {
                async validator (v:Types.ObjectId) {
                    return !!(await User.findById(v))
                },
                message: props => `No user found with id ${props.value}`
            },
            unique:true
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
        owner: {
            type: Types.ObjectId,
            required: true
        },
        members: {
            type: [GroupMemberSchema],
            required: true
        },
        messages: {
            type: [GroupMessageSchema],
            required: true,
        }
    }
);

GroupSchema.methods.postMessage = function (this:IGroup, text: string, sender: string): Promise<IGroup> {
    this.messages.push(
        {
            _id: uuidv4(),
            text,
            sender
        }
    );
    return this.save();
}

GroupSchema.methods.updateMessage = function (this: IGroup, message: IGroupMessage): Promise<IGroup> {

    const theMessage = _.findIndex(this.messages, (_message: IGroupMessage) => {
        return _message._id.toString() === message._id.toString();
    });

    if(theMessage < 0) return this.save();

    this.messages[theMessage].text = message.text;

    return this.save();
}

GroupSchema.methods.deleteMessage = function(this: IGroup, messageId: string): Promise<IGroup> {

    const theMessage = _.findIndex(this.messages, (_message: IGroupMessage) => {
        return _message._id.toString() === messageId;
    });

    if(theMessage < 0) return this.save();

    this.messages.splice(theMessage, 1);

    return this.save();
}

GroupSchema.methods.getMemberPermission = function(this:IGroup, memberId: string): IGroupMember {
    return _.find(this.members, (memberData:IGroupMember)=>{
        return memberData.userId.toString() === memberId;
    });
}

GroupSchema.methods.isMemberPresent = function(this:IGroup, memberId: string): boolean {
    return !!(this.getMemberPermission(memberId));
}

GroupSchema.methods.updateOwner = function(this: IGroup, newOwner: string): Promise<IGroup> {
    if(this.isMemberPresent(newOwner)) {
        this.owner = newOwner;
    }
    return this.save();
}

GroupSchema.methods.updateMember = function (this:IGroup, memberData: IGroupMember): Promise<IGroup> {
    if(this.isMemberPresent(memberData.userId)) {
        const memberIdx = _.findIndex(this.members, (_memberData: IGroupMember) => {
            return _memberData.userId.toString() === memberData.userId;
        });
        this.members[memberIdx] = memberData;
    } else {
        this.members.push(memberData);
    }

    return this.save();
}

GroupSchema.methods.removeMember = function (this:IGroup, memberData: IGroupMember): Promise<IGroup> {

    const memberDataIdx = _.findIndex(this.members, (_memberData) => {
        return _memberData.userId.toString() === memberData.userId;
    });

    if(memberDataIdx < 0) return this.save();

    const foundMemberData:IGroupMember = this.members[memberDataIdx];

    if(foundMemberData.userId.toString() === this.owner.toString()) return this.save();

    this.members.splice(memberDataIdx, 1);

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

GroupSchema.statics.findByOwner = function (owner: string): Query<IGroup[], IGroup, IGroup> {
    return Group.find({
        owner
    });
}

GroupSchema.statics.createFromTitleAndCreator =async function (title: string, owner: string): Promise<IGroup> {
    const newGroup:IGroup = await Group.create({
        title,
        owner,
        members: [],
        messages: []
    });

    return newGroup.updateMember({
        userId:owner,
        groupPermissions:[]
    })
}

GroupSchema.statics.findAndUpdateWithUserId = function(userId: string, groupId: string, groupData:IGroup) {

    // TODO: ensure that userId has sufficient permission to update this group
    return Group.findOneAndUpdate(
        { _id: groupId },
        groupData.toJSON(),
        {
            runValidators:true,
        }
    )
}

// instance methods go here
export interface IGroup extends Document {
    _id:string,
    title: string,
    owner: string,
    members: IGroupMember[],
    messages: IGroupMessage[],

    postMessage(text: string, sender: string): Promise<IGroup>,
    updateMessage(message: IGroupMessage): Promise<IGroup>,
    deleteMessage(messageId: string): Promise<IGroup>,

    updateMember(memberData: IGroupMember): Promise<IGroup>,
    removeMember(memberData: IGroupMember): Promise<IGroup>,
    getMemberPermission(memberId: string): IGroupMember,
    isMemberPresent(memberId: string): boolean,

    updateOwner(newOwner: string): Promise<IGroup>,
}

// statics go here
export interface IGroupModel extends Model<IGroup> {
    createFromTitleAndCreator(title: string, owner: string): Promise<IGroup>
    findByGroupMember(member: string): Query<IGroup[], IGroup, IGroup>
    findByOwner(creator: string): Query<IGroup[], IGroup, IGroup>
    findByIdAndGroupMember(member: string, groupId: string): Query<IGroup, IGroup, IGroup>

    findAndUpdateWithUserId(userId: string, groupId:string, groupData:IGroup): Query<IGroup, IGroup, IGroup>
}

const Group: IGroupModel = model<IGroup, IGroupModel>('Group', GroupSchema, 'groups');

export default Group;


