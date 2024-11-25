const deliveryModels = require("../../../models/deliveryModels/deliveryModels")

module.exports = {
    async createDeliveryChargesServices (data){
        try{
            let deliveryExists = await deliveryModels.findOne({deliveryShiftNumber: data?.deliveryShiftNumber, isDeleted: false});
            if(deliveryExists){
                return {
                    status: 400,
                    error: true,
                    message: "Your Delivery Shift Number already exists",
                    data: deliveryExists
                }
            }

            let createDeliveryCharge = await deliveryModels.create({
                deliveryFee: data?.deliveryFee,
                deliveryShift: data?.deliveryShift,
                deliveryShiftNumber: data?.deliveryShiftNumber,
                isDeleted : false,
                isActive: true,
                status: true,
            });
            if(createDeliveryCharge){
                return{
                    status: 200,
                    error: false,
                    message: "Successfull",
                    data: createDeliveryCharge,
                }
            }else{
                return {
                    status:400,
                    error: true,
                    message: "Failed to Create Delivery Charges Services",
                    data: null
                }
            }
        }catch(error){
            console.log(error);
            return {
                status: 400,
                error :true,
                message: "Failed to Create Delivery Charges from the Services",
                data: null,
            }
        }
    },


    async getAllDeliveryChargesServices (){
        try{
            let getAllCharges = await deliveryModels.find({isDeleted: false});
            if(getAllCharges){
                return{
                    status: 200,
                    error: false,
                    message: "Successfull",
                    data: getAllCharges
                }
            }else{
                return {
                    status: 400,
                    error: true,
                    message: "Failed or not Data found",
                    data: null,
                }
            }
        }catch(error){
            console.log(error);
            return {
                status: 400,
                error :true,
                message: "Failed to Create Delivery Charges from the Services",
                data: null,
            }
        }
    },

    async getSingleDeliveryChargesServices (params){
        try{
            let getSingleCharge = await deliveryModels.find({_id: params?.id, isDeleted: false});
            if(getSingleCharge){
                return{
                    status: 200,
                    error: false,
                    message: "Successfull",
                    data: getSingleCharge
                }
            }else{
                return {
                    status: 400,
                    error: true,
                    message: "Failed or not Data found",
                    data: null,
                }
            }
        }catch(error){
            console.log(error);
            return {
                status: 400,
                error :true,
                message: "Failed to Create Delivery Charges from the Services",
                data: null,
            }
        }
    },

    async deleteSingleDeliveryChargesServices (params){
        try{
            let getSingleCharge = await deliveryModels.find({_id: params?.id, isDeleted: false});
            if(getSingleCharge){
                let removeCharge = await deliveryModels.findOneAndUpdate({_id: params?.id, isDeleted: false}, {isDeleted: true, isActive: false, status: false}, {new: true});
                if(removeCharge){
                    return{
                        status: 200,
                        error: false,
                        message: "Successfully Removed",
                        data: removeCharge,
                    }
                }else{
                    return{
                        status: 400,
                        error: true,
                        message: "Failed to Remove the Charge",
                        data: null,
                    }
                }
            }else{
                return {
                    status: 400,
                    error: true,
                    message: "Failed or not Data found",
                    data: null,
                }
            }
        }catch(error){
            console.log(error);
            return {
                status: 400,
                error :true,
                message: "Failed to Create Delivery Charges from the Services",
                data: null,
            }
        }
    }
}