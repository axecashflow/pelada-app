import { Email } from "./Email";

describe("Email Value Object", () => {
  it("should create a valid Email", () => {
    const email = Email.create("test@example.com");
    expect(email.value).toBe("test@example.com");
  });

  it("should normalize email (trim + lowercase)", () => {
    const email = Email.create("  TEST@Example.COM ");
    expect(email.value).toBe("test@example.com");
  });

  it("should throw error if empty", () => {
    expect(() => Email.create("")).toThrow("EmailCannotBeEmpty");
  });

  it("should throw error if invalid format", () => {
    expect(() => Email.create("invalid-email"))
      .toThrow("InvalidEmailFormat");
  });

  it("should throw error if missing domain", () => {
    expect(() => Email.create("test@"))
      .toThrow("InvalidEmailFormat");
  });

  it("should throw error if missing username", () => {
    expect(() => Email.create("@gmail.com"))
      .toThrow("InvalidEmailFormat");
  });
});
