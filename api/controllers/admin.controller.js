import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

const parseOptionalInt = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const getAdminStats = async (_req, res) => {
  try {
    const [
      totalProperties,
      totalUsers,
      totalBookings,
      pendingBookings,
      totalSellers,
      totalBuyers,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.user.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "pending" } }),
      prisma.user.count({ where: { userType: "seller" } }),
      prisma.user.count({ where: { userType: "buyer" } }),
    ]);

    res.status(200).json({
      totalProperties,
      totalUsers,
      totalBookings,
      pendingBookings,
      totalSellers,
      totalBuyers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get stats" });
  }
};

export const getAdminBookings = async (_req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phoneNumber: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            price: true,
            address: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get bookings" });
  }
};

export const getAdminUsers = async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        userType: true,
        isAdmin: true,
        accountStatus: true,
        suspendReason: true,
        suspendedAt: true,
        lastLogin: true,
        phoneNumber: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            bookings: true,
            savedPosts: true,
          },
        },
        posts: {
          select: {
            id: true,
            title: true,
            city: true,
            price: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get users" });
  }
};

export const updateAdminUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, phoneNumber, userType, isAdmin } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, password: true },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const data = {
      ...(username !== undefined && { username }),
      ...(email !== undefined && { email }),
      ...(phoneNumber !== undefined && { phoneNumber }),
      ...(userType !== undefined && { userType }),
      ...(typeof isAdmin === "boolean" && { isAdmin }),
    };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        userType: true,
        isAdmin: true,
        phoneNumber: true,
        avatar: true,
        createdAt: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteAdminUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, isAdmin: true, posts: { select: { id: true } } },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const postIds = user.posts.map((post) => post.id);

    if (postIds.length > 0) {
      await prisma.savedPost.deleteMany({
        where: { postId: { in: postIds } },
      });

      await prisma.booking.deleteMany({
        where: { postId: { in: postIds } },
      });

      await prisma.postDetail.deleteMany({
        where: { postId: { in: postIds } },
      });

      await prisma.post.deleteMany({
        where: { id: { in: postIds } },
      });
    }

    await prisma.savedPost.deleteMany({ where: { userId: id } });
    await prisma.booking.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const getAdminProperties = async (_req, res) => {
  try {
    const properties = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        postDetail: true,
        _count: {
          select: {
            bookings: true,
            savedPosts: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get properties" });
  }
};

export const updateAdminProperty = async (req, res) => {
  const { id } = req.params;
  const { postData = {}, postDetail = {} } = req.body;

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { postDetail: true },
    });

    if (!existingPost) {
      return res.status(404).json({ message: "Property not found" });
    }

    const updatedProperty = await prisma.post.update({
      where: { id },
      data: {
        ...(Object.keys(postData).length > 0 && {
          title: postData.title ?? undefined,
          price: parseOptionalInt(postData.price),
          address: postData.address ?? undefined,
          city: postData.city ?? undefined,
          bedroom: parseOptionalInt(postData.bedroom),
          bathroom: parseOptionalInt(postData.bathroom),
          latitude: postData.latitude ?? undefined,
          longitude: postData.longitude ?? undefined,
          type: postData.type ?? undefined,
          property: postData.property ?? undefined,
          modelUrl: postData.modelUrl ?? undefined,
          images: Array.isArray(postData.images) ? postData.images : undefined,
        }),
        ...(Object.keys(postDetail).length > 0 && {
          postDetail: existingPost.postDetail
            ? {
                update: {
                  desc: postDetail.desc ?? undefined,
                  utilities: postDetail.utilities ?? undefined,
                  pet: postDetail.pet ?? undefined,
                  income: postDetail.income ?? undefined,
                  size: parseOptionalInt(postDetail.size),
                  school: parseOptionalInt(postDetail.school),
                  bus: parseOptionalInt(postDetail.bus),
                  restaurant: parseOptionalInt(postDetail.restaurant),
                },
              }
            : {
                create: {
                  desc: postDetail.desc || "",
                  utilities: postDetail.utilities,
                  pet: postDetail.pet,
                  income: postDetail.income,
                  size: parseOptionalInt(postDetail.size),
                  school: parseOptionalInt(postDetail.school),
                  bus: parseOptionalInt(postDetail.bus),
                  restaurant: parseOptionalInt(postDetail.restaurant),
                },
              },
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        postDetail: true,
      },
    });

    res.status(200).json(updatedProperty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update property" });
  }
};

export const deleteAdminProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingPost) {
      return res.status(404).json({ message: "Property not found" });
    }

    await prisma.savedPost.deleteMany({ where: { postId: id } });
    await prisma.booking.deleteMany({ where: { postId: id } });
    await prisma.postDetail.deleteMany({ where: { postId: id } });
    await prisma.post.delete({ where: { id } });

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete property" });
  }
};

// Suspend user account
export const suspendUser = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, isAdmin: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isAdmin) {
      return res.status(403).json({ message: "Cannot suspend admin users" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        accountStatus: "suspended",
        suspendReason: reason || "No reason provided",
        suspendedAt: new Date(),
      },
      select: {
        id: true,
        username: true,
        email: true,
        accountStatus: true,
        suspendReason: true,
        suspendedAt: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to suspend user" });
  }
};

// Activate (unsuspend) user account
export const activateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        accountStatus: "active",
        suspendReason: null,
        suspendedAt: null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        accountStatus: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to activate user" });
  }
};

// Approve property
export const approveProperty = async (req, res) => {
  const { id } = req.params;
  const adminId = req.userId; // From verifyToken middleware

  try {
    const property = await prisma.post.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const updatedProperty = await prisma.post.update({
      where: { id },
      data: {
        status: "approved",
        approvedBy: adminId,
        approvedAt: new Date(),
        rejectionReason: null,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        postDetail: true,
      },
    });

    res.status(200).json(updatedProperty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to approve property" });
  }
};

// Reject property
export const rejectProperty = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  try {
    const property = await prisma.post.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const updatedProperty = await prisma.post.update({
      where: { id },
      data: {
        status: "rejected",
        rejectionReason: reason || "Does not meet quality standards",
        approvedBy: null,
        approvedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        postDetail: true,
      },
    });

    res.status(200).json(updatedProperty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reject property" });
  }
};
