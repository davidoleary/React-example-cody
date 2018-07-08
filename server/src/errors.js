export const INVALID_KEY = 'INVALID_KEY';
export const MATCH_NOT_FOUND = 'MATCH_NOT_FOUND';

class MatchNotFound extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, MatchNotFound.prototype);
    this.name = this.constructor.name;
  }
}

export { MatchNotFound };
