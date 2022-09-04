import { puppeteer } from "./deps.ts"

export const generateOGPImage = async (emoji: string, text: string) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
        })
        const page = await browser.newPage()
        await page.setViewport({
            width: 1200,
            height: 630,
            deviceScaleFactor: 1,
        })

        const injectedProps = {
            emoji: emoji,
            title: text,
        }
        await page.exposeFunction("getInjectedProps", () => injectedProps)

        await page.goto(`${Deno.env.get("BLOG_CDN_URL")}/ogp.html`)

        await page.waitForNetworkIdle()

        const buffer = await page.screenshot({ type: "webp", quality: 80 })

        await browser.close()

        return buffer
    } catch (error) {
        console.error(error)
        throw error
    }
}
