/*
This module is used purely to compile all of the microservices into one supermodule for use throughout the rest of the application.
*/

import groupService from "./group";
import userService from "./user";
import loginService from "./login";
import userCreationService from "./user_creation";


export {
    groupService,
    userService,
    loginService,
    userCreationService
}