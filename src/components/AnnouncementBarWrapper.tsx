import { getSettings } from "@/lib/db";
import AnnouncementBar from "./AnnouncementBar";

export default async function AnnouncementBarWrapper() {
  try {
    const settings = await getSettings();
    const items =
      (settings as { marqueeItems?: string[] }).marqueeItems ||
      (settings.company as { marqueeItems?: string[] }).marqueeItems ||
      [];
    return <AnnouncementBar items={items} />;
  } catch {
    return <AnnouncementBar />;
  }
}
