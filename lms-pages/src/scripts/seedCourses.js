// scripts/seedCourses.js
import { createClient } from '@supabase/supabase-js';
import { courses } from '../src/data/courses';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function seedCourses() {
  for (const course of courses) {
    const { error } = await supabase
      .from('courses')
      .upsert(course, { onConflict: 'id' });
    
    if (error) console.error('Error seeding course:', error);
    else console.log(`Seeded: ${course.title}`);
  }
}

seedCourses();