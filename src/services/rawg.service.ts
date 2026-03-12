import axios from "axios"

export const getPopularGames = async () => {
    const RAWG_KEY = process.env.RAWG_API_KEY

    if (!RAWG_KEY) {
        throw new Error("API_KEY is missing")
    }

    const response = await axios.get("https://api.rawg.io/api/games", {
        params: {
            key: RAWG_KEY,
            page_size: 20,
            ordering: "-added"
        }
    })

    return response.data.results.map((game: any, index: number) => ({
        id: game.id,
        title: game.name,
        rating: game.rating,
        released: game.released,
        image: game.background_image,
        rank: index + 1
    }))
}

export const getHeroGames = async () => {
    const RAWG_KEY = process.env.RAWG_API_KEY

    if (!RAWG_KEY) {
        throw new Error('API_KEY_MISSING')
    }

    const response = await axios.get("https://api.rawg.io/api/games", {
        params: {
            key: RAWG_KEY,
            page_size: 3,
            ordering: "-added"
        }
    })

    return response.data.results.map((game: any) => ({
        id: game.id,
        title: game.name,
        image: game.background_image
    }))
}

export const getGameById = async (id: string) => {
    const RAWG_KEY = process.env.RAWG_API_KEY

    if (!RAWG_KEY) {
        throw new Error("API_KEY_MISSING")
    }

    const response = await axios.get(`https://api.rawg.io/api/games/${id}`, {
        params: {
            key: RAWG_KEY
        }
    })

    const game = response.data

    const pcPlatform = game.platforms?.find(
        (p: any) => p.platform.slug === "pc"
    )

    return {
        id: game.id,
        title: game.name,
        description: game.description_raw,
        released: game.released,
        rating: game.rating,
        background: game.background_image,
        website: game.website,
        genres: game.genres?.map((g: any) => g.name),
        platforms: game.platforms?.map((p: any) => p.platform.name),
        requirements: pcPlatform?.requirements_en || null,
        metacritic: game.metacritic,
        tags: game.tags?.slice(0, 6).map((t: any) => t.name)
    }
}

export const getGameScreenshots = async (id: string) => {
    const RAWG_KEY = process.env.RAWG_API_KEY

    if (!RAWG_KEY) {
        throw new Error("API_KEY_MISSING")
    }

    const response = await axios.get(
        `https://api.rawg.io/api/games/${id}/screenshots`,
        {
            params: { key: RAWG_KEY }
        }
    )

    return response.data.results.map((screenshot: any) => ({
        id: screenshot.id,
        image: screenshot.image
    }))
}

export const getGameMovies = async (id: string) => {
    const RAWG_KEY = process.env.RAWG_API_KEY

    if (!RAWG_KEY) {
        throw new Error("API_KEY_MISSING")
    }

    const response = await axios.get(`https://api.rawg.io/api/games/${id}/movies`, {
        params: {
            key: RAWG_KEY
        }
    })

    return response.data.results.map((movie: any) => ({
        id: movie.id,
        name: movie.name,
        preview: movie.preview,
        video480: movie.data?.["480"],
        videoMax: movie.data?.max
    }))
}