import express, { request, response } from "express"
import passport from "passport"
import googleCredentials from "../controllers/googleContoller.js"
import JWT from "jsonwebtoken"
import sessionStorage from "node-sessionstorage"


googleCredentials(passport)

const router = express.Router()


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email',] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: process.env.FAILURE_REDIRECT_URL }), (req, res) => {
    const token = JWT.sign({user: req.user}, process.env.ACCESS_TOKEN_SECRET)
    sessionStorage.setItem("set_token", token)
    
    res.redirect(process.env.SUCCESS_REDIRECT_URL);
});


export default router