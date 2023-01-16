import { Unsplash, SearchPhotosResponseResult, Tag, Photo, PhotoResponse, PhotoDetail } from "./mod.ts"
import { tty, colors } from "./deps.ts"

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
                return !result.premium
            })
        )

        if (results.length >= count || results.length >= response.total) {
            break
        }

        tty.eraseLine
            .cursorMove(-1000, 0)
            .text(`${colors.blue.bold("[INFO]")} ${results.length} / ${Math.min(response.total, count)} images found`)

        page += 1
    }

    return results.slice(0, count)
}

export const parsePhotoData = (results: SearchPhotosResponseResult[]): Photo[] => {
    return results.map((result) => {
        const { id, color, description, alt_description, tags_preview, urls, likes, width, height } = result
        return {
            id,
            color,
            description,
            alt_description,
            tags: tags_preview.map(getPhotoTags).filter((tag): tag is string => tag !== undefined),
            likes,
            width,
            height,
            urls,
        }
    })
}

export const parsePhotoDetailData = (results: PhotoResponse[]): PhotoDetail[] => {
    return results.map((result) => {
        const {
            id,
            color,
            description,
            alt_description,
            tags_preview,
            urls,
            likes,
            width,
            height,
            tags,
            location,
            exif,
            views,
            downloads,
        } = result
        return {
            id,
            color,
            description,
            alt_description,
            tags: tags_preview.map(getPhotoTags).filter((tag): tag is string => tag !== undefined),
            urls,
            likes,
            width,
            height,
            related_tags: tags.map(getPhotoTags).filter((tag): tag is string => tag !== undefined),
            location: {
                name: location?.name,
                city: location?.city,
                country: location?.country,
                position: location?.position,
            },
            exif: {
                make: exif?.make,
                model: exif?.model,
                exposure_time: exif?.exposure_time,
                aperture: exif?.aperture,
                focal_length: exif?.focal_length,
                iso: exif?.iso,
            },
            views,
            downloads,
        }
    })
}

export const getPhotoTags = (tag: Tag) => {
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
