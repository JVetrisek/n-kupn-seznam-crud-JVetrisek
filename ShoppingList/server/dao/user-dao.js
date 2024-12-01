const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }
});

const User = mongoose.model('User', userSchema);

async function create(user) {
    try {
        const newUser = new User(user);
        await newUser.save();
        return newUser;
    } catch (error) {
        throw { code: "creatingFailed", message: error.message };
    }
}

async function get(userId) {
    try {
        return await User.findById(userId);
    } catch (error) {
        throw { code: "gettingFailed", message: error.message };
    }
}

async function update(user) {
    try {
        const updatedUser = await User.findByIdAndUpdate(user._id, user, { new: true });
        return updatedUser;
    } catch (error) {
        throw { code: "updatingFailed", message: error.message };
    }
}

async function list() {
    try {
        return await User.find();
    } catch (error) {
        throw { code: "listingFailed", message: error.message };
    }
}

async function remove(userId) {
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            throw { code: "notFound", message: `User with ID ${userId} not found` };
        }
        return deletedUser;
    } catch (error) {
        throw { code: "removalFailed", message: error.message };
    }
}

module.exports = {
    create,
    get,
    update,
    list,
    remove
};
