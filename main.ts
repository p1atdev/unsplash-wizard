import { Unsplash } from "./client.ts"
import { parsePhotoData, getPhotos } from "./mod.ts"

export interface GetPhotosParameters {
    query: string
    count: number
    size: "raw" | "thumb" | "small" | "regular" | "full"
}

export const getPhotoData = async (client: Unsplash, query: string, count: number) => {
    const photos = await getPhotos(client, query, count)
    return parsePhotoData(photos)
}
