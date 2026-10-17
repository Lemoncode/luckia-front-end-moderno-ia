import { createFileRoute } from "@tanstack/react-router";
import { MemberList } from "../../pages/member-list";
export const Route = createFileRoute("/members/")({ component: MemberList });
