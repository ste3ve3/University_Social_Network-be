import express from "express"
import passport from "passport"
import facebookCredentials from "../controllers/facebookController.js"
import JWT from "jsonwebtoken"
import sessionStorage from "node-sessionstorage"


facebookCredentials(passport)

const router = express.Router()


router.get('/facebook', passport.authenticate('facebook', { scope: ['email']}));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: process.env.FAILURE_REDIRECT_URL }), (req, res) => {
    const token = JWT.sign({user: req.user}, process.env.ACCESS_TOKEN_SECRET)
    sessionStorage.setItem("set_token", token)
    
    res.redirect(process.env.SUCCESS_REDIRECT_URL);
});


export default router