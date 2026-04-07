import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { PAGINATION, HTTP_STATUS } from "../constants.js";

export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    // Pagination
    const page = parseInt(query.page) || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(parseInt(query.limit) || PAGINATION.POSTS_PER_PAGE, PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      city: query.city ? { contains: query.city, mode: "insensitive" } : undefined,
      type: query.type || undefined,
      property: query.property || undefined,
      bedroom: parseInt(query.bedroom) || undefined,
      price: {
        gte: parseInt(query.minPrice) || undefined,
        lte: parseInt(query.maxPrice) || undefined,
      },
    };

    // Execute query with pagination
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    res.status(HTTP_STATUS.OK).json({
      posts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
        hasMore: page * limit < total,
      },
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(HTTP_STATUS.SERVER_ERROR).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    const token = req.cookies?.token;
    let isSaved = false;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (payload) {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
          isSaved = !!saved;
        }
      } catch (err) {
        // Token verification failed, isSaved remains false
      }
    }

    res.status(200).json({ ...post, isSaved });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    // Verify user is a seller
    const user = await prisma.user.findUnique({
      where: { id: tokenUserId }
    });

    if (!user || user.userType !== 'seller') {
      return res.status(403).json({
        success: false,
        message: "Only sellers can create property listings"
      });
    }

    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  try {
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update posts" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
