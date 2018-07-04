export class User {
  public id?: any;
  public username?: string;
  public firstName?: string;
  public lastName?: string;
  public email?: string;

  constructor(
    id?: any,
    username?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
  ) {
    this.id = id ? id : null;
    this.username = username ? username : null;
    this.firstName = firstName ? firstName : null;
    this.lastName = lastName ? lastName : null;
    this.email = email ? email : null;
  }
}
