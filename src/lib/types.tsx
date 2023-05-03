export type User = {
    id: string,
    name: string,
    location: string,
    response: string,
    points: number
}

export type Location = {
    city: string,
    principalSubdivision: string,
    countryCode: string
}

export type Room = {
    host: string,
    roomCode: string
}

export type Response = {
    response: string,
    username: string
}