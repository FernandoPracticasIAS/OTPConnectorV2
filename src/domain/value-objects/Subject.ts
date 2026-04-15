export class Subject {
  private static readonly MAX_LENGTH = 255;

  public readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Email subject cannot be empty');
    }

    if (value.length > Subject.MAX_LENGTH) {
      throw new Error(`Email subject cannot exceed ${Subject.MAX_LENGTH} characters`);
    }

    this.value = value.trim();
  }

  public getValue(): string {
    return this.value;
  }
}
