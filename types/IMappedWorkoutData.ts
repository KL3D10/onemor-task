export default interface IMappedWorkoutData {
    id: string;
    difficulty: number;
    name: string;
    user: {
        profile_photo_url: string;
    };
    total_duration: number;
    routines: MappedRoutine[];
};

export interface MappedRoutine {
    id: string;
    name: string;
    video: {
        duration: number;
        playlist_url: string;
    };
}