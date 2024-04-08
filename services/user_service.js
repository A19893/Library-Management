
const { utils } = require("../libs");
const { custom_error } = require("../libs/error");
const { generateToken } = require("../libs/utils");
// const { generateToken } = require("../libs/utils");
const { user_model } = require("../models");
const { users_repository_obj } = require("../repositories/users_repository");

const create_user = async (payload) => {
    const { username, password, email, isAdmin = false } = payload;
    if (!username || !email || !password) {
        throw new custom_error("Please Fill all the fields!");
    }
    const existing_User = await users_repository_obj.find_user({email});
    if (existing_User) throw new custom_error("Email already Exists!");
    const registered_user = await users_repository_obj.create_user({username, email, password, isAdmin})
    return registered_user;
};

const login_user = async (payload) => {
    const { email, password } = payload;
    if (!email || !password) {
        throw new custom_error("Bad request, Check the payload!");
    }
    const existingUser = await users_repository_obj.find_user({ email });
    if (!existingUser) {
        throw new custom_error("User not exists!");
    }
    if(!existingUser.isActive){
        throw new custom_error("User status is not active. Contact Support Team.")
    }
    if (!existingUser || !(await utils.matchPassword(password, existingUser.password))) {
        throw new custom_error("Invalid Email/Password!");
    }
    const token = generateToken(existingUser.id);
    return { ...existingUser.dataValues, token: token }
};

const update_user_status = async (userId, payload) => {
    const user = await user_model.findById(userId);

    if (!user) {
        throw new custom_error("User not exists!");
    }
    const updated_user = await user_model.findByIdAndUpdate(
        userId,
        payload,
        {
            new: true,
        }
    );
    return updated_user;
}

module.exports = {
    create_user,
    login_user,
    update_user_status,
};
