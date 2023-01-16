import { Exif, Links, Meta, Tag, TopicSubmissions, Urls, Location } from "../common.ts"
import { User } from "../user.ts"

export interface PhotoResponse {
    id: string
    created_at: Date
    updated_at: Date
    promoted_at: Date
    width: number
    height: number
    color: string
    blur_hash: string
    description: null
    alt_description: string
    urls: Urls
    links: Links
    likes: number
    liked_by_user: boolean
    current_user_collections: any[]
    sponsorship: null
    topic_submissions: TopicSubmissions
    premium: boolean
    user: User
    exif: Exif
    location: Location
    meta: Meta
    public_domain: boolean
    tags: Tag[]
    tags_preview: Tag[]
    views: number
    downloads: number
    topics: any[]
    related_collections: RelatedCollections
}

export interface RelatedCollections {
    total: number
    type: string
    results: any[]
}
