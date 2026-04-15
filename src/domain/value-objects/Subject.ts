export class Subject {
  constructor(
    public readonly value: string,
  ){}
  public getValue(): string {
    return this.value;
  }
}