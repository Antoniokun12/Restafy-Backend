import { Router } from 'express';
import { subirImagen } from '../middlewares/subir-archivo.js';

const router = Router();

router.post('/imagen', subirImagen.single('foto'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen' });
  }

  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url });
});

export default router;
