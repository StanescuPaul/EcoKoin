export class AppError extends Error {
  public statusCode: number; //in TS trebuie declarat explicit variabila clasei
  constructor(message: string, status: number) {
    super(message); // super apeleaza clasa parinte pentru a putea prelua message
    this.statusCode = status;
  }
}
