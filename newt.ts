import "https://deno.land/std@0.154.0/dotenv/load.ts"
import { NewtClient } from "./client.ts"

interface ClientSecrets {
    NEWT_SPACE_UID: string
    NEWT_API_TOKEN: string
    NEWT_API_TYPE: "cdn" | "api"
}

interface AppParam {
    NEWT_APP_UID: string
    NEWT_POST_MODEL_UID: string
    NEWT_TAG_MODEL_UID: string
}

const getSecrets = (): ClientSecrets => {
    const NEWT_SPACE_UID = Deno.env.get("NEWT_SPACE_UID")!
    const NEWT_API_TOKEN = Deno.env.get("NEWT_API_TOKEN")!
    const NEWT_API_TYPE = Deno.env.get("NEWT_API_TYPE")!

    if (!NEWT_SPACE_UID || !NEWT_API_TOKEN) {
        throw new Error("Missing environment variables")
    }

    if (NEWT_API_TYPE !== "cdn" && NEWT_API_TYPE !== "api") {
        throw new Error("Invalid environment variable: NEWT_APP_TYPE")
    }

    return {
        NEWT_SPACE_UID,
        NEWT_API_TOKEN,
        NEWT_API_TYPE,
    }
}

const getParam = (): AppParam => {
    const NEWT_APP_UID = Deno.env.get("NEWT_APP_UID")!
    const NEWT_POST_MODEL_UID = Deno.env.get("NEWT_POST_MODEL_UID")!
    const NEWT_TAG_MODEL_UID = Deno.env.get("NEWT_TAG_MODEL_UID")!

    if (!NEWT_APP_UID || !NEWT_POST_MODEL_UID || !NEWT_TAG_MODEL_UID) {
        throw new Error("Missing environment variables")
    }

    return {
        NEWT_APP_UID,
        NEWT_POST_MODEL_UID,
        NEWT_TAG_MODEL_UID,
    }
}

const newClient = () => {
    const secrets = getSecrets()
    const NEWT_POST_MODEL_UID = Deno.env.get("NEWT_POST_MODEL_UID")!

    if (!NEWT_POST_MODEL_UID) {
        throw new Error("Missing post model uid")
    }

    const client = new NewtClient({
        spaceUid: secrets.NEWT_SPACE_UID,
        token: secrets.NEWT_API_TOKEN,
        apiType: secrets.NEWT_API_TYPE,
    })

    return client
}

export const getPost = async (id: string): Promise<Post | undefined> => {
    const client = newClient()
    const param = getParam()

    try {
        const post: Post = await client.getContent({
            appUid: param.NEWT_APP_UID,
            modelUid: param.NEWT_POST_MODEL_UID,
            contentId: id,
        })

        return post
    } catch (error) {
        console.error(error)

        return undefined
    }
}

export interface Posts {
    skip: number
    limit: number
    total: number
    items: Post[]
}

export interface Post {
    _id: string
    _sys: Sys
    emoji: Emoji
    title: string
    body: string
    tags: Tag[]
}

export interface Sys {
    raw: Raw
    createdAt: string
    upstringdAt: string
}

export interface Raw {
    createdAt: string
    upstringdAt: string
    firstPublishedAt: string
    publishedAt: string
}

export interface Emoji {
    type: string
    value: string
}

export interface Tag {
    _id: string
    _sys: Sys
    name: string
    color: string
}
