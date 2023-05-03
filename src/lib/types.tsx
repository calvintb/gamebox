export type User = {
    id: string,
    name: string,
    location: string,
    response: string,
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

export type Questions = {
    value: string,
    key: number
}