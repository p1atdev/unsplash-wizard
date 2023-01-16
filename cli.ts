import { Unsplash } from "./client.ts"
import { Command, tty, colors } from "./deps.ts"
import { log } from "./log.ts"
import { getPhotoDetailData } from "./main.ts"
import { getPhotoData } from "./mod.ts"

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

    .parse(Deno.args)
