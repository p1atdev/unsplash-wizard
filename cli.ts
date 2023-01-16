import { Unsplash } from "./client.ts"
import { Command, tty, colors } from "./deps.ts"
import { log } from "./log.ts"
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
    .option("-k, --key <string>", "Unsplash access key")
    .action(async (options, query) => {
        const { limit, output, dump, key } = options

        const client = key ? new Unsplash("official", key) : new Unsplash()

        const data = await getPhotoData(client, query, limit)

        log.info("Found", data.length, "images")

        if (dump) {
            log.info("Dumping data to", dump)
            await Deno.writeTextFile(dump, JSON.stringify(data, null, 4))
        } else {
            // TODO: download images
        }

        log.success("Done")
    })
    .parse(Deno.args)
