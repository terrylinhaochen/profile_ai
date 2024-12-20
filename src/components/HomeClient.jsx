"use client";

import { useProfile } from '../context/ProfileContext';
import UserOnboarding from './profile/UserOnboarding';

export default function HomeClient() {
  const { profile } = useProfile();

  return (
    <main className="container mx-auto px-4">
      <UserOnboarding />
    </main>
  );
}