import { Color, Language, Links, Tag, TopicSubmissions, Urls } from "../../common.ts"
import { User } from "../../user.ts"

export interface SearchPhotosParams {
    query: string
    page?: number
    per_page?: number
    order_by?: "relevant" | "latest"
    collections?: string
    content_filter?: "low" | "high"
    color?: Color
    lang?: Language
}

export interface SearchPhotosResponse {
    total: number
    total_pages: number
    results: SearchPhotosResponseResult[]
}

export interface SearchPhotosResponseResult {
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
    premium: boolean
    user: User
    tags_preview: Tag[]
}
