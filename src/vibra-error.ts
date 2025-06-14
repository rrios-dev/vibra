class VibraError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VibraError';
  }
}

export default VibraError;  