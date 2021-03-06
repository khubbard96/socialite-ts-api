import { Document, Model, model, Types, Schema, Query } from "mongoose";
import bcrypt from "bcrypt";
import passvalid from "password-validator";
import mongooseHiddenImp from "mongoose-hidden";

const mongooseHidden = mongooseHiddenImp(({ defaultHidden: { password: true, auth: true } }));

const USER_PASS_SALT_ROUNDS = 8;

const passwordValidationSchema = new passvalid();
passwordValidationSchema
    .is().min(8)
    .is().max(64)

    .has().uppercase()
    .has().lowercase()
    .has().digits(1)

    .has().not().spaces();

export enum CountryCode {
    "US"
}

/***** PHONE SCHEMA */
const PhoneSchema: Schema = new Schema(
    {
        raw: {
            type: String,
            required: true,
            validate: {
                validator(v) {
                    // validates that phone only includes numbers
                    return /^[0-9]*$/.test(v);
                },
                message: "Phone number can only include digits."
            },
            trim: true
        },
        code: {
            type: CountryCode,
            required: true
        }
    },
    {
        _id: false,
        timestamps: false
    }
);

PhoneSchema.statics.phoneInUse = async function (phone: IPhoneNumber): Promise<boolean> {

    return false;
}

export interface IPhoneNumber {
    raw: string,
    code: CountryCode
}

/* PASSWORD SCHEMA */
const PasswordSchema: Schema = new Schema(
    {
        value: {
            type: String,
            required: true,
            validate: {
                validator(v: string) {
                    return passwordValidationSchema.validate(v);
                },
                message: props => `Password must be between 8-64 characters and contain a lowercase and lowercase letter, and a digit.`
            }
        }
    },
    {
        _id: false,
        timestamps: false
    }
);

PasswordSchema.pre('save', function (this: IPassword, next: () => void) {
    if (this.isNew) {
        this.value = bcrypt.hashSync(this.value, USER_PASS_SALT_ROUNDS)
    }
    next();
});

PasswordSchema.statics.isValid = function (raw: string) {
    // TODO
    return raw.length > 8;
}

PasswordSchema.methods.doesMatch = function (this: IPassword, passIn: string) {
    return bcrypt.compare(passIn, this.value);
}

interface IPassword extends Document {
    value: string,
    doesMatch(passIn: string): boolean
}

/* EMAIL SCHEMA */
const EmailSchema: Schema = new Schema(
    {
        addr: {
            type: String,
            required: true,
            validate: {
                validator(v) {
                    return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(v);
                },
                message: "Must enter a valid email address."
            }
        }
    },
    {
        _id: false,
        timestamps: false,
    }
);

EmailSchema.methods.isValid = function (cb) {
    // return this.addr.length > 3;
}

export interface IEmailAddress {
    addr: string
}

/* USER SCHEMA */
const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: EmailSchema,
            required: true,
            validate: {
                async validator(email: IEmailAddress) {
                    return await User.emailIsUnique(email);
                },
                message: "Email is already in use."
            }
        },
        password: {
            type: PasswordSchema,
            required: true,
        },
        phone: {
            type: PhoneSchema,
            required: true,
            validate: {
                async validator(phone: IPhoneNumber) {
                    // validate phone number uniqueness
                    return (await User.find({
                        phone: {
                            raw: phone.raw,
                            code: phone.code
                        }
                    })).length === 0;
                },
                message: "Phone number is already in use."
            }
        },
        auth: {
            type: String,
            required: true,
            immutable: true,
            default: generateAuthKey,
        }
    },
    {
        versionKey: false,
    }
);

UserSchema.plugin(mongooseHidden);

function generateAuthKey(): string {
    return "asdf";
}

UserSchema.statics.findByEmail = function (emailIn: IEmailAddress): Query<IUser, IUser, IUser> {
    return this.findOne(
        {
            email:
                { addr: emailIn.addr }
        }
    )
}

UserSchema.statics.emailIsUnique = async function (emailIn: IEmailAddress): Promise<boolean> {
    let result: boolean = false;
    result = !(await User.findByEmail(emailIn))
    return result;
}

UserSchema.statics.findByPhoneNumber = function (phoneIn: IPhoneNumber) {
    return this.find(
        {
            phone: {
                raw: phoneIn.raw,
                code: phoneIn.code
            }
        }
    )
}

UserSchema.methods.validatePassword = function(this: IUser, passIn: string): boolean {
    return bcrypt.compareSync(passIn, this.password.get('value'));
}

export interface IUser extends Document {
    name: string;
    email: IEmailAddress,
    password: IPassword,
    phone: IPhoneNumber,
    auth: string
    validatePassword(passIn: string): boolean
}

export interface IUserModel extends Model<IUser> {
    findByEmail(emailIn: IEmailAddress): Query<IUser, IUser, IUser>,
    emailIsUnique(emailIn: IEmailAddress): Promise<boolean>
}

const User: IUserModel = model<IUser, IUserModel>('User', UserSchema, "users");

export default User;