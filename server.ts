import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Data
  const hobbies = [
    { id: '1', name: 'Pottery', category: 'Arts', image: 'https://images.unsplash.com/photo-1565193298357-bb03632906e1?q=80&w=800&auto=format&fit=crop' },
    { id: '2', name: 'Salsa Dancing', category: 'Dance', image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=800&auto=format&fit=crop' },
    { id: '3', name: 'Baking', category: 'Culinary', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop' },
    { id: '4', name: 'Guitar playing', category: 'Music', image: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=800&auto=format&fit=crop' },
    { id: '5', name: 'Yoga', category: 'Fitness', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop' },
    { id: '6', name: 'Photography', category: 'Arts', image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop' },
    { id: '7', name: 'Singing', category: 'Music', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&auto=format&fit=crop' },
    { id: '8', name: 'Contemporary Dance', category: 'Dance', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop' },
  ];

  const tutors = [
    {
      id: 't1',
      name: 'Ananya Sharma',
      hobby: 'Pottery',
      price: 1200,
      rating: 4.8,
      reviews: 42,
      bio: 'Professional ceramicist with 10 years of experience. I love teaching beginners how to shape their first clay pot.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&h=400&auto=format&fit=crop',
      verified: true,
      certifications: ['Advanced Ceramics (IIT Bombay)', 'Fine Arts Degree'],
      badges: ['Top Notch', 'Highly Rated']
    },
    {
      id: 't2',
      name: 'Rahul Verma',
      hobby: 'Salsa Dancing',
      price: 800,
      rating: 4.9,
      reviews: 56,
      bio: 'Let’s dance! I’ve been teaching salsa for 5 years. High energy sessions guaranteed.',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&h=400&auto=format&fit=crop',
      verified: true,
      certifications: ['International Salsa Diplomat', 'Zumba Certified'],
      badges: ['Quick Responder', 'Best of 2025']
    },
    {
      id: 't3',
      name: 'Priya Iyer',
      hobby: 'Baking',
      price: 1500,
      rating: 4.7,
      reviews: 38,
      bio: 'Baking is an art. Join me to learn the secrets of the perfect sourdough.',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&h=400&auto=format&fit=crop',
      verified: true,
      certifications: ['Le Cordon Bleu Paris', 'Culinary Arts Specialization'],
      badges: ['Master Chef', 'Rising Star']
    },
    {
      id: 't4',
      name: 'Vikram Mehta',
      hobby: 'Guitar playing',
      price: 900,
      rating: 4.6,
      reviews: 24,
      bio: 'Acoustic and electric guitar specialist. From chords to solos.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&auto=format&fit=crop',
      verified: true,
      certifications: ['Trinity Rock & Pop Grade 8', 'Jazz Fusion Workshop'],
      badges: ['Expert Learner', 'Top Notch']
    }
  ];

  const spaces = [
    { id: 's1', name: 'The Art Studio', location: 'Indiranagar, Bangalore', price: 500, type: 'Art / Pottery', capacity: 10, image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop' },
    { id: 's2', name: 'Vibe Dance Hall', location: 'Bandra, Mumbai', price: 1200, type: 'Dance / Fitness', capacity: 30, image: 'https://images.unsplash.com/photo-1545167622-3a6ac756aff4?q=80&w=800&auto=format&fit=crop' },
    { id: 's3', name: 'Culinary Lab', location: 'Gurgaon, Delhi NCR', price: 2000, type: 'Cooking / Baking', capacity: 8, image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop' },
  ];

  // API Routes
  app.get('/api/hobbies', (req, res) => {
    res.json(hobbies);
  });

  app.get('/api/spaces', (req, res) => {
    res.json(spaces);
  });

  app.get('/api/tutors', (req, res) => {
    const { hobby } = req.query;
    if (hobby) {
      res.json(tutors.filter(t => t.hobby.toLowerCase() === (hobby as string).toLowerCase()));
    } else {
      res.json(tutors);
    }
  });

  app.get('/api/tutors/:id', (req, res) => {
    const tutor = tutors.find(t => t.id === req.params.id);
    if (tutor) res.json(tutor);
    else res.status(404).send('Not found');
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
