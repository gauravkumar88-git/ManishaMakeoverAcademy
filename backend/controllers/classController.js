const Class = require('../models/Class');
const ClassPurchase = require("../models/ClassPurchase");
const { Attendance, Notification } = require('../models/index');

// @GET /api/classes
exports.getAllClasses = async (req, res) => {
  const { category, status, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;

  const classes = await Class.find(filter)
    .sort({ date: 1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Class.countDocuments(filter);
  res.json({ success: true, classes, total, pages: Math.ceil(total / limit) });
};

// @GET /api/classes/:id
exports.getClass = async (req, res) => {
  const cls = await Class.findById(req.params.id);
  if (!cls) return res.status(404).json({ success: false, message: 'Class not found.' });
  res.json({ success: true, class: cls });
};

// @POST /api/classes  (admin)
exports.createClass = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
  title,
  description,
  instructor,
  category,
  date,
  time,
  duration,
  meetLink,
  requiredPlan,
  accessType,
  price,
  tags
} = req.body;

    const thumbnail = req.file ? req.file.path : '';

    let parsedTags = [];

    if (Array.isArray(tags)) {
      parsedTags = tags;
    } else if (typeof tags === 'string' && tags.trim()) {
      try {
        parsedTags = JSON.parse(tags);
      } catch {
        parsedTags = tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean);
      }
    }

 const cls = await Class.create({
  title,
  description,
  instructor,
  category,
  date,
  time,
  duration,
  meetLink,

  accessType,
  price,

  requiredPlan,
  tags: parsedTags,
  thumbnail
});

    try {
      await Notification.create({
        isGlobal: true,
        title: `New Class: ${title} 📚`,
        message: `A new class has been scheduled on ${new Date(date).toDateString()} at ${time}. Instructor: ${instructor}`,
        type: 'class',
        link: `/classes/${cls._id}`,
      });
    } catch (notificationError) {
      console.error("NOTIFICATION ERROR:", notificationError);
    }

    res.status(201).json({
      success: true,
      class: cls
    });

  } catch (error) {
    console.error("CREATE CLASS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
};
// @PUT /api/classes/:id  (admin)
// @PUT /api/classes/:id
exports.updateClass = async (req, res) => {
  try {
    console.log("UPDATE BODY:", req.body);
    console.log("UPDATE FILE:", req.file);

    const updateData = { ...req.body };

    // Remove fields that should never be updated
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.enrolledStudents;

    // Update thumbnail only if new image uploaded
    if (req.file) {
      updateData.thumbnail = req.file.path;
    }

    // Handle tags safely
    if (updateData.tags) {
      if (Array.isArray(updateData.tags)) {
        updateData.tags = updateData.tags;
      } else if (typeof updateData.tags === "string") {
        try {
          updateData.tags = JSON.parse(updateData.tags);
        } catch {
          updateData.tags = updateData.tags
            .split(",")
            .map(tag => tag.trim())
            .filter(Boolean);
        }
      }
    }

    const cls = await Class.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!cls) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.json({
      success: true,
      class: cls,
    });

  } catch (error) {
    console.error("UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};
// @DELETE /api/classes/:id  (admin)
exports.deleteClass = async (req, res) => {
  const cls = await Class.findByIdAndDelete(req.params.id);
  if (!cls) return res.status(404).json({ success: false, message: 'Class not found.' });
  res.json({ success: true, message: 'Class deleted.' });
};



// @POST /api/classes/:id/join
exports.joinClass = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);

    if (!cls) {
      return res.status(404).json({
        success: false,
        message: "Class not found.",
      });
    }

    // ===== Individual purchased class =====
    if (cls.accessType === "individual") {
      const purchase = await ClassPurchase.findOne({
        userId: req.user._id,
        classId: cls._id,
        status: "paid",
      });

      if (!purchase) {
        return res.status(403).json({
          success: false,
          message: "Please purchase this class first.",
        });
      }
    }

    // ===== Batch subscription class =====
    else {
      if (!req.user.isSubscriptionValid()) {
        return res.status(403).json({
          success: false,
          message: "Active subscription required.",
        });
      }

      const planOrder = {
        basic: 1,
        premium: 2,
        vip: 3,
      };

      const userPlanLevel =
        planOrder[req.user.subscriptionPlan] || 0;

      const requiredLevel =
        planOrder[cls.requiredPlan] || 1;

      if (userPlanLevel < requiredLevel) {
        return res.status(403).json({
          success: false,
          message: `This class requires ${cls.requiredPlan} plan or higher.`,
        });
      }
    }

    // Attendance
    await Attendance.findOneAndUpdate(
      {
        userId: req.user._id,
        classId: cls._id,
      },
      {
        userId: req.user._id,
        classId: cls._id,
        joinTime: new Date(),
        status: "present",
      },
      {
        upsert: true,
        new: true,
      }
    );

    // Enroll user
    const alreadyJoined = cls.enrolledStudents.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!alreadyJoined) {
      cls.enrolledStudents.push(req.user._id);
      await cls.save();
    }

    return res.json({
      success: true,
      meetLink: cls.meetLink,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @GET /api/classes/upcoming  (public)
exports.getUpcomingClasses = async (req, res) => {
  const classes = await Class.find({ status: 'upcoming', date: { $gte: new Date() } })
    .sort({ date: 1 }).limit(6);
  res.json({ success: true, classes });
};
