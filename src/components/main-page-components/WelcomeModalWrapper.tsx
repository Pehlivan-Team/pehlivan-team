"use client";

import { useSearchParams } from "next/navigation";
import WelcomeModal from "./WelcomeModal";

export default function WelcomeModalWrapper() {
  const searchParams = useSearchParams();
  const showModal = searchParams.has("welcome");

  // Bu bileşen, istemci tarafında URL'i okur ve
  // sonuca göre WelcomeModal'ı render eder.
  return <WelcomeModal show={showModal} />;
}