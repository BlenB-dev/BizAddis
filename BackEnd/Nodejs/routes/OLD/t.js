
// Ensure the pitch deck uploads directory exists, and if not, create it
const pitchDeckUploadDirectory = path.join(__dirname, "../../Storage/StartupStorage/PitchDeck");
if (!fs.existsSync(pitchDeckUploadDirectory)) {
  fs.mkdirSync(pitchDeckUploadDirectory, { recursive: true });
}

// Set up multer pitchDeckStorage
const pitchDeckStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pitchDeckUploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with extension
  },
});


const uploadPitchDeck = multer({ pitchDeckStorage });
