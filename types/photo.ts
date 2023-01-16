export interface Photo {
    id: string
    color: string
    description: string | null
    alt_description: string | null
    tags: string[]
    likes: number
    urls: {
        raw: string
        full: string
        regular: string
        small: string
        thumb: string
        small_s3: string
    }
    width: number
    height: number
}

export interface PhotoDetail extends Photo {
    related_tags: string[]
    location: {
        name?: string
        city?: string
        country?: string
        position?: {
            latitude: number
            longitude: number
        }
    }
    exif: {
        make?: string
        model?: string
        exposure_time?: string
        aperture?: string
        focal_length?: string
        iso?: number
    }
    views: number
    downloads: number
}
