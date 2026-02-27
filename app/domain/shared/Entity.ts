export abstract class Entity<ID> {
  protected readonly _id: ID;

  protected constructor(id: ID) {
    this._id = id;
  }

  get id(): ID {
    return this._id;
  }

  equals(entity?: Entity<ID>): boolean {
    if (!entity) return false;
    if (entity === this) return true;
    return entity._id === this._id;
  }

}
