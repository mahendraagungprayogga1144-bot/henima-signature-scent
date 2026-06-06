import { getCurrentUserSafe } from "@/lib/session";
import Navbar from "./Navbar";

export default async function NavbarWrapper() {
  const user = await getCurrentUserSafe();
  return <Navbar user={user} />;
}
