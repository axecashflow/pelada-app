import { AggregateRoot } from "../../shared/AggregateRoot";
import { Email } from "../values-objects/Email";
import { Password } from "../values-objects/Password";
import { UserId } from "../values-objects/UserId";
import { Username } from "../values-objects/Username";

type UserProps = {
  email: Email;
  password?: Password;
  createdAt?: Date;
  username: Username;
};

export class User extends AggregateRoot<UserId> {
  private props: UserProps;

  private constructor(id: UserId, props: UserProps) {
    super(id);
    this.props = props;
  }

  static create(params: {
    id: UserId;
    email: Email;
    username: Username;
    createdAt?: Date;
  }): User {
    return new User(params.id, {
      ...params,
      createdAt: params.createdAt ?? new Date(),
    });
  }

  changeEmail(newEmail: Email) {
    this.props.email = newEmail;
  }

  changeUsername(newUsername: Username) {
    this.props.username = newUsername;
  }

  changePassword(newPassword: Password) {
    this.props.password = newPassword;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get username() {
    return this.props.username;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}