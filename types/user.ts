export interface User {
    id: string
    updated_at: Date
    username: string
    name: string
    first_name: string
    last_name: null | string
    twitter_username: null | string
    portfolio_url: null | string
    bio: null | string
    location: null | string
    links: UserLinks
    profile_image: ProfileImage
    instagram_username: null | string
    total_collections: number
    total_likes: number
    total_photos: number
    accepted_tos: boolean
    for_hire: boolean
    social: Social
}

export interface UserLinks {
    self: string
    html: string
    photos: string
    likes: string
    portfolio: string
    following: string
    followers: string
}

export interface ProfileImage {
    small: string
    medium: string
    large: string
}

export interface Social {
    instagram_username: null | string
    portfolio_url: null | string
    twitter_username: null | string
    paypal_email: null
}
