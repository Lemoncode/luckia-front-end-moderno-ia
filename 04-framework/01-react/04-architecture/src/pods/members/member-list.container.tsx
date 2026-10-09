import { useState } from "react";
import { Loading, ErrorMessage } from "../../common/components/request-status";
import { useMembers } from "./hooks";
import { MemberListComponent } from "./member-list.component";
export function MemberListContainer() {
  const { members, loading, error } = useMembers();
  const [filter, setFilter] = useState("");
  const visible = members.filter(member => member.name.toLowerCase().includes(filter.toLowerCase()));
  if (loading) return <><h1>Equipo</h1><Loading /></>;
  if (error) return <><h1>Equipo</h1><ErrorMessage message={error} /></>;
  return <MemberListComponent members={visible} filter={filter} onFilterChange={setFilter} />;
}

