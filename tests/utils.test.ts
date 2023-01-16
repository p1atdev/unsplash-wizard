import { getPhotos } from "../mod.ts"
import { assertEquals } from "../deps.ts"
import { Unsplash } from "../client.ts"

Deno.test("get a lot of portrait photos ", async () => {
    const count = 100

    const client = new Unsplash()
    const results = await getPhotos(client, "portrait", count)

    assertEquals(results.length, count)
})
