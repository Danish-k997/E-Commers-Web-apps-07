import mongoose from "mongoose";
import Addressmodules from "../module/Addressmodules.js";  



export const addAddress = async (req, res) => {
  const { userId, name, city, state, phone, pincode, landmark } = req.body;
 
  try {
 if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
  return res.status(400).json({ message: "Invalid userId" });
} 

if (!name ||  !city || !state || !phone || !pincode) {
      return res.status(400).json({ message: "Fill all fields " });
    }
      
  const address = new Addressmodules({
    userId,
    name,
    city,
    state,
    phone,
    pincode,
    landmark,
  });

  await address.save();
  res.status(201).json({ message: "Address added successfully", address });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const addresses = await Addressmodules.find({ userId });
 
    res.status(200).json({ 
      addresses,
      hasAddress: addresses.length > 0 
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};


export const updateAddress = async (req, res) => {
  try {
    
    const { addressId } = req.params


    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: "Invalid addressId" })
    }
    
    const userId = req.user.id  

    const existingAddress = await Addressmodules.findById({
      _id: addressId,
      userId: userId
    })  

    if (!existingAddress) {
      return res.status(404).json({ message: "Address not found" })
    }

    const { name, city, state, phone, pincode, landmark } = req.body
     
    //
    if (!name && !city && !state && !phone && !pincode) {
      return res.status(400).json({ message: "fields is missing" })
    }

    const update = await Addressmodules.findByIdAndUpdate(
      addressId,
      {
        $set: {
          ...(name     && { name }),
          ...(city     && { city }),
          ...(state    && { state }),
          ...(phone  && { phone }),
          ...(pincode  && { pincode }),
          ...(landmark && { landmark }),
        }
      },
      { new: true }
    )

    
    if (!update) {
      return res.status(404).json({ message: "Address not found" })
    }

  
    res.status(200).json({ message: "Address updated successfully", address: update })

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}