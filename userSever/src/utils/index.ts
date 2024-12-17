export const BadRequestException = (error: string) => {
  return {
    success: false,
    error,
  };
};
