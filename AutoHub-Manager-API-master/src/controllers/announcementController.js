import AnnouncementModel from "../models/announcement.js";


export const getAllAnnouncement = async (req, res) => {
  try {
    const announcementData = await AnnouncementModel.find();
    res.json(announcementData);
  } catch (error) {
    console.error("Error fetching Announcement data:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await AnnouncementModel.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: "AnnouncementModel not found" });
    }
    res.json(announcement);
  } catch (error) {
    console.error("Error fetching announcement:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const createAnnouncement = async (req, res) => {
  try {
    const { title, summary, details } = req.body;
    const newAnnouncement = new AnnouncementModel({ title, summary, details });
    await newAnnouncement.save();
    res.json(newAnnouncement);
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const updateAnnouncement = async (req, res) => {
  try {
    const { title, summary, details } = req.body;
    const announcement = await AnnouncementModel.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: "announcement not found" });
    }
    announcement.title = title;
    announcement.summary = summary;
    announcement.details = details;
    await announcement.save();
    res.json(announcement);
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await AnnouncementModel.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: "Ibyannouncementivugo not found" });
    }
    res.json({ message: "announcement deleted successfully" });
  } catch (error) {
    console.error("Error deleting Ibyivugo:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const countAnnouncement = async (req, res) => {
  try {
    const titleCount = await AnnouncementModel.countDocuments();
    res.status(200).json({ count: titleCount });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
