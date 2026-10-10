import { createFileRoute } from "@tanstack/react-router";
import { MemberDetail } from "../../pages/screens";
export const Route = createFileRoute("/members/$memberId")({ component: DetailPage });
function DetailPage() {
  const { memberId } = Route.useParams();
  return <MemberDetail key={memberId} id={memberId} />;
}
