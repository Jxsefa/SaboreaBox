const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

// Configurar Multer
const upload = multer({ storage: multer.memoryStorage() });

// Configurar Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Ruta para subir imágenes
router.post('/upload-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send('No se encontró una imagen para subir.');

        const { data, error } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .upload(`images/${Date.now()}_${req.file.originalname}`, req.file.buffer);

        if (error) return res.status(500).send('Error al subir la imagen.');

        const { publicURL, error: urlError } = supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .getPublicUrl(data.path);

        if (urlError) return res.status(500).send('Error al obtener la URL pública.');

        res.json({ imageUrl: publicURL });
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).send('Error en el servidor.');
    }
});

module.exports = router;
