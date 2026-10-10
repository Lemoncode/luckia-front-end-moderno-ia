import { createFileRoute } from "@tanstack/react-router";
import { DirectorioScene } from "../../scenes/directorio.scene";
export const Route = createFileRoute("/members/")({ component: DirectorioScene });
