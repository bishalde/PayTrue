const express = require("express");
const Wallet = require("../models/walletModel");
const Banner = require("../models/bannerModel");

const router = express.Router();

router.get("/", async(req, res) => {
    const allBannerReemded = await Banner.find({uid: req.query.uid},{uid:0,redmeedAt:0,__v:0,_id:0});
    if(!allBannerReemded){
        return res.status(404).json({error:"Banner not found"});
    }
    var data = [];
    for(var i=0;i<allBannerReemded.length;i++){
        data.push(allBannerReemded[i].bannerId);
    }
    res.status(200).json(data);
});

router.post("/", async (req, res) => {
    const {uid,bannerId,coins} = req.body;
    try{
        const wallet = await Wallet.findOne({uid:uid});
        if(!wallet){
            return res.status(404).json({error:"Wallet not found"});
        }
        if(wallet.coins < coins){
            return res.status(400).json({error:"Insufficient coins"});
        }
        wallet.coins = wallet.coins - coins;
        await wallet.save();
        const banner = new Banner({uid,bannerId,coins});
        await banner.save();
        res.status(201).json({message:"Banner Redmeed Successfully",success:true});
    }
    catch(err){
        res.status(500).json({error:err.message});
    }

})


module.exports = router;
