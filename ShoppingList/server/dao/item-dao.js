const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    shoppingListId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShoppingList' },
    quantity: { type: Number, required: true },
    completed: { type: Boolean, default: false }
});

const Item = mongoose.model('Item', itemSchema);

async function create(item) {
    try {
        const newItem = new Item(item);
        await newItem.save();
        return newItem;
    } catch (error) {
        throw { code: "creatingFailed", message: error.message };
    }
}

async function remove(itemId) {
    try {
        await Item.findByIdAndDelete(itemId);
        return {};
    } catch (error) {
        throw { error: "operation failed" };
    }
}

async function get(itemId) {
    try {
        return await Item.findById(itemId);
    } catch (error) {
        throw { error: "operation failed" };
    }
}

async function update(item) {
    try {
        const updatedItem = await Item.findByIdAndUpdate(item._id, item, { new: true });
        return updatedItem;
    } catch (error) {
        throw { error: "operation failed" };
    }
}

async function list() {
    try {
        return await Item.find();
    } catch (error) {
        throw { error: "operation failed" };
    }
}

async function listByShoppingList(shoppingListId) {
    try {
        return await Item.find({ shoppingListId });
    } catch (error) {
        throw { code: "listingFailed", message: error.message };
    }
}

module.exports = {
    create,
    remove,
    get,
    update,
    list,
    listByShoppingList,
};
