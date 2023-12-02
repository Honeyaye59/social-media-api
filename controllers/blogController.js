const Blog = require('./../models/blogModel');
const User = require('./../models/userModel')

exports.getAllBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find();
        if(!blogs){
            return res.status(404).json({
                message: 'No Blogs Found'
            })
        }
        res.status(200).json({
            blogs
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        })
    }
}

exports.addBlog = async(req, res, next) => {
    const { title, description, image, user } = req.body;
    try {
        
    // Create a new blog
        const newBlog = await Blog.create({
            title,
            description,
            image,
            user
        })
        const blogOwner = await User.findById(user);
        if(!blogOwner){
            return res.status(404).json({
                message: 'User Not Found'
            })
        }
        // Update user's blogs array
        blogOwner.blogs.push(newBlog._id);
        await blogOwner.save();

        res.status(201).json({
            message: 'Created Successfully'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        })
    }
}

exports.updateBlog = async (req, res, next) => {
    const { title, description, userId } = req.body;
    const id = req.params.id;
    try {
        const isExistBlog = await Blog.findById(id);
        if(!isExistBlog){
            return res.status(404).json({
                message: 'Blog Not Found'
            })
        }
        // if(isExistBlog.user.toString() !== userId){
        //     return res.status(403).json({
        //         message: 'Unauthorized: You do not have permission to update this blog'
        //     })
        // }
        const updatedBlog = await Blog.findByIdAndUpdate(id, {title, description}, {new: true}) //To return updated value from db

        if(!updatedBlog){
            return res.status(500).json({
                message: 'Unable to Update'
            })
        }
        res.status(200).json({
            blog: updatedBlog
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getBlogById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const blog = await Blog.findById(id);
        if(!blog){
            return res.status(404).json({
                message: 'No BLog Found'
            })
        }
        res.status(200).json({
            blog
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        })
    }
}

exports.deleteBlog = async (req, res, next) =>{
    const blogId = req.params.id;
    const userId = req.body.user;
    try {
        const isExistBlog = await Blog.findById(blogId);
        if(!isExistBlog){
            return res.status(404).json({
                message: 'Blog Not Found'
            })
        }
         // Check if the user has the right to delete this blog
    if (isExistBlog.user.toString() !== userId) {
        return res.status(403).json({ error: 'Unauthorized: You do not have permission to delete this blog' });
      }
        const deletedBlog = await Blog.findByIdAndDelete(blogId);
        if(!deletedBlog){
            return res.status(500).json({
                message: 'Unable to Delete'
            })
        }
        const user = await User.findByIdAndUpdate(userId, {$pull: {blogs: blogId}}, {new: true});
        res.status(200).json({
            message: 'Successfully Deleted'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getAllBlogsByUser = async (req, res, next) => {
    const userId = req.params.userId;
    console.log(userId)
    try {
        const user = await User.findById(userId).populate("blogs");
        if(!user){
            return res.status(404).json({
                message: 'User Not Found'
            })
        }
        res.status(200).json({
            blogs: user.blogs
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        })
    }
}