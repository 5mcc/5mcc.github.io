import feedparser
import json
import time

RSS_URL = "https://cba.media/podcast/5minutenclimatechance/feed"
OUTPUT = "episodes.json"

feed = feedparser.parse(RSS_URL)

print("Feed entries:", len(feed.entries))
print("Feed status:", feed.get("status"))
print("Bozo:", feed.bozo)

episodes = []

for entry in feed.entries:
    published_parsed = entry.get("published_parsed")
    published_ts = int(time.mktime(published_parsed)) if published_parsed else 0

    episodes.append({
        "id": entry.get("id"),
        "title": entry.get("title"),
        "description": entry.get("summary"),
        "published": entry.get("published"),
        "published_ts": published_ts,
        "audio": entry.enclosures[0].get("href") if entry.enclosures else None,
        "link": entry.get("link")
    })

episodes.sort(key=lambda e: e["published_ts"], reverse=True)

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(episodes, f, ensure_ascii=False, indent=2)

print(f"Wrote {len(episodes)} episodes")
