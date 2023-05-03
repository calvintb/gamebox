type Props = {
    prompt: string;
}

export const Question = ({prompt}: Props) => {

    return (
        <div>
            <h1 className="smaller">{prompt}</h1>
        </div>
    )
}