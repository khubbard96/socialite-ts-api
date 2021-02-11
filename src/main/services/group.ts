import Group, { IGroup } from "../models/group";

module.exports.get = (id: string): IGroup => {
    return Group.findById(id);
}