type Props = {
    answer: string,
    username: string
}

export const ResponseCard = ({answer, username}: Props) => {
    return (
        <div>
            <h1>{answer} from {username}</h1>
        </div>
    ); 
}