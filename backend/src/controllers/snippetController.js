import asyncHandler from "express-async-handler";
import Snippet from "../models/snippetModel.js";

// @desc    Get snippets for logged in user
// @route   GET /api/snippets
// @access  Private
export const getSnippets = asyncHandler(async (req, res) => {
  const snippets = await Snippet.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(snippets);
});

// @desc    Get single snippet by ID
// @route   GET /api/snippets/:id
// @access  Private
export const getSnippetById = asyncHandler(async (req, res) => {
  const snippet = await Snippet.findById(req.params.id);

  if (!snippet) {
    res.status(404);
    throw new Error("Snippet not found");
  }

  // Ensure snippet belongs to user
  if (snippet.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to access this snippet");
  }

  res.json(snippet);
});

// @desc    Create a new snippet
// @route   POST /api/snippets
// @access  Private
export const createSnippet = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!content) {
    res.status(400);
    throw new Error("Snippet content is required");
  }

  const snippet = await Snippet.create({
    user: req.user._id,
    title: title || "Untitled",
    content,
  });

  res.status(201).json(snippet);
});

// @desc    Update a snippet
// @route   PUT /api/snippets/:id
// @access  Private
export const updateSnippet = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const snippet = await Snippet.findById(req.params.id);

  if (!snippet) {
    res.status(404);
    throw new Error("Snippet not found");
  }

  // Ensure snippet belongs to user
  if (snippet.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to update this snippet");
  }

  snippet.title = title !== undefined ? title : snippet.title;
  snippet.content = content !== undefined ? content : snippet.content;

  const updatedSnippet = await snippet.save();
  res.json(updatedSnippet);
});

// @desc    Delete a snippet
// @route   DELETE /api/snippets/:id
// @access  Private
export const deleteSnippet = asyncHandler(async (req, res) => {
  const snippet = await Snippet.findById(req.params.id);

  if (!snippet) {
    res.status(404);
    throw new Error("Snippet not found");
  }

  // Ensure snippet belongs to user
  if (snippet.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to delete this snippet");
  }

  await snippet.deleteOne();
  res.json({ id: req.params.id, message: "Snippet removed successfully" });
});
