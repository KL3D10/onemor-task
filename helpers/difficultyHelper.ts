export const difficultyIconDecider = (difficulty: number) => {
    switch (difficulty) {
        case 0:
            return "signal-cellular-1"
        case 1:
            return "signal-cellular-2"
        case 2:
            return "signal-cellular-3"
    }
}

export const difficultyLabelDecider = (difficulty: number) => {
    switch (difficulty) {
        case 0:
            return "Beginner"
        case 1:
            return "Intermediate"
        case 2:
            return "Advanced"
    }
}