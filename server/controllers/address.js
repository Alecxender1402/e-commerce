import { Address } from "../models/address.js";
import trycatch from "../utils/trycatch.js";

export const addAddress = trycatch(async (req, res) => {
    const { address, phone } = req.body;
    
    await Address.create({ address, phone, user: req.user._id });

    res.status(201).json({ message: 'Address added successfully' });
});

export const fetchallddress = trycatch(async (req, res) => {
    const address = await Address.find({ user: req.user._id });

    res.json(address);
});

export const getsingleaddress = trycatch(async (req, res) => {
    const address = await Address.findById(req.params.id);

    res.json(address);
});

export const updateaddress = trycatch(async (req, res) => {
    const { address, phone } = req.body;

    await Address.findByIdAndUpdate(req.params.id, { address, phone });

    res.json({ message: 'Address updated successfully' });
});

export const deleteaddress = trycatch(async (req, res) => {

    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    
    await address.deleteOne();

    res.json({ message: 'Address deleted successfully' });
});



