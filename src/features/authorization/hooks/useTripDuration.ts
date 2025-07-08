export const useTripDuration = (departureDate: string, returnDate: string) => {
  const duration = Math.ceil(
    (new Date(returnDate).getTime() - new Date(departureDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  return duration;
};
