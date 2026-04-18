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
    { id: '1', name: 'Pottery', category: 'Arts', image: '/images/gabriel-gurrola-2UuhMZEChdc-unsplash.jpg' },
    { id: '2', name: 'Salsa Dancing', category: 'Dance', image: '/images/andrey-k-1KdOfjO3XxI-unsplash.jpg' },
    { id: '3', name: 'Baking', category: 'Culinary', image: '/images/quan-jing-uVT6D32Jrws-unsplash.jpg' },
    { id: '4', name: 'Guitar playing', category: 'Music', image: '/images/ryan-stefan-5K98ScREEUY-unsplash.jpg' },
    { id: '5', name: 'Yoga', category: 'Fitness', image: '/images/gabriel-gurrola-2UuhMZEChdc-unsplash.jpg' },
    { id: '6', name: 'Photography', category: 'Arts', image: '/images/andrey-k-1KdOfjO3XxI-unsplash.jpg' },
    { id: '7', name: 'Singing', category: 'Music', image: '/images/quan-jing-uVT6D32Jrws-unsplash.jpg' },
    { id: '8', name: 'Contemporary Dance', category: 'Dance', image: '/images/ryan-stefan-5K98ScREEUY-unsplash.jpg' },
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
      image: '/images/quan-jing-uVT6D32Jrws-unsplash.jpg',
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
      bio: 'Let's dance! I've been teaching salsa for 5 years. High energy sessions guaranteed.',
      image: '/images/andrey-k-1KdOfjO3XxI-unsplash.jpg',
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
      image: '/images/gabriel-gurrola-2UuhMZEChdc-unsplash.jpg',
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
      image: '/images/ryan-stefan-5K98ScREEUY-unsplash.jpg',
      verified: true,
      certifications: ['Trinity Rock & Pop Grade 8', 'Jazz Fusion Workshop'],
      badges: ['Expert Learner', 'Top Notch']
    }
  ];

  const spaces = [
    { id: 's1', name: 'The Art Studio', location: 'Indiranagar, Bangalore', price: 500, type: 'Art / Pottery', capacity: 10, image: '/images/andrey-k-1KdOfjO3XxI-unsplash.jpg' },
    { id: 's2', name: 'Vibe Dance Hall', location: 'Bandra, Mumbai', price: 1200, type: 'Dance / Fitness', capacity: 30, image: '/images/gabriel-gurrola-2UuhMZEChdc-unsplash.jpg' },
    { id: 's3', name: 'Culinary Lab', location: 'Gurgaon, Delhi NCR', price: 2000, type: 'Cooking / Baking', capacity: 8, image: '/images/ryan-stefan-5K98ScREEUY-unsplash.jpg' },
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
