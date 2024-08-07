const DeliveryDriver = require("../models/delivery_driver_model");
const fs=require('fs')
const path = require('path');
  
const removeImg =require('./imageRemove')



// Create a new delivery driver   
exports.createDeliveryDriver = async (req, res) => {
  try {
    const driverData = req.body;

    if (!req.file) {
      return res.status(400).json({ status: "fail", message: "No image file provided" });
  }
    // Basic Validation (Add more as needed)
    if (!driverData.firstName || !driverData.lastName  || !driverData.phoneNumber) {
      await removeImg('deliveryDriver',req.file.filename)
      return res
        .status(400)
        .json({ error: "Name and phone number are required" });
    }
    driverData.img=req.file.filename
    const newDriver = await DeliveryDriver.create(driverData);
    res.status(201).json(newDriver);

  } catch (err) {
    
    await removeImg('deliveryDriver',req.file.filename)
    if (err.code === 11000) {
      // MongoDB duplicate key error
      return res
        .status(400)
        .json({
          error: err,
        });
    }
    res
      .status(500)
      .json({ error: "Failed to create driver", details: err.message });
  }
};

// Get all delivery drivers
exports.getAllDeliveryDrivers = async (req, res) => {
  try {
    const drivers = await DeliveryDriver.find();
    res.json(drivers);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get drivers", details: err.message });
  }
};

// Get a driver by ID
exports.getDeliveryDriverById = async (req, res) => {
  try {
    const driverId = req.params.id;
    const driver = await DeliveryDriver.findById(driverId);

    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    res.json(driver);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get driver", details: err.message });
  }
};

// Update a driver by ID
exports.updateDeliveryDriver = async (req, res) => {
  try {
    const driverId = req.params.id;
    const updateData = req.body;

    // Check if there is a file upload
    const file = req.file ? req.file.filename : null;

    // Find the driver and update
    const driver = await DeliveryDriver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Update the driver data
    if (file) {
      // Update the driver's image path
      updateData.img = file;
    }

    // Update the driver with new data
    const updatedDriver = await DeliveryDriver.findByIdAndUpdate(driverId, updateData, { new: true });
   
    
    //remove old img
    if (driver.img && file) {
      await removeImg('deliveryDriver',driver.img)
    }

    res.json(updatedDriver);
  } catch (err) {
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ error: "Phone number or email already in use" });
    }
    res.status(500).json({ error: "Failed to update driver", details: err.message });
  }
};


// Delete a driver by ID
exports.deleteDeliveryDriver = async (req, res) => {
  try {
    const driverId = req.params.id;
    const driver = await DeliveryDriver.findByIdAndDelete(driverId);

    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Remove image file if it exists
    if (driver.img) {
      await removeImg('deliveryDriver',driver.img)
    }

    res.json({ message: "Driver deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete driver", details: err.message });
  }
};
