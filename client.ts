import { SearchPhotosParams, SearchPhotosResponse, PhotoResponse } from "./types/mod.ts"

const unofficialHost = "https://unsplash.com/napi"
const host = "https://api.unsplash.com"

export type HostType = "unofficial" | "official"

export class Unsplash {
    private readonly host: URL
    private readonly accessKey?: string

    constructor(hostType: HostType = "unofficial", accessKey?: string) {
        this.host = new URL(hostType === "official" ? host : unofficialHost)
        this.accessKey = accessKey
    }

    search = {
        photos: async (params: SearchPhotosParams): Promise<SearchPhotosResponse> => {
            const url = new URL(this.host.pathname + "/search/photos", this.host)
            Object.entries(params).forEach(([key, value]) => {
                if (value) {
                    url.searchParams.append(key, value.toString())
                }
            })
            const response = await fetch(url, {})
            return await response.json()
        },
    }

    photos = {
        get: async (id: string): Promise<PhotoResponse> => {
            const url = new URL(this.host.pathname + `/photos/${id}`, this.host)
            const response = await fetch(url, {})
            return await response.json()
        },
    }
}
