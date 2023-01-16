import { Unsplash } from "../mod.ts"
import { assertEquals } from "../deps.ts"

Deno.test("get a photo of a dog", async () => {
    const client = new Unsplash()
    const count = 1
    const response = await client.search.photos({
        query: "dog",
        page: 1,
        per_page: count,
    })
    assertEquals(response.results.length, count)
})

Deno.test("get some photos of lemons", async () => {
    const client = new Unsplash()
    const count = 30
    const response = await client.search.photos({
        query: "lemon",
        page: 1,
        per_page: count,
    })
    assertEquals(response.results.length, count)
})
