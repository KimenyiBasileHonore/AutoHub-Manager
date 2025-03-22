import express from 'express';
const router = express.Router();
import { getAllAnnouncement, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement, countAnnouncement } from "../controllers/announcementController.js";


router.get("/announcement", getAllAnnouncement);
router.get("/announcement/:id", getAnnouncementById);
router.post("/announcement/", createAnnouncement);
router.put("/announcement/:id", updateAnnouncement);
router.delete("/announcement/:id",  deleteAnnouncement);
router.get("/countTitles", countAnnouncement);

export default router;
