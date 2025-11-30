
export const tourService = {
    // Check if the user has seen the tour
    hasSeenTour: (): boolean => {
        return !!localStorage.getItem('mv_tour_seen');
    },

    // Mark the tour as seen
    completeTour: (): void => {
        localStorage.setItem('mv_tour_seen', 'true');
    },

    // Reset tour state (useful for debugging or "Show Again" button)
    resetTour: (): void => {
        localStorage.removeItem('mv_tour_seen');
        window.location.reload();
    }
};
