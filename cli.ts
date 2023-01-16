import { Command, tty, colors } from "./deps.ts"
import { log } from "./log.ts"
import { downloadPhotos, savePhotoCaption, savePhotoDetailCaption } from "./main.ts"
import { Unsplash, getPhotoData, getPhotoDetailData, Photo, PhotoDetail } from "./mod.ts"

await new Command()
    .name("unsplash-wizard")
    .version("0.1.0")
    .description("Unsplash Images Downloader")
    .command("photos")
    .arguments("<query:string>")
    .description("Search for images")
    .option("-l, --limit <number:number>", "Number of images to download", {
        default: 30,
    })
    .option("-o, --output <path:string>", "Output directory", {
        default: "./unsplash",
    })
    .option("-d, --dump <path:string>", "Dump data to file", {})
    .option("--detail [boolean:boolean]", "Get more details about the images", {
        default: false,
        depends: ["dump"],
    })
    .option("-k, --key <string>", "Unsplash access key")
    .action(async (options, query) => {
        const { limit, output, dump, key, detail } = options

        const client = key ? new Unsplash("official", key) : new Unsplash()

        log.info("Searching for", colors.bold(query), "images")

        const data = await getPhotoData(client, query, limit)

        tty.eraseLine.cursorMove(-1000, 0).text("")
        log.info(data.length, "images found!")

        if (dump) {
            if (detail) {
                log.info("Getting detailed data")
                const detailed = await getPhotoDetailData(client, data)
                tty.eraseLine.cursorMove(-1000, 0).text("")
                log.info("Dumping detailed data to", dump)
                await Deno.writeTextFile(dump, JSON.stringify(detailed, null, 4))
            } else {
                log.info("Dumping data to", dump)
                await Deno.writeTextFile(dump, JSON.stringify(data, null, 4))
            }
        } else {
            // TODO: download images
        }

        log.success("Done")
    })

    .command("download")
    .arguments("<path:string>")
    .description("Download images from a json file")
    .option("-o, --output <path:string>", "Output directory", {
        required: true,
    })
    .option("--detail [boolean:boolean]", "Download detailed images", {
        default: true,
    })
    .option("--size <string>", "Image size", {
        default: "small",
    })
    .option("-c, --caption", "Save image captions", {
        default: true,
    })
    .option("--likes <number:number>", "Minimum likes", {
        default: 10,
    })
    .option("--color [boolean:boolean]", "Use color code in caption", {
        default: false,
    })
    .option("--inaccurateDescription [boolean:boolean]", "Add caption to image", {
        default: false,
    })
    .option("--location [boolean:boolean]", "Add location to caption", {
        default: true,
    })
    .option("--exif [boolean:boolean]", "Add exif to caption", {
        default: true,
    })
    .option("--relatedTags [boolean:boolean]", "Add related tags to caption", {
        default: false,
    })
    .option("--batch <batch:number>", "Batch size", {
        default: 100,
    })
    .action(async (options, path) => {
        const {
            output,
            detail,
            size,
            caption,
            likes,
            color,
            inaccurateDescription,
            location,
            exif,
            relatedTags,
            batch,
        } = options

        try {
            await Deno.stat(path)
        } catch {
            log.error("Invalid json path")
            Deno.exit(1)
        }

        if (size !== "raw" && size !== "full" && size !== "regular" && size !== "small" && size !== "thumb") {
            log.error("Invalid image size")
            Deno.exit(1)
        }

        const json = await Deno.readTextFile(path)
        const data = JSON.parse(json)

        if (data.length === 0) {
            log.error("No data found")
            Deno.exit(1)
        }

        if (data[0].id === undefined) {
            log.error("Invalid data")
            Deno.exit(1)
        }

        try {
            await Deno.stat(output)
        } catch {
            await Deno.mkdir(output)
        }

        const tasks: Promise<void>[] = []

        if (!detail) {
            const photos = (data as Photo[]).filter((photo) => {
                return photo.likes >= likes
            })

            tasks.push(downloadPhotos(photos, output, size, batch))

            if (caption) {
                tasks.push(
                    (async () => {
                        for (const photo of photos) {
                            await savePhotoCaption({
                                photo,
                                output,
                                inaccurateDescription,
                                color,
                            })
                        }

                        log.success("Saved captions")
                    })()
                )
            }
        } else {
            const photos = (data as PhotoDetail[]).filter((photo) => {
                return photo.likes >= likes
            })

            tasks.push(downloadPhotos(photos, output, size, batch))

            if (caption) {
                tasks.push(
                    (async () => {
                        for (const photo of photos) {
                            await savePhotoDetailCaption({
                                photo,
                                output,
                                inaccurateDescription,
                                color,
                                location,
                                exif,
                                relatedTags,
                            })
                        }

                        log.success("Saved captions")
                    })()
                )
            }
        }

        await Promise.all(tasks)

        log.success("All done")
    })

    .parse(Deno.args)
