import { createFileRoute } from "@tanstack/react-router";
import { NewMember } from "../../screens";
export const Route = createFileRoute("/members/new")({ component: NewMember });
