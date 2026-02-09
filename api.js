const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const RESENAS_FILE = path.join(__dirname, 'resenas.json');

// Middleware
app.use(express.json());

// Helper function to read resenas
async function leerResenas() {
  try {
    const data = await fs.readFile(RESENAS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo resenas:', error);
    return [];
  }
}

// Helper function to write resenas
async function escribirResenas(resenas) {
  try {
    await fs.writeFile(RESENAS_FILE, JSON.stringify(resenas, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error escribiendo resenas:', error);
    return false;
  }
}

// GET /api/resenas - Obtener todas las reseñas
app.get('/api/resenas', async (req, res) => {
  try {
    const resenas = await leerResenas();
    res.json(resenas);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer las reseñas' });
  }
});

// GET /api/resenas/:id - Obtener una reseña por ID
app.get('/api/resenas/:id', async (req, res) => {
  try {
    const resenas = await leerResenas();
    const resena = resenas.find(r => r.id === parseInt(req.params.id));
    
    if (!resena) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }
    
    res.json(resena);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer la reseña' });
  }
});

// GET /api/resenas/buscar - Buscar reseñas por criterios
// Parámetros de búsqueda: autor, titulo, serie, valoracion (mínima)
app.get('/api/resenas/buscar/query', async (req, res) => {
  try {
    const { autor, titulo, serie, valoracion } = req.query;
    let resenas = await leerResenas();

    if (autor) {
      resenas = resenas.filter(r => 
        r.autores.some(a => a.toLowerCase().includes(autor.toLowerCase()))
      );
    }

    if (titulo) {
      resenas = resenas.filter(r => 
        r.titulo.toLowerCase().includes(titulo.toLowerCase())
      );
    }

    if (serie) {
      resenas = resenas.filter(r => 
        r.serie.toLowerCase().includes(serie.toLowerCase())
      );
    }

    if (valoracion) {
      const minValoracion = parseInt(valoracion);
      resenas = resenas.filter(r => r.valoracion >= minValoracion);
    }

    res.json(resenas);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar reseñas' });
  }
});

// POST /api/resenas - Crear una nueva reseña
app.post('/api/resenas', async (req, res) => {
  try {
    const { autores, titulo, serie, valoracion, comentarios } = req.body;

    // Validación básica
    if (!autores || !Array.isArray(autores) || autores.length === 0) {
      return res.status(400).json({ error: 'Autores es requerido y debe ser un array' });
    }

    if (!titulo || typeof titulo !== 'string') {
      return res.status(400).json({ error: 'Título es requerido' });
    }

    if (valoracion !== undefined && (typeof valoracion !== 'number' || valoracion < 1 || valoracion > 5)) {
      return res.status(400).json({ error: 'Valoración debe ser un número entre 1 y 5' });
    }

    const resenas = await leerResenas();
    const nuevoId = resenas.length > 0 ? Math.max(...resenas.map(r => r.id)) + 1 : 1;

    const nuevaResena = {
      id: nuevoId,
      autores,
      titulo,
      serie: serie || 'N/A',
      valoracion: valoracion || 0,
      comentarios: comentarios || ''
    };

    resenas.push(nuevaResena);
    const success = await escribirResenas(resenas);

    if (success) {
      res.status(201).json(nuevaResena);
    } else {
      res.status(500).json({ error: 'Error al guardar la reseña' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la reseña' });
  }
});

// PUT /api/resenas/:id - Actualizar una reseña existente
app.put('/api/resenas/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const resenas = await leerResenas();
    const index = resenas.findIndex(r => r.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }

    const { autores, titulo, serie, valoracion, comentarios } = req.body;

    // Validación básica
    if (autores && (!Array.isArray(autores) || autores.length === 0)) {
      return res.status(400).json({ error: 'Autores debe ser un array con al menos un elemento' });
    }

    if (valoracion !== undefined && (typeof valoracion !== 'number' || valoracion < 1 || valoracion > 5)) {
      return res.status(400).json({ error: 'Valoración debe ser un número entre 1 y 5' });
    }

    // Actualizar solo los campos proporcionados
    if (autores) resenas[index].autores = autores;
    if (titulo) resenas[index].titulo = titulo;
    if (serie !== undefined) resenas[index].serie = serie;
    if (valoracion !== undefined) resenas[index].valoracion = valoracion;
    if (comentarios !== undefined) resenas[index].comentarios = comentarios;

    const success = await escribirResenas(resenas);

    if (success) {
      res.json(resenas[index]);
    } else {
      res.status(500).json({ error: 'Error al actualizar la reseña' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la reseña' });
  }
});

// DELETE /api/resenas/:id - Eliminar una reseña
app.delete('/api/resenas/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const resenas = await leerResenas();
    const index = resenas.findIndex(r => r.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }

    resenas.splice(index, 1);
    const success = await escribirResenas(resenas);

    if (success) {
      res.json({ message: 'Reseña eliminada correctamente' });
    } else {
      res.status(500).json({ error: 'Error al eliminar la reseña' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la reseña' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`API de reseñas ejecutándose en http://localhost:${PORT}`);
  console.log('\nEndpoints disponibles:');
  console.log('  GET    /api/resenas          - Obtener todas las reseñas');
  console.log('  GET    /api/resenas/:id      - Obtener una reseña por ID');
  console.log('  GET    /api/resenas/buscar/query - Buscar reseñas (params: autor, titulo, serie, valoracion)');
  console.log('  POST   /api/resenas          - Crear una nueva reseña');
  console.log('  PUT    /api/resenas/:id      - Actualizar una reseña');
  console.log('  DELETE /api/resenas/:id      - Eliminar una reseña');
});

module.exports = app;
