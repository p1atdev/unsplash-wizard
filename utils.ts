import { Unsplash, SearchPhotosResponseResult, TagsPreview } from "./mod.ts"

export const getPhotos = async (client: Unsplash, query: string, count: number) => {
    const results: SearchPhotosResponseResult[] = []

    let page = 1

    while (true) {
        const response = await client.search.photos({
            query,
            page: page,
            per_page: 30,
        })

        if (response.results.length === 0) {
            break
        }

        results.push(
            ...response.results.filter((result) => {
                return !result.urls.thumb.includes("premium_photo")
            })
        )

        if (results.length >= count || results.length >= response.total) {
            break
        }

        page += 1
    }

    return results.slice(0, count)
}

export const parsePhotoData = (results: SearchPhotosResponseResult[]) => {
    return results.map((result) => {
        const { color, description, alt_description, tags_preview, urls } = result
        return {
            color,
            description,
            alt_description,
            tags: tags_preview.map(getPhotoTags),
            urls,
        }
    })
}

export const getPhotoTags = (tag: TagsPreview) => {
    switch (tag.type) {
        case "search": {
            return tag.title
        }
        case "landing_page": {
            return tag.source?.title
        }
        default: {
            return tag.title
        }
    }
}
