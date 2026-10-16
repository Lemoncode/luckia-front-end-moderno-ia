import { useState } from "react";
import { useMembers } from "../../core/members/hooks";
import { Loading, ErrorMessage } from "../../common/components/request-status";
import { DirectorioComponent } from "./directorio.component";
export function DirectorioContainer() {
  const { members, loading, error } = useMembers();
  const [filter, setFilter] = useState("");
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  const visible = members.filter(member => member.name.toLowerCase().includes(filter.toLowerCase()));
  return <DirectorioComponent members={visible} filter={filter} onFilterChange={setFilter} />;
}
