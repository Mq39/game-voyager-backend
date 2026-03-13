import axios from "axios"

const RAWG_BASE_URL = "https://api.rawg.io/api"

const getRawgKey = (): string => {
    const rawgKey = process.env.RAWG_API_KEY

    if (!rawgKey) {
        throw new Error("API_KEY_MISSING")
    }

    return rawgKey
}

interface RawgGameListItem {
    id: number
    name: string
    background_image: string | null
    rating: number
    released: string | null
}

interface RawgGamesResponse {
    count: number
    next: string | null
    previous: string | null
    results: RawgGameListItem[]
}

interface RawgGenre {
    name: string
}

interface RawgTag {
    name: string
}

interface RawgPlatform {
    platform: {
        name: string
        slug: string
    }
    requirements_en?: string | null
}

interface RawgGameDetailsResponse {
    id: number
    name: string
    description_raw: string | null
    released: string | null
    rating: number
    background_image: string | null
    website: string | null
    genres?: RawgGenre[]
    platforms?: RawgPlatform[]
    metacritic: number | null
    tags?: RawgTag[]
}

interface RawgScreenshot {
    id: number
    image: string
}

interface RawgScreenshotsResponse {
    results: RawgScreenshot[]
}

interface RawgMovie {
    id: number
    name: string
    preview: string
    data?: {
        "480"?: string
        max?: string
    }
}

interface RawgMoviesResponse {
    results: RawgMovie[]
}

export interface BrowseGamesOptions {
    search?: string
    genres?: string
    platforms?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export const getPopularGames = async () => {
    const rawgKey = getRawgKey()

    const response = await axios.get<RawgGamesResponse>(`${RAWG_BASE_URL}/games`, {
        params: {
            key: rawgKey,
            page_size: 20,
            ordering: "-added"
        }
    })

    return response.data.results.map((game, index) => ({
        id: game.id,
        title: game.name,
        rating: game.rating,
        released: game.released ?? undefined,
        image: game.background_image ?? "",
        rank: index + 1
    }))
}

export const getHeroGames = async () => {
    const rawgKey = getRawgKey()

    const response = await axios.get<RawgGamesResponse>(`${RAWG_BASE_URL}/games`, {
        params: {
            key: rawgKey,
            page_size: 3,
            ordering: "-added"
        }
    })

    return response.data.results.map((game) => ({
        id: game.id,
        title: game.name,
        image: game.background_image ?? ""
    }))
}

export const searchGames = async (query: string, pageSize = 6) => {
    const rawgKey = getRawgKey()

    if (!query.trim()) {
        return []
    }

    const response = await axios.get<RawgGamesResponse>(`${RAWG_BASE_URL}/games`, {
        params: {
            key: rawgKey,
            search: query,
            page_size: pageSize
        }
    })

    return response.data.results.map((game) => ({
        id: game.id,
        title: game.name,
        image: game.background_image ?? "",
        released: game.released ?? undefined
    }))
}

export const getGameById = async (id: string) => {
    const rawgKey = getRawgKey()

    const response = await axios.get<RawgGameDetailsResponse>(
        `${RAWG_BASE_URL}/games/${id}`,
        {
            params: {
                key: rawgKey
            }
        }
    )

    const game = response.data

    const pcPlatform = game.platforms?.find(
        (platform) => platform.platform.slug === "pc"
    )

    return {
        id: game.id,
        title: game.name,
        description: game.description_raw ?? "",
        released: game.released ?? undefined,
        rating: game.rating,
        background: game.background_image ?? "",
        website: game.website ?? "",
        genres: game.genres?.map((genre) => genre.name) ?? [],
        platforms: game.platforms?.map((platform) => platform.platform.name) ?? [],
        requirements: pcPlatform?.requirements_en ?? null,
        metacritic: game.metacritic ?? null,
        tags: game.tags?.slice(0, 6).map((tag) => tag.name) ?? []
    }
}

export const getGameScreenshots = async (id: string) => {
    const rawgKey = getRawgKey()

    const response = await axios.get<RawgScreenshotsResponse>(
        `${RAWG_BASE_URL}/games/${id}/screenshots`,
        {
            params: { key: rawgKey }
        }
    )

    return response.data.results.map((screenshot) => ({
        id: screenshot.id,
        image: screenshot.image
    }))
}

export const getGameMovies = async (id: string) => {
    const rawgKey = getRawgKey()

    const response = await axios.get<RawgMoviesResponse>(
        `${RAWG_BASE_URL}/games/${id}/movies`,
        {
            params: {
                key: rawgKey
            }
        }
    )

    return response.data.results.map((movie) => ({
        id: movie.id,
        name: movie.name,
        preview: movie.preview,
        video480: movie.data?.["480"] ?? null,
        videoMax: movie.data?.max ?? null
    }))
}

export const browseGames = async ({
    search,
    genres,
    platforms,
    ordering,
    page = 1,
    pageSize = 20
}: BrowseGamesOptions) => {
    const rawgKey = getRawgKey()

    const response = await axios.get<RawgGamesResponse>(`${RAWG_BASE_URL}/games`, {
        params: {
            key: rawgKey,
            search: search || undefined,
            genres: genres || undefined,
            platforms: platforms || undefined,
            ordering: ordering || undefined,
            page,
            page_size: pageSize
        }
    })

    return {
        count: response.data.count,
        results: response.data.results.map((game) => ({
            id: game.id,
            title: game.name,
            image: game.background_image ?? "",
            rating: game.rating,
            released: game.released ?? undefined
        }))
    }
}