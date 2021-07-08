const Order = require('../models/Order')
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken')

exports.addOrder = asyncHandler(async (req,res) => {
    const user = jwt.decode(req.headers.authorization.slice(7))

    const order = new Order({
        userId: user.id,
        productId: req.body.productId,
        companyId: req.body.companyId,
        number: req.body.number
    })
    order.save()
        .then(()=>{
            res.status(201).json({
                success: true,
                data: order
            })
        })
        .catch((error) =>{
            res.status(400).json({
                success: false,
                data: error
            })
        })

})

exports.deleteOrder = asyncHandler(async (req,res) =>{
    const user = jwt.decode(req.headers.authorization.slice(7))
    const order = await Order.findOne(req.params.id)
        .populate({path: 'userId', select: '_id'})
    if(!order){
        res.send(new ErrorResponse('Order not found', 404))
    } else {
        if(order && user.id === order.userId._id){
            await Order.findByIdAndDelete(req.params.id)
            res.status(200).json({
                success: true,
                data:[]
            })
        } else {
            res.status(403).json({
                success: false,
                error: new ErrorResponse('User not role', 403)
            })
        }
    }
})

