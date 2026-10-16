import { createFileRoute } from "@tanstack/react-router";
import { MemberList } from "../../pages/screens";
export const Route = createFileRoute("/members/")({ component: MemberList });
