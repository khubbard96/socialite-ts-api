import jwt from "jwt-simple";
import { Express } from "express";
import * as APP_CONFIG from "../../../../appConfig.json";
import moment from "moment";

/**
 * Runs any initialization/setup activities for token authorization.
 *
 * @param app Top-most Express application
 */
export const initAuth = (app: Express): void => {
    app.set('jwtTokenSecret', APP_CONFIG.jwtSecret);
}

/**
 * Verifies a provided token's authenticity.
 *
 * @param token Token to verify
 */
export const verifyToken = (token: string): boolean => {
    let result = false;
    if (token) {
        try {
            const decoded = jwt.decode(token, APP_CONFIG.jwtSecret);
            result = true;
        } catch(err) {
            result = false;
        }
    }
    return result;
}

export const getIssuer = (token: string): string => {
    if(verifyToken(token)) {
        return jwt.decode(token, APP_CONFIG.jwtSecret).iss;
    } else {
        return null;
    }
}
/**
 * Generates a JWT token
 * @param iss Issuer of the request for a token, in this case the end user.
 */
export const generateToken = (iss: string): string => {
    const TOKEN_EXP = moment().add(7, 'days').valueOf();
    const token = jwt.encode(
        { iss, TOKEN_EXP },
        APP_CONFIG.jwtSecret
    );
    return token;
}