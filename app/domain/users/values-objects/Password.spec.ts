import { Password } from "./Password";

describe("Password Value Object", () => {
  it("should create a valid Password", () => {
    const password = Password.create("MyPass1!");
    expect(password.value).toBe("MyPass1!");
  });

  it("should throw error if empty", () => {
    expect(() => Password.create(""))
      .toThrow("PasswordCannotBeEmpty");
  });

  it("should throw error if less than 8 characters", () => {
    expect(() => Password.create("A1!a"))
      .toThrow("PasswordTooShort");
  });

  it("should throw error if no number", () => {
    expect(() => Password.create("Password!"))
      .toThrow("PasswordMustContainNumber");
  });

  it("should throw error if no special character", () => {
    expect(() => Password.create("Password1"))
      .toThrow("PasswordMustContainSpecialCharacter");
  });

  it("should allow spaces if valid", () => {
    const password = Password.create("My Pass1!");
    expect(password.value).toBe("My Pass1!");
  });
});
