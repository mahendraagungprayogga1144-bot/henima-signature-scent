with open("src/components/AnnouncementBarWrapper.tsx", "w") as f:
    f.write('''import { getDatabase } from "@/lib/db";
import AnnouncementBar from "./AnnouncementBar";

export default async function AnnouncementBarWrapper() {
  try {
    const db = await getDatabase();
    const items = (db.settings.company as any).marqueeItems || [];
    return <AnnouncementBar items={items} />;
  } catch {
    return <AnnouncementBar />;
  }
}
''')
print("Done!")
