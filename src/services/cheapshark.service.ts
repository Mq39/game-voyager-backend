import axios from "axios"

export const getPriceBySteamID = async (id: string) => {
    const response = await axios.get("https://www.cheapshark.com/api/1.0/deals", {
        params: {
            id: id
        }
    })

    return response.data.result.map((price: any) => ({
        price: price.normalPrice
    }))
} 