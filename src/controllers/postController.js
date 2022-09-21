import BlogPost from '../models/blogModel.js';
import  articleValidation  from '../middlewares/blogValidation.js';


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
            console.log(req.file)
            console.log(req.files)
            if(blog){
                if(!req.files){
                blog.title = req.body.title || blog.title,
                blog.body = req.body.body || blog.body,
                blog.authorName = req.body.authorName || blog.authorName,
                blog.category = req.body.category || blog.category
                }

                else{
                
                const postImages = `${req.protocol}://${req.get("host")}/postImages/${req.files.post[0].filename}`;
                const authorImages = `${req.protocol}://${req.get("host")}/postImages/${req.files.author[0].filename}`;
                
                blog.imgLink = postImages || blog.imgLink,
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



export default {createPost, updatePostById, getPosts, getPostsById, deletePostById, getPostsByCategory}