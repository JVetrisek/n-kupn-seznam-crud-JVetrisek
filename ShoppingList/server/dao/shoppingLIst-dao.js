const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    membersIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    archive: { type: Boolean, default: false }
});

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);

async function create(shoppingList) {
    try {
        const newShoppingList = new ShoppingList(shoppingList);
        await newShoppingList.save();
        return newShoppingList;
    } catch (error) {
        throw { code: "creatingFailed", message: error.message };
    }
}

async function remove(shoppingListId) {
    try {
        await ShoppingList.findByIdAndDelete(shoppingListId);
        return { message: "Shopping list removed successfully." };
    } catch (error) {
        throw { code: "removingFailed", message: error.message };
    }
}

async function update(shoppingList) {
    try {
        const updatedShoppingList = await ShoppingList.findByIdAndUpdate(shoppingList._id, shoppingList, { new: true });
        return updatedShoppingList;
    } catch (error) {
        throw { code: "updatingFailed", message: error.message };
    }
}

async function list() {
    try {
        return await ShoppingList.find();
    } catch (error) {
        throw { code: "operationFailed", message: error.message };
    }
}

async function listByUser(userId) {
    try {
        return await ShoppingList.find({
            $or: [
                { ownerId: userId },
                { membersIds: userId }
            ]
        });
    } catch (error) {
        throw { code: "listingFailed", message: error.message };
    }
}

async function addMemberToShoppingList(shoppingListId, memberId) {
    try {
        const shoppingList = await ShoppingList.findById(shoppingListId);
        if (!shoppingList) {
            throw { code: "notFound", message: `Shopping list with ID ${shoppingListId} not found.` };
        }

        if (shoppingList.membersIds.includes(memberId)) {
            throw { code: "alreadyExists", message: `Member with ID ${memberId} is already in the shopping list.` };
        }

        shoppingList.membersIds.push(memberId);
        await shoppingList.save();
        return shoppingList;
    } catch (error) {
        throw { code: "addMemberFailed", message: error.message };
    }
}

async function removeMemberFromShoppingList(shoppingListId, memberId) {
    try {
        const shoppingList = await ShoppingList.findById(shoppingListId);
        if (!shoppingList) {
            throw { code: "notFound", message: `Shopping list with ID ${shoppingListId} not found.` };
        }

        shoppingList.membersIds = shoppingList.membersIds.filter(_id => _id !== memberId);
        await shoppingList.save();
        return shoppingList;
    } catch (error) {
        throw { code: "removeMemberFailed", message: error.message };
    }
}

module.exports = {
    create,
    remove,
    update,
    list,
    listByUser,
    addMemberToShoppingList,
    removeMemberFromShoppingList
};
