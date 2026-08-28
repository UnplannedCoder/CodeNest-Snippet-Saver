import express from "express";
import {
  getSnippets,
  getSnippetById,
  createSnippet,
  updateSnippet,
  deleteSnippet,
} from "../controllers/snippetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All snippet routes require JWT authentication
router.use(protect);

router.route("/").get(getSnippets).post(createSnippet);

router
  .route("/:id")
  .get(getSnippetById)
  .put(updateSnippet)
  .delete(deleteSnippet);

export default router;
