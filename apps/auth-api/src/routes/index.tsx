import { createFileRoute } from "@tanstack/solid-router";
import { LandingPage } from "../components/landing/LandingPage";
import { omniBotHomeHead } from "../lib/site-metadata";
import { OMNIBOT_SOFTWARE_APPLICATION } from "../lib/software-application";

export const Route = createFileRoute("/")({
  head: () => omniBotHomeHead(OMNIBOT_SOFTWARE_APPLICATION),
  component: LandingPage,
});
