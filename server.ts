import { Hono, server } from "./deps.ts"
import { generateOGPImage } from "./generate.ts"
import { getPost } from "./newt.ts"

const app = new Hono()

app.get("/:contentId", async (c) => {
    const { contentId } = c.req.param()

    const post = await getPost(contentId)

    if (!post) {
        c.status(404)
        return c.text("Not found")
    }

    const image = await generateOGPImage(post.emoji.value, post.title)

    c.res.headers.set("Content-Type", "image/webp")
    c.res.headers.set("Cache-Control", "public, max-age=86400")
    c.res.headers.set("Vary", "Accept-Encoding")

    return c.body(image)
})

server.serve(app.fetch)
