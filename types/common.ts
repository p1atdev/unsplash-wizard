import { User } from "./user.ts"

export type Color =
    | "black_and_white"
    | "black"
    | "white"
    | "yellow"
    | "orange"
    | "red"
    | "purple"
    | "magenta"
    | "green"
    | "teal"
    | "blue"

export type Language = "en"

export interface Links {
    self: string
    html: string
    download: string
    download_location: string
}

export interface Tag {
    type: "landing_page" | "search"
    title: string
    source?: Source
}

export interface Source {
    ancestry: Ancestry
    title: string
    subtitle: string
    description: string
    meta_title: string
    meta_description: string
    cover_photo: CoverPhoto
}

export interface Ancestry {
    type: Category
    category: Category
    subcategory?: Category
}

export interface Category {
    slug: string
    pretty_slug: string
}

export interface CoverPhoto {
    id: string
    created_at: Date
    updated_at: Date
    promoted_at: Date | null
    width: number
    height: number
    color: string
    blur_hash: string
    description: null | string
    alt_description: null | string
    urls: Urls
    links: Links
    likes: number
    liked_by_user: boolean
    current_user_collections: any[]
    sponsorship: null
    topic_submissions: TopicSubmissions
    user: User
    premium?: boolean
}

export interface TopicSubmissions {
    experimental?: Experimental
    wallpapers?: Experimental
    "textures-patterns"?: Experimental
    "current-events"?: Experimental
    "color-of-water"?: Experimental
    spirituality?: Experimental
    "arts-culture"?: Experimental
}

export interface Experimental {
    status: "approved"
    approved_on: Date
}

export interface Urls {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
    small_s3: string
}

export interface ResultTopicSubmissions {
    spirituality?: Experimental
    "levitating-objects"?: Experimental
    experimental?: Experimental
    "fashion-beauty"?: Experimental
}

export interface Exif {
    make: string
    model: string
    name: string
    exposure_time: string
    aperture: string
    focal_length: string
    iso: number
}

export interface PhotoResponseLinks {
    self: string
    html: string
    download: string
    download_location: string
}

export interface Location {
    name: string
    city: string
    country: string
    position: Position
}

export interface Position {
    latitude: number
    longitude: number
}

export interface Meta {
    index: boolean
}
