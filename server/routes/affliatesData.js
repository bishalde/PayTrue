const express = require("express");
const router = express.Router();


router.get("/", async (req, res) => {

    const data = [
        {
            name:"Myntra",
            link:"https://www.myntra.com/",
            image:"https://couponswala.com/blog/wp-content/uploads/2021/12/myntra-upcomming-sale-min-1.png"
        },
        {
            name:"Amazon",
            link:"https://www.amazon.in/",
            image:"https://trak.in/wp-content/uploads/2020/08/IMG_20200808_191750.jpg"
        },
        {
            name:"Swiggy",
            link:"https://www.swiggy.com/",
            image:"https://im.whatshot.in/img/2021/Aug/swiggy-header-3-1628856817.jpg"
        },
        {
            name:"Zomato",
            link:"https://www.zomato.com/",
            image:"https://cdn.grabon.in/gograbon/images/web-images/uploads/1658919238810/zomato-coupons.jpg"
        },
        {
            name:"Ola",
            link:"https://www.olacabs.com/",
            image:"https://dog55574plkkx.cloudfront.net/images/ola-coupon-code.jpg"
        }
    ];

    res.send(data);

});



module.exports = router;