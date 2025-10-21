import DOMPurify from "isomorphic-dompurify";

// Custom validation functions to replace validator
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isAlphanumeric = (str) => {
  return /^[a-zA-Z0-9]+$/.test(str);
};

// Input sanitization middleware
export const sanitizeInput = (req, res, next) => {
  // Sanitize string inputs
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        // Remove HTML tags and sanitize
        req.body[key] = DOMPurify.sanitize(req.body[key], {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
        });

        // Trim whitespace
        req.body[key] = req.body[key].trim();
      }
    });
  }

  next();
};

// Input validation middleware
export const validateBlogInput = (req, res, next) => {
  const { title, description, content } = req.body;
  const errors = [];

  // Validate title
  if (!title || typeof title !== "string") {
    errors.push("Title is required and must be a string");
  } else if (title.length < 3 || title.length > 200) {
    errors.push("Title must be between 3 and 200 characters");
  }

  // Validate description
  if (!description || typeof description !== "string") {
    errors.push("Description is required and must be a string");
  } else if (description.length < 10 || description.length > 500) {
    errors.push("Description must be between 10 and 500 characters");
  }

  // Validate content
  if (content && typeof content === "string" && content.length > 50000) {
    errors.push("Content must be less than 50,000 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
};

// Username validation
export const validateUsername = (req, res, next) => {
  const { username } = req.body;
  const errors = [];

  if (!username || typeof username !== "string") {
    errors.push("Username is required and must be a string");
  } else {
    // Username validation rules
    if (username.length < 3 || username.length > 30) {
      errors.push("Username must be between 3 and 30 characters");
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push(
        "Username can only contain letters, numbers, hyphens, and underscores"
      );
    }

    if (username.startsWith("-") || username.endsWith("-")) {
      errors.push("Username cannot start or end with a hyphen");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
};

// Comment validation
export const validateComment = (req, res, next) => {
  const { text } = req.body;
  const errors = [];

  if (!text || typeof text !== "string") {
    errors.push("Comment text is required and must be a string");
  } else if (text.length < 1 || text.length > 1000) {
    errors.push("Comment must be between 1 and 1000 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
};
