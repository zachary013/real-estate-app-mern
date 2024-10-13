import prisma from "../lib/prisma.js";

export const getPosts = async (req, res) => {
    const query = req.query;
    //console.log(query);
    try {
        const posts = await prisma.post.findMany({
            where: {
                city: query.city || undefined,
                type: query.type || undefined,
                property: query.property || undefined,
                bedroom: parseInt(query.bedroom) || undefined,
                price: {
                    gte: parseInt(query.minPrice) || 0,
                    lte: parseInt(query.maxPrice) || 10000000,
                }
            }
        });
        // setTimeout(() => {
        // }, 1000);

        res.status(200).json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get posts!" });
    }
}


export const getPost = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                postDetail: true,
                user: {
                    select: { username: true, avatar: true }
                },
            }
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const token = req.cookies?.token;
        let isSaved = false;

        if (token) {
            try {
                const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
                const saved = await prisma.savedPost.findUnique({
                    where: {
                        userId_postId: {
                            postId: id,
                            userId: payload.id,
                        },
                    },
                });
                isSaved = !!saved;
            } catch (err) {
                console.error("Token verification failed:", err);
            }
        }

        res.status(200).json({ ...post, isSaved });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get post!" });
    }
}


export const addPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;

    try {
        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                userId: tokenUserId,
                postDetail: {
                    create: body.postDetail,
                }
            },
        });
        res.status(200).json(newPost);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create post!" });
    }
}


export const updatePost = async (req, res) => {
    try {

        res.status(200).json();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to update post!" });
    }
}


export const deletePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    try {
        const post = await prisma.post.findUnique({
            where: { id }
        });

        if (post.userId !== tokenUserId) {
            return res.status(403).json({ message: "Not Authorized!" });
        }

        await prisma.post.delete({
            where: { id }
        });


        res.status(200).json({ message: "Post deleted successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to delete post!" });
    }
}