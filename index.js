import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import dotenv from "dotenv";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import flash from "connect-flash";
import helmet from "helmet";
import compression from "compression";
import connectPg from "connect-pg-simple";

dotenv.config();
//env.config(); // load .env
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(compression());
app.set("trust proxy", 1); // ✅ required behind HTTPS reverse proxies

//const port = process.env.PORT || 3000;
const saltRounds = 12;

// ---------- Middleware ----------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // public folder for css/js/images
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const PgSession = connectPg(session);
app.use(
  session({
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Railway is HTTPS
      sameSite: "lax",
      httpOnly: true,
      maxAge: 1000 * 60 * 30,
    },
  })
);

// Passport must be initialized after session
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// --- Make flash messages available to all views ---
app.use((req, res, next) => {
  res.locals.message = req.flash("error");
  next();
});

// Rate limiter: basic protection while testing
const authLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Try again later.",
});
app.use("/login", authLimiter);
// ---------- Postgres (dev client) ----------

//app.use(
//  helmet({
//    contentSecurityPolicy: false,
//    crossOriginEmbedderPolicy: false,
// })
//);

// ---------- Security headers with Helmet ----------
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: true, // Enable unless you know you need it off
  })
);
// ============================

// Ensure PORT environment variable is defined
const port = process.env.POR || 3000;
if (!port) {
  throw new Error("PORT environment variable is not defined.");
}
const { Pool } = pkg;

//const { Client } = pkg;

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function connectDB() {
  try {
    await db.connect();
    console.log("Postgres connected");

    // Test query
    const res = await db.query("SELECT NOW()");
    console.log("DB time:", res.rows[0].now);
  } catch (err) {
    console.error("Postgres connection/query error:", err);
  }
}

connectDB();

// password validation help
function isValidPassword(password) {
  const minLength = 8;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  const hasUppercase = /[A-Z]/;
  if (!password || typeof password !== "string") return false;
  return (
    password.length >= minLength &&
    hasNumber.test(password) &&
    hasSpecialChar.test(password) &&
    hasUppercase.test(password)
  );
}

// ---------- Routes (keep your original routes) ----------

// Home
app.get("/", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  res.render("index.ejs", { defaultDate: today });
});

// About
app.get("/about", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  res.render("about.ejs", { defaultDate: today });
});

// Contact
app.get("/contact", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  res.render("contact.ejs", { defaultDate: today, thanks: null });
});

app.post("/contact", async (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const commu = req.body.communication;
  const comment = req.body.text;

  try {
    await db.query(
      "INSERT INTO cliinfo (name, phone, email, commu, comment) VALUES ($1, $2, $3, $4, $5)",
      [name, phone, email, commu, comment]
    );
    const today = new Date().toISOString().split("T")[0];
    res.render("contact.ejs", {
      defaultDate: today,
      thanks: "Thank you for your message",
    });
  } catch (error) {
    console.error("Contact insert error:", error);
    res.status(500).send("Error saving contact message");
  }
});

// Link pages
app.get("/link", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  res.render("link.ejs", { defaultDate: today });
});
app.get("/anotherlink", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  res.render("anotherlink.ejs", { defaultDate: today });
});
app.get("/otherlink", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  res.render("otherlink.ejs", { defaultDate: today });
});
app.get("/calculate", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  res.render("calculator.ejs", { defaultDate: today });
});
app.get("/mortgage", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  res.render("mortgage.ejs", { defaultDate: today });
});
app.get("/hana", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  res.render("hana.ejs", { defaultDate: today });
});

const adminEmails = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",").map((email) => email.trim())
  : [];

console.log(adminEmails);
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // Proceed to route handler
  }
  res.redirect("/login"); // Redirect unauthenticated users
}
// Tax page
app.get("/tax", ensureAuthenticated, async (req, res) => {
  console.log("req.user:", req.user); // Debug: check logged in user info

  const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD

  try {
    // Query tax data from database
    const result = await db.query("SELECT * FROM taxrate_2025 ORDER BY id");

    // Render tax page with data
    res.render("tax.ejs", {
      defaultDate: today,
      taxData: result.rows,
    });
  } catch (err) {
    console.error("Error loading tax data:", err);
    res.status(500).send("Error loading tax data");
  }
});

app.get("/mes", ensureAuthenticated, async (req, res) => {
  console.log("req.user:", req.user); // Debug: logged-in user info

  const today = new Date().toISOString().split("T")[0];

  // Check if user email is allowed admin email Refer to line 467
  if (!adminEmails.includes(req.user.email)) {
    // User is logged in but NOT authorized to view this page
    return res.status(403).render("denied.ejs", {
      // denied.ejs 👈
      defaultDate: today,
      message: "Access denied: You are not authorized to view this page.",
    });
  }

  try {
    // Query message data from database
    const result = await db.query("SELECT * FROM cliinfo ORDER BY id");

    // Render admin mes page with data
    res.render("mes.ejs", {
      defaultDate: today,
      mes: result.rows,
    });
  } catch (err) {
    console.error("Error loading data:", err);
    res.status(500).send("Error loading data");
  }
});
//end new /mes
//Add message table end
//

//
// Login / Signup / Change password pages
app.get("/login", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  //  const messages = req.flash("error"); // 👈 Get flash messages
  res.render("login.ejs", {
    defaultDate: today,
  });
});
app.get("/signup", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  res.render("register.ejs", { errors: {}, defaultDate: today, formData: {} });
});
app.get("/chapw", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  res.render("chapw.ejs", { defaultDate: today, message: null });
});

// ---------- Logout (FIXED) ----------
app.get("/logout", (req, res, next) => {
  // Passport 0.6+ requires callback in logout
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // Destroy session and clear cookie (good dev-friendly behavior)
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      // Redirect to home or login — your original code rendered index; we redirect to login for clarity
      res.redirect("/");
    });
  });
});

// ---------- Signup logic ----------
app.post("/signup", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const email = req.body.username?.trim();
  const password = req.body.password;

  const errors = {};
  const formData = { email, password };

  try {
    // ✅ Step 1: Check if email exists — fast, minimal query
    const checkUser = await db.query(
      "SELECT 1 FROM my_user WHERE email = $1 LIMIT 1",
      [email]
    );

    if (checkUser.rowCount > 0) {
      return res.render("register.ejs", {
        errors: { email: "Email already exists. Please sign in instead." },
        defaultDate: today,
        formData,
      });
    }

    // ✅ Step 2: Validate password
    if (!isValidPassword(password)) {
      return res.render("register.ejs", {
        errors: {
          password:
            "Password must be at least 8 characters long and include at least one number, one special character, and one uppercase letter.",
        },
        defaultDate: today,
        formData,
      });
    }

    // ✅ Step 3: Hash and insert
    const hash = await bcrypt.hash(password, saltRounds);

    const result = await db.query(
      "INSERT INTO my_user (email, pw) VALUES ($1, $2) RETURNING *",
      [email, hash]
    );

    const user = result.rows[0];

    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error("Login after signup error:", loginErr);
        return res.redirect("/login");
      }

      res.redirect("/tax");
    });
  } catch (err) {
    console.error("Signup route error:", err);
    res.status(500).send("Error signing up");
  }
});

//  Passport local strategy
passport.use(
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM my_user WHERE email = $1", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.pw;
        bcrypt.compare(password, storedHashedPassword, (err, match) => {
          if (err) return cb(err);
          if (match) {
            return cb(null, user);
          } else {
            return cb(null, false);
          }
        });
      } else {
        return cb(null, false); // do not reveal "User not found" to client
      }
    } catch (err) {
      return cb(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user.id); // store only the user.id
});

// Deserialize by looking up the user from DB
passport.deserializeUser(async (id, cb) => {
  try {
    const result = await db.query("SELECT * FROM my_user WHERE id=$1", [id]);
    if (result.rows.length === 0) return cb(null, false);
    cb(null, result.rows[0]); // full user object available in req.user
  } catch (err) {
    cb(err);
  }
});

// app.post /login
app.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // 1. Find user by email
    const result = await db.query("SELECT * FROM my_user WHERE email = $1", [
      username,
    ]);

    if (result.rows.length === 0) {
      req.flash("error", "Invalid username or password.");
      return res.redirect("/login");
    }

    const user = result.rows[0];

    // 2. Compare password using async bcrypt
    const match = await bcrypt.compare(password, user.pw);

    if (!match) {
      req.flash("error", "Invalid username or password.");
      return res.redirect("/login");
    }

    // 3. Log the user in
    req.logIn(user, (err) => {
      if (err) return next(err);

      // 4. Set admin session flag
      req.session.isAdmin = adminEmails.includes(user.email);

      // 5. Redirect based on admin status
      return res.redirect(req.session.isAdmin ? "/mes" : "/tax");
    });
  } catch (err) {
    console.error("Login error:", err);
    return next(err);
  }
});

//new app.post /login

// ---------- Change password POST ----------
app.post("/chapw", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const { email, newPassword, confirmPassword } = req.body;

  // ✅ Early input validation
  if (!email || !newPassword || !confirmPassword) {
    return res.render("chapw.ejs", {
      message: "All fields are required",
      defaultDate: today,
    });
  }

  if (newPassword !== confirmPassword) {
    return res.render("chapw.ejs", {
      message: "Passwords do not match",
      defaultDate: today,
    });
  }

  if (!isValidPassword(newPassword)) {
    return res.render("chapw.ejs", {
      message:
        "Password must be at least 8 characters and include a number, special character, and a capital letter",
      defaultDate: today,
    });
  }

  try {
    // ✅ Step 1: Hash password (async)
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // ✅ Step 2: Update only if user exists (single query, fast)
    const result = await db.query(
      "UPDATE my_user SET pw = $1 WHERE email = $2 RETURNING email",
      [hashedPassword, email.trim()]
    );

    // ✅ Step 3: Check if user was updated
    if (result.rowCount === 0) {
      return res.render("chapw.ejs", {
        message: "Email not registered",
        defaultDate: today,
      });
    }

    // ✅ Step 4: Success message
    res.render("chapw.ejs", {
      message: "Password updated successfully!",
      defaultDate: today,
    });
  } catch (err) {
    console.error("Error updating password:", err);
    res.render("chapw.ejs", {
      message: "Something went wrong, try again later",
      defaultDate: today,
    });
  }
});
// ---------- Change password POST ----------
// ---------- Global error handler ----------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  // Keep it simple in dev
  res.status(500).send("Server error");
});
// add tracking functions

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && adminEmails.includes(req.user.email)) {
    return next();
  }
  return res.status(403).render("HN.ejs", {
    //ejs here actual page 👆
    message: "Thank you for visiting Hieu Nguyen Page.",
    defaultDate: new Date().toISOString().split("T")[0],
  });
}

// Route: Track visitor IP and update counts
app.get("/track-visitor", async (req, res) => {
  try {
    // Get visitor IP from headers or connection info
    const ipAddress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;

    // Check if visitor exists
    const existingVisitor = await db.query(
      "SELECT * FROM visitors WHERE ip_address = $1",
      [ipAddress]
    );

    if (existingVisitor.rows.length === 0) {
      // New visitor: insert IP and timestamp
      await db.query(
        "INSERT INTO visitors (ip_address, visited_at) VALUES ($1, NOW()) RETURNING *",
        [ipAddress]
      );
      // Update total count and timestamp in visits table
      await db.query(
        "UPDATE visits SET total_count = total_count + 1, last_updated = NOW() WHERE id = 1"
      );
    } else {
      // Existing visitor: update last visit timestamp
      await db.query(
        "UPDATE visitors SET visited_at = NOW() WHERE ip_address = $1",
        [ipAddress]
      );
    }

    res.send("Visitor tracked");
  } catch (error) {
    console.error("Error tracking visitor:", error);
    res.status(500).send("Internal server error");
  }
});

app.get("/hnpage", ensureAdmin, async (req, res) => {
  try {
    // 1. Pagination setup: how many items per page and which page
    const limit = 20; // Number of visitors per page
    const page = parseInt(req.query.page) || 1; // Current page, default to 1
    const offset = (page - 1) * limit; // Calculate offset for SQL query

    // 2. Read filter query params from URL
    const { startDate, endDate, search } = req.query;

    // 3. Build base SQL query for visitors with dynamic filters
    // '1=1' is a trick to simplify query building (always true)
    let baseQuery = "FROM visitors WHERE 1=1";
    const params = [];
    let paramIndex = 1; // Track SQL param index for $1, $2, etc.

    // 4. Add date range filter if startDate provided
    if (startDate) {
      baseQuery += ` AND visited_at >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    // 5. Add date range filter if endDate provided (include whole day until 23:59:59)
    if (endDate) {
      baseQuery += ` AND visited_at <= $${paramIndex}`;
      params.push(endDate + " 23:59:59");
      paramIndex++;
    }

    // 6. Add IP address search filter if provided (case-insensitive search)
    if (search) {
      baseQuery += ` AND ip_address ILIKE $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // 7. Get total count of filtered visitors for pagination
    const countResult = await db.query(`SELECT COUNT(*) ${baseQuery}`, params);
    const totalVisitors = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalVisitors / limit);

    // 8. Fetch filtered visitors with pagination (limit + offset)
    const visitorsResult = await db.query(
      `SELECT ip_address, visited_at ${baseQuery} ORDER BY visited_at DESC LIMIT $${paramIndex} OFFSET $${
        paramIndex + 1
      }`,
      [...params, limit, offset]
    );

    // 9. Fetch total_count and last_updated from visits table (single row)
    const visitsResult = await db.query(
      "SELECT total_count, last_updated FROM visits WHERE id = 1"
    );
    const visitStats = visitsResult.rows[0] || {
      total_count: 0,
      last_updated: null,
    };

    // 10. Render the visitor stats page, passing data, filters, pagination info, and admin info
    res.render("thongsuot.ejs", {
      totalCount: visitStats.total_count,
      lastUpdated: visitStats.last_updated,
      visitors: visitorsResult.rows,
      defaultDate: new Date().toISOString().split("T")[0],

      // Keep filters for form inputs so user can see active filters
      startDate: startDate || "",
      endDate: endDate || "",
      search: search || "",

      // Pagination details
      currentPage: page,
      totalPages,

      // Admin info and success message
      adminEmail: req.user?.email || "Admin",
      message: "Visitor statistics loaded successfully.",
    });
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
    res.status(500).send("Internal server error");
  }
});

app.listen(port, () => {
  const mode = process.env.NODE_ENV || "production";
  console.log(`✅ Server running in ${mode} mode on port ${port}`);
});
