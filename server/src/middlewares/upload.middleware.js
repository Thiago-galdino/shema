import multer from 'multer';
import path from 'path';
import fs from 'fs';

const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), process.env.UPLOADS_PATH || 'uploads');
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|mp4|mov/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error('Formato de arquivo não suportado.'));
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// Assinaturas de magic bytes para os tipos permitidos
const MAGIC_SIGNATURES = [
  { sig: [0xFF, 0xD8, 0xFF], offset: 0 },                          // JPEG
  { sig: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], offset: 0 }, // PNG
  { sig: [0x47, 0x49, 0x46, 0x38], offset: 0 },                    // GIF
  { sig: [0x57, 0x45, 0x42, 0x50], offset: 8 },                    // WebP (RIFF....WEBP)
  { sig: [0x66, 0x74, 0x79, 0x70], offset: 4 },                    // MP4/MOV (ftyp box)
];

const hasValidMagicBytes = (filePath) => {
  const HEADER_SIZE = 16;
  const buffer = Buffer.alloc(HEADER_SIZE);
  const fd = fs.openSync(filePath, 'r');
  try {
    fs.readSync(fd, buffer, 0, HEADER_SIZE, 0);
  } finally {
    fs.closeSync(fd);
  }
  return MAGIC_SIGNATURES.some(({ sig, offset }) =>
    sig.every((byte, i) => buffer[offset + i] === byte)
  );
};

export const validateFileContent = (req, res, next) => {
  const file = req.file;
  if (!file) return next();

  if (!hasValidMagicBytes(file.path)) {
    fs.unlinkSync(file.path);
    return res.status(400).json({ success: false, message: 'Conteúdo do arquivo inválido ou corrompido.' });
  }

  next();
};
