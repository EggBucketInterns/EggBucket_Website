const OutletPartner = require("../models/outlet_partner_model");
const fs = require("fs");
const path = require("path");

const removeImg = require("../utils/imageRemove");

exports.createOutletPartner = async (req, res) => {
  try {
    const data = req.body;
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "fail", message: "No image file provided" });
    }
    if (!data.firstName || !data.phoneNumber) {
      await removeImg("outletPartner", req.file.filename);
      return res
        .status(400)
        .json({ error: "Name and contact information are required" });
    }
    data.img = req.file.filename;
    const newPartner = await OutletPartner.create(data);
    res.status(200).json(newPartner);
  } catch (err) {
    await removeImg("outletPartner", req.file.filename);
    if (err.code === 11000) {
      // MongoDB duplicate key error
      return res.status(400).json({
        error: "Driver with this phone number or email already exists",
      });
    }
    res
      .status(500)
      .json({ error: "Failed to create driver", details: err.message });
  }
};

//get all partners

exports.getAllPartners = async (req, res) => {
  try {
    const result = await OutletPartner.find();
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get drivers", details: err.message });
  }
};

//get by id
exports.getPartner = async (req, res) => {
  try {
    let pid = req.params.id;
    const result = await OutletPartner.findById(pid);

    if (!result) return res.status(404).json({ error: "Partner not found" });

    res.status(200).json({ result });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get driver", details: err.message });
  }
};

//update

exports.updatePartner = async (req, res) => {
  try {
    let pid = req.params.id;
    const updateData = req.body;

    const file = req.file ? req.file.filename : null;

    const partner = await OutletPartner.findById(pid);
    if (!partner) {
      await removeImg("outletPartner", req.file.filename);
      return res.status(404).json({ error: "Outlet Partner not found" });
    }

    // Update the driver data
    if (file) {
      // Update the driver's image path
      updateData.img = file;
    }

    const result = await OutletPartner.findByIdAndUpdate(pid, updateData, {
      new: true,
    });

    if (!result) return res.status(404).json({ error: "Partner not found" });

    // Remove old image file if it exists
    if (partner.img && file) {
      await removeImg("outletPartner", partner.img);
    }

    res.status(200).json({ result });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "Phone number or email already in use" });
    }
    res
      .status(500)
      .json({ error: "Failed to update OutletPartner", details: err.message });
  }
};

//delete Partner
exports.deletePartner = async (req, res) => {
  try {
    let pid = req.params.id;
    const result = await OutletPartner.findByIdAndDelete(pid);
    if (!result) return res.status(404).json({ error: "Partner not found" });

    if (result.img) {
      await removeImg("outletPartner", result.img);
    }

    res.status(200).json({ message: "OutletPartner Deleted successfully!!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete OutletPartner", details: err.message });
  }
};