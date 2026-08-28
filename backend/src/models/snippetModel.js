import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add a snippet title"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Please add snippet content"],
    },
  },
  {
    timestamps: true,
  },
);

snippetSchema.index({ user: 1, createdAt: -1 });

const Snippet = mongoose.model("Snippet", snippetSchema);

export default Snippet;
