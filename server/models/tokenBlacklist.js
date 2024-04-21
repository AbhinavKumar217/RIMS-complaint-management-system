const mongoose = require("mongoose");

const tokenBlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    // The timestamp when the token was added to the blacklist
    addedAt: {
      type: Date,
      default: Date.now,
    },
    // Optional: You can add an expiration time for the token to automatically remove old tokens from the blacklist
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema);

module.exports = TokenBlacklist;