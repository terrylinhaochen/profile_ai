// src/app/page.jsx
import { Suspense } from 'react';
import HomeClient from '../components/HomeClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeClient />
    </Suspense>
  );
}