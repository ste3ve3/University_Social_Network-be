import BlogPost from '../models/blogModel.js';
import  articleValidation  from '../middlewares/blogValidation.js';
import testResultModel from "../models/resultsModel.js"
import nodemailer from "nodemailer"

    const createPost = async (req, res)=>{
        //Let's validate the inputs.
        const {error} = articleValidation.validate(req.body)

        if (error)
            return res.status(400).json({"validationError": error.details[0].message})
            
            const postImage = req.files.post[0].filename;
            const authorImage = req.files.author[0].filename;
            const postImages = `${req.protocol}://${req.get("host")}/postImages/${postImage}`;
            const authorImages = `${req.protocol}://${req.get("host")}/postImages/${authorImage}`;
            
            const newBlogPost = new BlogPost()  

                newBlogPost.title = req.body.title,
                newBlogPost.body = req.body.body,
                newBlogPost.authorName = req.body.authorName,
                newBlogPost.imgLink = postImages,
                newBlogPost.authorImage = authorImages
                newBlogPost.category = req.body.category
                newBlogPost.faculty = req.body.faculty

        try{
            await newBlogPost.save();
            res.status(201).json({
                "postSuccess": "Post created successfully",
                "postContent": newBlogPost
            });

        } 
        
        catch (error){
            console.log(error);
            res.status(500).json({
                "status": "fail",
                "message": error.message
            })
        }

    }

    const updatePostById = async (req, res) => {
        try{
            const blog = await BlogPost.findOne({_id: req.params.id});
            if(blog){
                blog.title = req.body.title || blog.title,
                blog.body = req.body.body || blog.body,
                blog.authorName = req.body.authorName || blog.authorName,
                blog.category = req.body.category || blog.category
                blog.faculty = req.body.faculty || blog.faculty
                
            if(req.files){
                const postImages = `${req.protocol}://${req.get("host")}/postImages/${req.files.post[0].filename}`;
                blog.imgLink = postImages || blog.imgLink
                const authorImages = `${req.protocol}://${req.get("host")}/postImages/${req.files.author[0].filename}`;
                blog.authorImage = authorImages || blog.authorImage                 
                }


                await blog.save();
                res.status(200).json({
                    "postUpdatedSuccess": "Post updated successfully",
                    "postContent": blog
                });
            }

            else{
                res.status(400).json({
                    "postUpdatedError": "Post not found",
                });  
            }
        } 
        
        catch (error){
            console.log(error);
            res.status(500).json({
                "status": "fail",
                "message": error.message
            })
        }
    }

    const getPosts = async (req, res) => {
        
        try{
            const blog = await BlogPost.find();
            if(blog){
                res.status(200).json({ "availabePosts": blog });
            }

            else{
                res.status(400).json({
                    "postAvailabeError": "Post not found",
                });
            }

        } 
        
        catch (error){
            console.log(error);
            res.status(500).json({
                "status": "fail",
                "message": error.message
            })
        }

    }

    const getPostsById = async (req, res) => {

        try{
            const blog = await BlogPost.findOne({_id: req.params.id});
            if(blog){
                res.status(200).json({ "fetchedPost": blog });
            }

            else{
                res.status(400).json({
                    "postFetchedError": "Post not found",
                });
            }

        } 
        
        catch (error){
            console.log(error);
            res.status(500).json({
                "status": "fail",
                "message": error.message
            })
        }
    }

    const deletePostById = async (req, res) => {
        try{
            await BlogPost.deleteOne({_id: req.params.id});
            res.status(200).json({ "deletedPost": "Post deleted successfully" });
        } 
        
        catch (error){
            console.log(error);
            res.status(500).json({
                "status": "fail",
                "message": error.message
            })
        }
    }

    const getPostsByCategory = async (req, res) => {

        try{
            const blog = await BlogPost.find({category: req.params.category});
            if(blog){
                res.status(200).json({ "fetchedPost": blog });
            }

            else{
                res.status(400).json({
                    "postFetchedError": "Post not found",
                });
            }

        } 
        
        catch (error){
            console.log(error);
            res.status(500).json({
                "status": "fail",
                "message": error.message
            })
        }
    }

    const getPostsByCategoryAndFaculty = async (req, res) => {

        try{
            const blog = await BlogPost.find({category: req.params.category, faculty: req.params.faculty});
            if(blog){
                res.status(200).json({ "fetchedPost": blog });
            }

            else{
                res.status(400).json({
                    "postFetchedError": "Post not found",
                });
            }

        } 
        
        catch (error){
            console.log(error);
            res.status(500).json({
                "status": "fail",
                "message": error.message
            })
        }
    }


    const getPostsByFaculty = async (req, res) => {

        try{
            const blog = await BlogPost.find({faculty: req.params.faculty});
            if(blog){
                res.status(200).json({ "fetchedPost": blog });
            }

            else{
                res.status(400).json({
                    "postFetchedError": "Post not found",
                });
            }

        } 
        
        catch (error){
            console.log(error);
            res.status(500).json({
                "status": "fail",
                "message": error.message
            })
        }
    }

    const saveTestResult = async (req, res) => {

        try{
            const newTestResult = new testResultModel()

            newTestResult.name = req.body.name
            newTestResult.email = req.body.email
            newTestResult.postTitle = req.body.postTitle
            newTestResult.testResult = req.body.testResult

            await newTestResult.save()
            res.status(200).json({ "testResult": newTestResult });
        } 
        
        catch (error){
            console.log(error);
            res.status(500).json({
                "status": "fail",
                "message": error.message
            })
        }
    }

    const getAllResults = async (req, res) => {

        try{
            const results = await testResultModel.find();

            res.status(200).json({ "testResults": results });
        } 
        
        catch (error){
            console.log(error);
            res.status(500).json({
                "status": "fail",
                "message": error.message
            })
        }
    }

    const deleteResultById = async (req, res) => {
        try{
            await testResultModel.deleteOne({_id: req.params.id});
            res.status(200).json({ "deletedResult": "Test result deleted successfully" });
        } 
        
        catch (error){
            console.log(error);
            res.status(500).json({
                "status": "fail",
                "message": error.message
            })
        }
    }


    const sendInvitation = async (req, res) => {
        try{
            const testedUser = await testResultModel.findOne({_id: req.params.id});

        // Email sender details
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                user: "ndicunguyesteve4@gmail.com",
                pass: "qlbtvfaoozcoyvzb"
                },
                tls:{
                rejectUnauthorized: false
                }
            })

            // Send verification email to user
            const mailOptions = {
                from: ' "Invitation" <ndicunguyesteve4@gmail.com>',
                to: testedUser.email,
                
                subject: "University Social Network - Invitation",
                html: `
                <div style="padding: 10px;">
                    <h3> <span style="color: #414A4C;">${testedUser.name}</span> congratulations! </h3> 
                    <h4> 
                    You took an uptitude test on post <span style="color: #414A4C;">${testedUser.postTitle}</span>
                    and got <span style="color: #414A4C;">${testedUser.testResult}/10</span>. We would like to invite you
                    for an interview in case you are interested. Please contact our office on
                    <span style="color: #414A4C;">+250788619790</span> to schedule your interview. Thank you!
                    </h4>
                </div>
                `
            }

            // Sending the email
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error)
                }

                else{
                    console.log("Invitation sent!")
                     
                }
                response.status(200).json({
                    "invitationSuccess": "Invitation sent!",
                })
            })

        } 
        
        catch (error){
            console.log(error);
            res.status(500).json({
                "status": "fail",
                "message": error.message
            })
        }
    }



export default {createPost, updatePostById, getPosts, getPostsById, 
    deletePostById, getPostsByCategory, sendInvitation, 
    getPostsByFaculty, saveTestResult, getAllResults, deleteResultById, getPostsByCategoryAndFaculty}