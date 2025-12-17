import clientEnv from "./clientEnv";

export type TrackData = {
  name: string;
  album: string;
  artist: string;
  url: string;
  imageUrl: string;
}

export async function getNowPlaying(): Promise<TrackData | null> {
  if (!clientEnv.PUBLIC_LASTFM_API_KEY || !clientEnv.PUBLIC_LASTFM_USER) {
    return null;
  }
  const params = new URLSearchParams({
    method: "user.getrecenttracks",
    api_key: clientEnv.PUBLIC_LASTFM_API_KEY,
    user: clientEnv.PUBLIC_LASTFM_USER,
    limit: "1",
    format: "json"
  });

  const res = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`);
  if (!res.ok) throw `${res.status} ${res.statusText}`;

  const json = await res.json();
  if (json.error) {
    console.error(`Error fetching track data: ${json.error}: ${json.message}`);
    return null;
  }

  const track = json.recenttracks?.track[0];

  if (!track?.["@attr"]?.nowplaying) {
    return null;
  }

  return {
    name: track.name || "Unknown",
    album: track.album["#text"],
    artist: track.artist["#text"] || "Unknown",
    url: track.url,
    imageUrl: track.image?.find((x: any) => x.size === "large")?.["#text"]
  };
}