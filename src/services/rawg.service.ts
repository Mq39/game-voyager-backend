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