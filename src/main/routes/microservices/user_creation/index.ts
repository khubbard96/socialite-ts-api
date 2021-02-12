import express from "express";
const router:express.Router = express.Router();
import User, { CountryCode, IUser } from "../../../models/user";
import logger from "../../../util/log";
import { Query } from "mongoose";
import SocialiteApiRoute from "../../../models/routes/SocialiteApiRoute";
import { generateToken } from "../../../util/auth";
import Joi from "joi";

// a comment

logger.debug("USER_CREATION microservice loaded.");

router.put("/user/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {


    const schema:Joi.ObjectSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    });

    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };

    // validate request body against schema
    const { error, value } = schema.validate(req.body, options);

    if (error) {
        // on fail return comma separated errors
        return res.status(400).send({err:`Missing parameters: ${error.details.map(x => x.message).join(', ')}`});
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
    }

    try{
        await User.create(
            {
                name: req.body.name,
                email: {
                    addr: req.body.email,
                },
                password: {
                    value: req.body.password,
                },
                phone: {
                    raw: req.body.phone,
                    code: CountryCode.US
                }
            }
        );

        const user:IUser = await User.findByEmail({addr: req.body.email });

        const apiToken:string = generateToken(user._id);

        res.status(200).send({user, apiToken});

    } catch (e) {
        logger.warn("New user creation failed.")
        res.status(400).send({
            e
        });
    }

});

export default router;

/*const UserCreationRoute: SocialiteApiRoute = new SocialiteApiRoute("[user] CREATE", router, "/");

module.exports = UserCreationRoute;*/