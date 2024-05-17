const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Moralis = require("moralis").default;
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const User = require("./models/User");
const DocumentPath = require("./models/DocumentPath");
const DocumentAccessRequest = require("./models/DocumentAccessRequest");
const ApprovedRequest = require("./models/ApprovedRequest");
require("dotenv").config();

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
});

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// mongoose.connect(process.env.MONGO_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// mongoose.connect(process.env.MONGO_URL);
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.once("open", () => console.log("Connected to MongoDB"));

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.Password, 10);

    const user = new User({
      fullName: req.body.fullName,
      Email: req.body.Email,
      Telephone: req.body.Telephone,
      Aadhar: req.body.Aadhar,
      Password: hashedPassword,
    });

    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const { Aadhar, Password } = req.body;

  try {
    const user = await User.findOne({ Aadhar });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(Password, user.Password);

    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/change-password", async (req, res) => {
  const { Aadhar, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ Aadhar });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(oldPassword, user.Password);

    if (!match) {
      return res.status(401).json({ error: "Invalid old password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.Password = hashedNewPassword;
    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Error during password change:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/verifyPassword", async (req, res) => {
  const { aadhar, password } = req.body;

  try {
    // Fetch user details from the database based on Aadhar
    const user = await User.findOne({ Aadhar: aadhar });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const match = await bcrypt.compare(password, user.Password);

    if (!match) {
      return res.json({ success: false });
    }

    // Password is correct
    res.json({ success: true });
  } catch (error) {
    console.error("Error verifying password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/uploadToIpfs", async (req, res) => {
  const fileContent = req.body.fileContent;
  const fileSizeKB = req.body.fileSizeKB;

  const fileUpload = [
    {
      path: "uploadedFile",
      content: fileContent,
    },
  ];

  try {
    const ipfsResponse = await Moralis.EvmApi.ipfs.uploadFolder({
      abi: fileUpload,
    });

    const ipfsPath = ipfsResponse.result[0].path;

    console.log("Received fileName:", req.body.fileName);

    const documentPath = new DocumentPath({
      aadhar: req.body.userAadhar,
      name: req.body.fileName,
      ipfsPath,
      fileSizeKB,
    });

    await documentPath.save();

    res.json({ ipfsPath });
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getDocuments/:aadhar", async (req, res) => {
  const aadhar = req.params.aadhar;

  try {
    const documents = await DocumentPath.find({ aadhar });

    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/documentPaths", async (req, res) => {
  try {
    const documents = await DocumentPath.find();

    res.json(documents);
  } catch (error) {
    console.error("Error fetching document paths:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getRequestHistory/:aadhar", async (req, res) => {
  const aadhar = req.params.aadhar;

  try {
    const requests = await DocumentAccessRequest.find({ ownerAadhar: aadhar });
    res.json(requests);
  } catch (error) {
    console.error("Error fetching request history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/updateRequestStatus/:id", async (req, res) => {
  const requestId = req.params.id;
  const { status } = req.body;

  try {
    await DocumentAccessRequest.updateOne({ _id: requestId }, { status });
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/storeApprovedRequest", async (req, res) => {
  const { requesterAadhar, documentId } = req.body;

  try {
    const request = new ApprovedRequest({ requesterAadhar, documentId });
    await request.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Error storing approved request data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { Aadhar: 1, fullName: 1 });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getApprovedDocuments", async (req, res) => {
  try {
    const approvedDocuments = await ApprovedRequest.find({})
      .populate({
        path: "documentId",
        model: "DocumentPath",
        select: "-_id -__v",
      })
      .select("-_id id requesterAadhar approvalDate document");

    res.json(approvedDocuments);
  } catch (error) {
    console.error("Error fetching approved documents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a Nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Your SMTP server hostname
  port: 587, // Your SMTP server port
  secure: false, // Use TLS
  auth: {
    user: "cryptdrive43@gmail.com", // Your email address
    pass: "nfvn vhcu unad bqvg    ", // Your email password
  },
  tls: {
    rejectUnauthorized: false, // Ignore certificate verification
  },
});

// Check if the transporter is ready
transporter.verify(function (error, success) {
  if (error) {
    console.error("Unable to connect to the SMTP server:", error);
  } else {
    console.log("SMTP server connection is ready");
  }
});

// Modify your requestAccess endpoint to send email notifications
app.post("/requestAccess", async (req, res) => {
  const {
    requesterAadhar,
    documentId,
    ownerAadhar,
    requestName,
    documentName,
  } = req.body;

  try {
    const request = new DocumentAccessRequest({
      requesterAadhar,
      documentId,
      ownerAadhar,
      requestName,
      documentName,
    });
    await request.save();

    // Fetch the owner's details from the database based on their Aadhar
    const owner = await User.findOne({ Aadhar: ownerAadhar });

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // Send email notification to owner
    const mailOptions = {
      from: "cryptdrive43@gmail.com", // Sender address
      to: owner.Email, // Recipient address (owner's email)
      subject: "New Document Access Request",
      html: `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .body {
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Document Access Request</h2>
          </div>
          <div class="body">
            <p>Hello,</p>
            <p>You have received a new document access request from <strong>${requestName}</strong> for the document <strong>${documentName}</strong>.</p>
            <p>Please review the request and take appropriate action.</p>
          </div>
          <div class="footer">
            <p>Thank you,</p>
            <p>Your Application Team</p>
          </div>
        </div>
      </body>
    </html>
  `,
    };

    // Send email using Nodemailer
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error inserting access request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

connectDB().then(() => {
  app.listen(3001, () => {
    console.log("listening for requests");
  });
});
