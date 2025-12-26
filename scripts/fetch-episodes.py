import feedparser
import json

RSS_URL = "https://cba.media/podcast/5minutenclimatechance/feed"
OUTPUT = "episodes.json"

feed = feedparser.parse(RSS_URL)

episodes = []

for entry in feed.entries:
    episodes.append({
        "id": entry.get("id"),
        "title": entry.get("title"),
        "description": entry.get("summary"),
        "published": entry.get("published"),
        "published_ts": entry.get("published_parsed"),
        "audio": entry.enclosures[0].get("href") if entry.enclosures else None,
        "link": entry.get("link")
    })

# newest first
episodes.sort(
    key=lambda e: e["published_ts"] or 0,
    reverse=True
)

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(episodes, f, ensure_ascii=False, indent=2)

print(f"Wrote {len(episodes)} episodes")
