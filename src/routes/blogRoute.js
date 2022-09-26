import express from 'express';
const router = express.Router();
import  blogController from '../controllers/postController.js';
import multer from 'multer';

//Post Image
const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './src/postImages');
  },

  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage }).fields(
  [
    {
    name: 'post', 
    maxCount: 900
    }, 
    {
      name: 'author', 
      maxCount: 1
    }
 ]
);

                                           
router.route('/getAllPosts')
    .get(blogController.getPosts)

router.route('/getAllResults')
    .get(blogController.getAllResults)

router.route('/getSinglePost/:id')
    .get(blogController.getPostsById)

router.route('/sendInvitation/:id')
    .get(blogController.sendInvitation)

router.route('/getPostsByCategory/:category')
    .get(blogController.getPostsByCategory)

router.route('/getPostsByCategoryAndFaculty/:category/:faculty')
    .get(blogController.getPostsByCategoryAndFaculty)

router.route('/getPostsByFaculty/:faculty')
    .get(blogController.getPostsByFaculty)

router.route('/deletePost/:id')
 .delete(blogController.deletePostById)

router.route('/deleteResult/:id')
 .delete(blogController.deleteResultById)
 
router.put(
    "/updatePost/:id", upload, 
    blogController.updatePostById
    )

router.post(
  "/createPost", upload, 
  blogController.createPost
  )

router.post("/saveTestResult", blogController.saveTestResult)


export default router;