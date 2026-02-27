import { eq } from "drizzle-orm";

import { DrizzleUserRepository } from "./DrizzleUserRepository";
import { UserMapper } from "./mappers/UserMapper";
import { db } from "../db/connection";
import { users } from "../db/schema";

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

jest.mock("../db/connection", () => ({
  db: {
    insert: jest.fn(),
    select: jest.fn(),
  },
}));

jest.mock("./mappers/UserMapper");
jest.mock("drizzle-orm", () => ({
  eq: jest.fn(),
}));

describe("DrizzleUserRepository", () => {
  const repository = new DrizzleUserRepository();

  const mockOnConflictDoUpdate = jest.fn();
  const mockValues = jest.fn(() => ({
    onConflictDoUpdate: mockOnConflictDoUpdate,
  }));

  beforeEach(() => {
    jest.clearAllMocks();

    (db.insert as jest.Mock).mockReturnValue({
      values: mockValues,
    });
  });

  describe("save", () => {
    it("should save user", async () => {
      const fakeUser = {} as any;

      const persistenceData = {
        id: "1",
        username: "john",
        email: "john@mail.com",
        password: "hashed",
      };

      (UserMapper.toPersistence as jest.Mock).mockResolvedValue(
        persistenceData
      );

      await repository.save(fakeUser);

      expect(UserMapper.toPersistence).toHaveBeenCalledWith(fakeUser);
      expect(db.insert).toHaveBeenCalledWith(users);
      expect(mockValues).toHaveBeenCalledWith(persistenceData);
      expect(mockOnConflictDoUpdate).toHaveBeenCalledWith({
        target: users.id,
        set: persistenceData,
      });
    });

    it("should propagate mapper errors", async () => {
      const fakeUser = {} as any;

      (UserMapper.toPersistence as jest.Mock).mockRejectedValue(
        new Error("Mapper error")
      );

      await expect(repository.save(fakeUser)).rejects.toThrow("Mapper error");
    });
  });

  describe("findById", () => {
    it("should return user when found", async () => {
      const fakeDbUser = { id: "1" };

      const mockLimit = jest.fn().mockResolvedValue([fakeDbUser]);
      const mockWhere = jest.fn(() => ({ limit: mockLimit }));
      const mockFrom = jest.fn(() => ({ where: mockWhere }));

      (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

      const domainUser = {} as any;
      (UserMapper.toDomain as jest.Mock).mockReturnValue(domainUser);

      const result = await repository.findById({ value: "1" } as any);

      expect(eq).toHaveBeenCalledWith(users.id, "1");
      expect(UserMapper.toDomain).toHaveBeenCalledWith(fakeDbUser);
      expect(result).toBe(domainUser);
    });

    it("should return null when not found", async () => {
      const mockLimit = jest.fn().mockResolvedValue([]);
      const mockWhere = jest.fn(() => ({ limit: mockLimit }));
      const mockFrom = jest.fn(() => ({ where: mockWhere }));

      (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

      const result = await repository.findById({ value: "1" } as any);

      expect(result).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("should return user when found", async () => {
      const fakeDbUser = { id: "2" };

      const mockLimit = jest.fn().mockResolvedValue([fakeDbUser]);
      const mockWhere = jest.fn(() => ({ limit: mockLimit }));
      const mockFrom = jest.fn(() => ({ where: mockWhere }));

      (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

      const domainUser = {} as any;
      (UserMapper.toDomain as jest.Mock).mockReturnValue(domainUser);

      const result = await repository.findByEmail({ value: "mail" } as any);

      expect(eq).toHaveBeenCalledWith(users.email, "mail");
      expect(result).toBe(domainUser);
    });

    it("should return null when not found", async () => {
      const mockLimit = jest.fn().mockResolvedValue([]);
      const mockWhere = jest.fn(() => ({ limit: mockLimit }));
      const mockFrom = jest.fn(() => ({ where: mockWhere }));

      (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

      const result = await repository.findByEmail({ value: "mail" } as any);

      expect(result).toBeNull();
    });
  });

  describe("findByUsername", () => {
    it("should return user when found", async () => {
      const fakeDbUser = { id: "3" };

      const mockLimit = jest.fn().mockResolvedValue([fakeDbUser]);
      const mockWhere = jest.fn(() => ({ limit: mockLimit }));
      const mockFrom = jest.fn(() => ({ where: mockWhere }));

      (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

      const domainUser = {} as any;
      (UserMapper.toDomain as jest.Mock).mockReturnValue(domainUser);

      const result = await repository.findByUsername({ value: "john" } as any);

      expect(eq).toHaveBeenCalledWith(users.username, "john");
      expect(result).toBe(domainUser);
    });

    it("should return null when not found", async () => {
      const mockLimit = jest.fn().mockResolvedValue([]);
      const mockWhere = jest.fn(() => ({ limit: mockLimit }));
      const mockFrom = jest.fn(() => ({ where: mockWhere }));

      (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

      const result = await repository.findByUsername({ value: "john" } as any);

      expect(result).toBeNull();
    });
  });

  describe("getPasswordHash", () => {
    it("should return password hash when user exists", async () => {
      const mockLimit = jest.fn().mockResolvedValue([
        { password: "hashedPassword" },
      ]);
      const mockWhere = jest.fn(() => ({ limit: mockLimit }));
      const mockFrom = jest.fn(() => ({ where: mockWhere }));

      (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

      const result = await repository.getPasswordHash({ value: "1" } as any);

      expect(eq).toHaveBeenCalledWith(users.id, "1");
      expect(result).toBe("hashedPassword");
    });

    it("should return null when user not found", async () => {
      const mockLimit = jest.fn().mockResolvedValue([]);
      const mockWhere = jest.fn(() => ({ limit: mockLimit }));
      const mockFrom = jest.fn(() => ({ where: mockWhere }));

      (db.select as jest.Mock).mockReturnValue({ from: mockFrom });

      const result = await repository.getPasswordHash({ value: "1" } as any);

      expect(result).toBeNull();
    });
  });
});