import IMappedWorkoutData from "../types/IMappedWorkoutData";
import { Datum, Routine } from "../types/IWorkoutData";

export const mapWorkouts = (data: Datum[]): IMappedWorkoutData[] => {
    return data.map(item => {
        return {
            id: item.id,
            difficulty: item.difficulty,
            name: item.name,
            user: {
                profile_photo_url: item.user.profile_photo_url
            },
            total_duration: item.total_duration,
            routines: item.routines.map((routine: Routine) => ({
                id: routine.id,
                name: routine.name,
                video: {
                    duration: routine.video.duration,
                    playlist_url: routine.video.playlist_url
                }
            }))
        };
    });
}