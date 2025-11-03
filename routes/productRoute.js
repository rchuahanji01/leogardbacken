// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const Product = require("../models/productSchema");

// const router = express.Router();

// // 🗂️ Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // ✅ Add New Product with Multiple Images
// router.post("/", upload.array("images", 5), async (req, res) => {
//   try {
//     const { name, description, composition, category, packSize, keyPoints } = req.body;
//     const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

//     const product = new Product({
//       name,
//       description,
//       composition,
//       category,
//       packSize,
//       keyPoints: keyPoints ? keyPoints.split(",") : [],
//       images: imagePaths,
//     });

//     await product.save();

//     res.json({ message: " Product added successfully", product });
//   } catch (error) {
//     console.error("Error saving product:", error);
//     res.status(500).json({ error: "Failed to save product" });
//   }
// });

// // ✅ Get All Products
// // router.get("/", async (req, res) => {
// //   try {
// //     const products = await Product.find();
// //     res.json(products);
// //   } catch (error) {
// //     res.status(500).json({ error: "Failed to fetch products" });
// //   }
// // });
// router.get("/", async (req, res) => {
//   try {
//     const { category } = req.query;
//     const products = category
//       ? await Product.find({ category })
//       : await Product.find();
//     res.json(products);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// });


// // PUT - update product
// router.put("/:id", upload.array("images", 5), async (req, res) => {
//   try {
//     const updates = req.body;
//     if (req.files.length > 0) {
//       updates.images = req.files.map((f) => `/uploads/${f.filename}`);
//     }
//     const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update product" });
//   }
// });

// // DELETE - remove product
// router.delete("/:id", async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);
//     res.json({ message: "Product deleted" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete product" });
//   }
// });


// module.exports = router;

const express = require("express");
const multer = require("multer");
const path = require("path");
const Product = require("../models/productSchema");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ✅ Add product
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const { name, ingredients, description, indications, category } = req.body;
    const imagePaths = req.files.map((f) => `/uploads/${f.filename}`);

    const product = new Product({
      name,
      ingredients,
      description,
      indications: indications ? indications.split(",") : [],
      category,
      images: imagePaths,
    });

    await product.save();
    res.json({ message: "✅ Product added successfully", product });
  } catch (err) {
    console.error("Error saving product:", err);
    res.status(500).json({ error: "Failed to save product" });
  }
});

// ✅ Get all or filter by category
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const products = category
      ? await Product.find({ category })
      : await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ✅ Get single product by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch product" });
//   }
// });

// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// });

router.get("/", async (req, res) => {
  try {
    // Extract page and limit from query parameters (with defaults)
    let { page = 1, limit = 10 } = req.query;

    // Convert to numbers to avoid string issues
    page = parseInt(page);
    limit = parseInt(limit);

    // Calculate how many products to skip
    const skip = (page - 1) * limit;

    // Fetch paginated products
    const products = await Product.find()
      .sort({ createdAt: -1 }) // optional: latest first
      .skip(skip)
      .limit(limit);

    // Get total count for pagination info
    const totalProducts = await Product.countDocuments();

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (error) {
    console.error("Error fetching paginated products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});


// ✅ Update product
router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    const updates = req.body;
    if (req.files.length > 0) {
      updates.images = req.files.map((f) => `/uploads/${f.filename}`);
    }
    if (updates.indications) {
      updates.indications = updates.indications.split(",");
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// ✅ Delete
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// ✅ Get all products or filter by category
router.get("/category", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});


module.exports = router;

