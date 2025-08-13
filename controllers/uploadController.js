export const subirImagen = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'No se subió ninguna imagen' })
    }

    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`

    return res.status(200).json({
        msg: 'Imagen subida correctamente',
        url
    })
}
