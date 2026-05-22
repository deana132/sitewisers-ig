export const GRAPH_VERSION = "v21.0";
export const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

const MAX_STATUS_POLLS = 30;
const STATUS_POLL_INTERVAL_MS = 5_000;

export class InstagramClient {
  constructor({ businessAccountId, accessToken } = {}) {
    this.businessAccountId = businessAccountId ?? process.env.IG_BUSINESS_ACCOUNT_ID;
    this.accessToken = accessToken ?? process.env.IG_ACCESS_TOKEN;
    if (!this.businessAccountId) throw new Error("Missing IG_BUSINESS_ACCOUNT_ID");
    if (!this.accessToken) throw new Error("Missing IG_ACCESS_TOKEN");
  }

  async publish(post, mediaUrls) {
    const creationId = await this.createContainer(post, mediaUrls);
    await this.waitUntilReady(creationId);
    return this.publishContainer(creationId);
  }

  async createContainer(post, mediaUrls) {
    if (post.type === "image") {
      if (mediaUrls.length !== 1) {
        throw new Error(`image post expects 1 media url, got ${mediaUrls.length}`);
      }
      return this.createImageContainer(mediaUrls[0], post.caption);
    }
    if (post.type === "carousel") {
      if (mediaUrls.length < 2 || mediaUrls.length > 10) {
        throw new Error(`carousel requires 2-10 items, got ${mediaUrls.length}`);
      }
      return this.createCarouselContainer(mediaUrls, post.caption);
    }
    if (post.type === "reel") {
      if (mediaUrls.length !== 1) {
        throw new Error(`reel post expects 1 video url, got ${mediaUrls.length}`);
      }
      return this.createReelContainer(mediaUrls[0], post.caption);
    }
    throw new Error(`Unsupported post type: ${post.type}`);
  }

  async createImageContainer(imageUrl, caption) {
    const { id } = await this.post(`/${this.businessAccountId}/media`, {
      image_url: imageUrl,
      caption,
    });
    return id;
  }

  async createCarouselContainer(imageUrls, caption) {
    const childIds = [];
    for (const url of imageUrls) {
      const { id } = await this.post(`/${this.businessAccountId}/media`, {
        image_url: url,
        is_carousel_item: "true",
      });
      childIds.push(id);
    }
    const { id } = await this.post(`/${this.businessAccountId}/media`, {
      media_type: "CAROUSEL",
      children: childIds.join(","),
      caption,
    });
    return id;
  }

  async createReelContainer(videoUrl, caption) {
    const { id } = await this.post(`/${this.businessAccountId}/media`, {
      media_type: "REELS",
      video_url: videoUrl,
      caption,
    });
    return id;
  }

  async publishContainer(creationId) {
    const { id } = await this.post(`/${this.businessAccountId}/media_publish`, {
      creation_id: creationId,
    });
    return id;
  }

  async waitUntilReady(containerId) {
    for (let i = 0; i < MAX_STATUS_POLLS; i++) {
      const { status_code } = await this.get(`/${containerId}`, {
        fields: "status_code",
      });
      if (status_code === "FINISHED") return;
      if (status_code === "ERROR" || status_code === "EXPIRED") {
        throw new Error(`Media container ${containerId} status: ${status_code}`);
      }
      await sleep(STATUS_POLL_INTERVAL_MS);
    }
    throw new Error(`Media container ${containerId} not ready after polling`);
  }

  async post(pathname, params) {
    const url = new URL(GRAPH_BASE + pathname);
    const body = new URLSearchParams({ ...params, access_token: this.accessToken });
    const res = await fetch(url, { method: "POST", body });
    return parse(res);
  }

  async get(pathname, params = {}) {
    const url = new URL(GRAPH_BASE + pathname);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    url.searchParams.set("access_token", this.accessToken);
    const res = await fetch(url);
    return parse(res);
  }
}

async function parse(res) {
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response (${res.status}): ${text.slice(0, 200)}`);
  }
  if (!res.ok || json.error) {
    const msg = json.error?.message || `HTTP ${res.status}`;
    throw new Error(`Graph API error: ${msg}`);
  }
  return json;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
