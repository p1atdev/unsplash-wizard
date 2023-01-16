import { Unsplash } from "../client.ts"
import { assertEquals, assertExists } from "../deps.ts"
import { getPhotoData } from "../main.ts"

Deno.test("get photo data", async () => {
    const count = 1000
    const client = new Unsplash()
    const data = await getPhotoData(client, "lemon", count)
    assertEquals(data.length, count)
    data.forEach((photo) => {
        assertExists(photo.urls.thumb)
        assertExists(photo.urls.small)
        assertExists(photo.urls.regular)
        assertExists(photo.urls.full)
        photo.tags.forEach((tag) => {
            assertExists(tag)
        })
    })
})
