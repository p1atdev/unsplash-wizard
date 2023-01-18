import {
    Unsplash,
    parsePhotoData,
    getPhotos,
    Photo,
    PhotoSize,
    PhotoResponse,
    downloadImage,
    saveTxtFile,
    PhotoDetail,
    parsePhotoDetailData,
} from "./mod.ts"
import { tty, colors } from "./deps.ts"
import { log } from "./log.ts"

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
                            // wait for 10 sec
                            tty.eraseLine
                                .cursorMove(-1000, 0)
                                .text(`${colors.red.bold("[ERROR]")} Failed to fetch ${photo.id}. Retrying...`)
                            await new Promise((resolve) => setTimeout(resolve, 10000))
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

export const downloadPhotos = async (photos: Photo[], output: string, size: PhotoSize, batch = 4) => {
    const tasks: Promise<void>[] = []

    const batchCount = Math.ceil(photos.length / 4)

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
                    const url = new URL(photo.urls[size])

                    const ext = url.searchParams.get("fm") ?? "jpg"
                    const filename = `${photo.id}.${ext}`

                    const path = `${output}/${filename}`

                    try {
                        await Deno.stat(path)
                        tty.eraseLine
                            .cursorMove(-1000, 0)
                            .text(`${colors.yellow.bold("[WARN]")} ${filename} already exists. Skipping...`)
                        continue
                    } catch {
                        // file does not exist
                    }

                    await downloadImage(url, path)

                    tty.eraseLine
                        .cursorMove(-1000, 0)
                        .text(`${colors.blue.bold("[INFO]")} ${filename} downloaded. (${count}/${photos.length})`)

                    count += 1
                }
            })()
        )
    }

    await Promise.all(tasks)

    tty.eraseLine.cursorMove(-1000, 0).text("")
    log.success("Download completed!")
}

export interface SavePhotoCaptionParameters {
    photo: Photo
    output: string
    inaccurateDescription: boolean
    color: boolean
}

export const savePhotoCaption = async ({ photo, output, inaccurateDescription, color }: SavePhotoCaptionParameters) => {
    const captions: string[] = []

    if (typeof photo.alt_description === "string") {
        captions.push(photo.alt_description)
    }

    // 精度が低い
    if (typeof photo.description === "string" && inaccurateDescription) {
        captions.push(photo.description)
    }

    if (photo.tags.length > 0) {
        captions.push(...photo.tags)
    }

    if (typeof photo.color === "string" && color) {
        captions.push(`color code: ${photo.color}`)
    }

    const caption = captions.join(", ")

    await saveTxtFile(`${output}/${photo.id}.txt`, caption)
}

export interface SavePhotoDetailCaptionParameters extends SavePhotoCaptionParameters {
    photo: PhotoDetail
    location: boolean
    exif: boolean
    relatedTags: boolean
}

export const savePhotoDetailCaption = async ({
    photo,
    output,
    inaccurateDescription,
    color,
    location,
    exif,
    relatedTags,
}: SavePhotoDetailCaptionParameters) => {
    const captions: string[] = []

    if (typeof photo.alt_description === "string") {
        captions.push(photo.alt_description)
    }

    // 精度が低い
    if (typeof photo.description === "string" && inaccurateDescription) {
        captions.push(photo.description)
    }

    if (location) {
        const locations: string[] = []
        if (typeof photo.location?.name === "string") {
            locations.push(...photo.location.name.split(",").map((s) => s.trim()))
        }
        if (typeof photo.location?.city === "string") {
            locations.push(...photo.location.city.split(",").map((s) => s.trim()))
        }
        if (typeof photo.location?.country === "string") {
            locations.push(...photo.location.country.split(",").map((s) => s.trim()))
        }
        if (locations.length > 0) {
            captions.push(...new Set(locations))
        }
    }

    if (exif) {
        const cameraTags: string[] = []
        if (typeof photo.exif?.make === "string") {
            cameraTags.push(...photo.exif.make.split(" ").map((s) => s.trim()))
        }
        if (typeof photo.exif?.model === "string") {
            cameraTags.push(...photo.exif.model.split(" ").map((s) => s.trim()))
        }
        if (typeof photo.exif?.exposure_time === "string") {
            cameraTags.push(...`${photo.exif.exposure_time}sec`.split(" ").map((s) => s.trim()))
        }
        if (typeof photo.exif?.aperture === "string") {
            cameraTags.push(...`f/${photo.exif.aperture}`.split(" ").map((s) => s.trim()))
        }
        if (typeof photo.exif?.focal_length === "string") {
            cameraTags.push(...`${photo.exif.focal_length}mm`.split(" ").map((s) => s.trim()))
        }
        if (typeof photo.exif?.iso === "number") {
            cameraTags.push(...`ISO ${photo.exif.iso}`.split(" ").map((s) => s.trim()))
        }
        if (cameraTags.length > 0) {
            captions.push(`shot on ${Array.from(new Set(cameraTags)).join(" ")}`)
        }
    }

    const tags: string[] = []

    if (photo.tags.length > 0) {
        tags.push(...photo.tags)
    }

    if (relatedTags && photo.related_tags.length > 0) {
        tags.push(...photo.related_tags)
    }

    if (tags.length > 0) {
        captions.push(...new Set(tags))
    }

    if (typeof photo.color === "string" && color) {
        captions.push(`color code: ${photo.color}`)
    }

    const caption = captions.join(", ")

    await saveTxtFile(`${output}/${photo.id}.txt`, caption)
}
