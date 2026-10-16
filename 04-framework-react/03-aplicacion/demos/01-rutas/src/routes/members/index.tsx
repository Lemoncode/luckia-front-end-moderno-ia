import { createFileRoute } from "@tanstack/react-router";
import { MemberList } from "../../screens";
export const Route = createFileRoute("/members/")({ component: MemberList });
