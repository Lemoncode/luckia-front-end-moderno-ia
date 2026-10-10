export interface Member { id: number; name: string; role: string; email: string }
export type MemberInput = Omit<Member, "id">;
