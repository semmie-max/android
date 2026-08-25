"use client";

import dynamic from "next/dynamic";

const DottedBg2 = dynamic(
  () => import("./originkit/ui/chromatic-waves"),
  {
    ssr: false,
  }
);

export default function ChromaticBackground() {
  return <DottedBg2 />;
}