import { Unsplash } from "./client.ts"
import { parsePhotoData, getPhotos, Photo, PhotoDetail, PhotoResponse } from "./mod.ts"
import { parsePhotoDetailData } from "./utils.ts"
import { tty, colors } from "./deps.ts"

export interface GetPhotosParameters {
    query: string
    count: number
    size: "raw" | "thumb" | "small" | "regular" | "full"
}

export const getPhotoData = async (client: Unsplash, query: string, count: number) => {
    const photos = await getPhotos(client, query, count)
    return parsePhotoData(photos)
}

export const getPhotoDetailData = async (client: Unsplash, photos: Photo[], batch = 4) => {
    const responses: PhotoResponse[] = []

    const tasks: Promise<void>[] = []

    const batchCount = Math.ceil(photos.length / batch)

    let count = 1

    for (let i = 0; i < batch; i++) {
        const batchPhotos = (() => {
            if (i === batch - 1) {
                return photos.slice(i * batchCount)
            } else {
                return photos.slice(i * batchCount, (i + 1) * batchCount)
            }
        })()

        tasks.push(
            (async () => {
                for (const photo of batchPhotos) {
                    while (true) {
                        const response = await client.photos.get(photo.id)

                        if (typeof response.id !== "string" || response === undefined) {
                            // wait for 5 sec
                            tty.eraseLine
                                .cursorMove(-1000, 0)
                                .text(`${colors.red.bold("[ERROR]")} Failed to fetch ${response.id}. Retrying...`)
                            await new Promise((resolve) => setTimeout(resolve, 5000))
                            continue
                        }

                        tty.eraseLine
                            .cursorMove(-1000, 0)
                            .text(`${colors.blue.bold("[INFO]")} ${response.id} fetched. (${count}/${photos.length})`)

                        responses.push(response)

                        count += 1
                        break
                    }
                }
            })()
        )
    }

    await Promise.all(tasks)

    return parsePhotoDetailData(responses)
}
