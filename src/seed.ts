/**
 * Seed script — populates MongoDB with initial niche data.
 * Run with: npx ts-node src/seed.ts
 */

import * as mongoose from 'mongoose';
import { NicheSchema } from './modules/niche/niche.dto';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nicheforge';

const SEED_NICHES = [
  {
    name: 'Ancient Civilizations',
    category: 'History',
    description: 'Deep dives into ancient Rome, Egypt, Greece, and Mesopotamia',
    competition: 'low',
    trendScore: 82,
    estimatedRevenue: '$800-$4,000/mo',
    contentIdeas: [
      'The fall of Rome explained in 10 minutes',
      'Daily life in ancient Egypt',
      'Lost civilizations that vanished overnight',
    ],
    difficulty: 'Beginner',
    audienceSize: '50M+',
    monetizationPotential: 'high',
  },
  {
    name: 'Unsolved Mysteries & Cold Cases',
    category: 'True Crime',
    description: 'Faceless narration of real unsolved crimes and mysteries',
    competition: 'medium',
    trendScore: 91,
    estimatedRevenue: '$1,200-$6,000/mo',
    contentIdeas: [
      'The Zodiac Killer — what we know in 2026',
      'D.B. Cooper: the heist that stumped the FBI',
      'Disappearances that were never solved',
    ],
    difficulty: 'Beginner',
    audienceSize: '80M+',
    monetizationPotential: 'high',
  },
  {
    name: 'Stoicism & Philosophy for Modern Life',
    category: 'Motivation',
    description: 'Applying ancient Stoic and philosophical wisdom to everyday problems',
    competition: 'low',
    trendScore: 78,
    estimatedRevenue: '$600-$3,500/mo',
    contentIdeas: [
      'Marcus Aurelius on dealing with difficult people',
      '5 Stoic habits that will change your morning',
      'Why Epictetus matters in the age of social media',
    ],
    difficulty: 'Beginner',
    audienceSize: '40M+',
    monetizationPotential: 'high',
  },
  {
    name: 'Space & Astrophysics Explained Simply',
    category: 'Science',
    description: 'Making complex astronomy and space science accessible',
    competition: 'medium',
    trendScore: 85,
    estimatedRevenue: '$900-$4,500/mo',
    contentIdeas: [
      'What happens inside a black hole?',
      'How far is the nearest galaxy — visualized',
      'The Fermi Paradox explained in 8 minutes',
    ],
    difficulty: 'Intermediate',
    audienceSize: '100M+',
    monetizationPotential: 'high',
  },
  {
    name: 'Extreme Weather & Natural Disasters',
    category: 'Science',
    description: 'Documentary-style explainers on tornados, earthquakes, tsunamis and more',
    competition: 'low',
    trendScore: 74,
    estimatedRevenue: '$500-$2,800/mo',
    contentIdeas: [
      'The deadliest tornado in US history',
      'What causes a 9.0 earthquake?',
      'Could a supervolcano actually wipe us out?',
    ],
    difficulty: 'Beginner',
    audienceSize: '60M+',
    monetizationPotential: 'medium',
  },
  {
    name: 'Personal Finance for Beginners',
    category: 'Finance',
    description: 'Simple, actionable financial advice for millennials and Gen Z',
    competition: 'high',
    trendScore: 95,
    estimatedRevenue: '$2,000-$12,000/mo',
    contentIdeas: [
      'Index funds explained in 5 minutes',
      'The 50/30/20 budget rule — does it actually work?',
      'How to pay off $20K of debt faster',
    ],
    difficulty: 'Intermediate',
    audienceSize: '200M+',
    monetizationPotential: 'high',
  },
  {
    name: 'World War II Untold Stories',
    category: 'History',
    description: 'Lesser-known WWII stories, battles, and individuals',
    competition: 'low',
    trendScore: 88,
    estimatedRevenue: '$1,000-$5,000/mo',
    contentIdeas: [
      'The soldier who kept fighting until 1974',
      'Operation Mincemeat — the greatest deception of WWII',
      'Women spies of the Second World War',
    ],
    difficulty: 'Beginner',
    audienceSize: '75M+',
    monetizationPotential: 'high',
  },
  {
    name: 'Psychology & Human Behavior',
    category: 'Science',
    description: 'Explaining psychological phenomena, experiments, and cognitive biases',
    competition: 'medium',
    trendScore: 87,
    estimatedRevenue: '$800-$4,000/mo',
    contentIdeas: [
      'The Stanford Prison Experiment and what it tells us',
      '7 cognitive biases affecting your decisions right now',
      'Why cults work — the psychology of manipulation',
    ],
    difficulty: 'Intermediate',
    audienceSize: '90M+',
    monetizationPotential: 'high',
  },
  {
    name: 'Kids Educational Animation',
    category: 'Kids',
    description: 'Simple animated explainers for children aged 6-12',
    competition: 'medium',
    trendScore: 80,
    estimatedRevenue: '$400-$3,000/mo',
    contentIdeas: [
      'How does the human body work?',
      'The water cycle explained for kids',
      'Why do we have seasons?',
    ],
    difficulty: 'Advanced',
    audienceSize: '150M+',
    monetizationPotential: 'medium',
  },
  {
    name: 'Retro Gaming & Console History',
    category: 'Gaming',
    description: 'Nostalgia-driven content about classic games and gaming history',
    competition: 'medium',
    trendScore: 76,
    estimatedRevenue: '$400-$2,500/mo',
    contentIdeas: [
      'The rise and fall of SEGA',
      'Games that were ahead of their time',
      'The story behind the first PlayStation',
    ],
    difficulty: 'Beginner',
    audienceSize: '50M+',
    monetizationPotential: 'medium',
  },
  {
    name: 'Bizarre & Unexplained Science',
    category: 'Science',
    description: 'Weird but real scientific phenomena and discoveries',
    competition: 'low',
    trendScore: 83,
    estimatedRevenue: '$600-$3,500/mo',
    contentIdeas: [
      'Quantum entanglement explained simply',
      'Animals that shouldn\'t exist but do',
      'The most bizarre experiments in science history',
    ],
    difficulty: 'Beginner',
    audienceSize: '70M+',
    monetizationPotential: 'high',
  },
  {
    name: 'Financial Independence & FIRE Movement',
    category: 'Finance',
    description: 'Retiring early through saving, investing, and frugality',
    competition: 'medium',
    trendScore: 79,
    estimatedRevenue: '$1,000-$6,000/mo',
    contentIdeas: [
      'How to retire at 40 — the honest truth',
      'FIRE movement: is it actually achievable?',
      'The 4% rule explained — does it hold up in 2026?',
    ],
    difficulty: 'Intermediate',
    audienceSize: '30M+',
    monetizationPotential: 'high',
  },
];

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);

  const NicheModel = mongoose.model('Niche', NicheSchema);

  const existing = await NicheModel.countDocuments();
  if (existing > 0) {
    console.log(`✅ Database already has ${existing} niches — skipping seed.`);
    await mongoose.disconnect();
    return;
  }

  console.log(`📝 Seeding ${SEED_NICHES.length} niches...`);
  await NicheModel.insertMany(SEED_NICHES);
  console.log('✅ Seed complete!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
