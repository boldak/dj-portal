import angular from 'angular';

let emailRegex = /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/;


let UserList = class {

  constructor(scope, userList) {
    this.scope = scope;
    this.invitedUserAdd = null;
    this.userList = userList;
    this.userIsInvited = false;
    this.invitedUserIsValid = false;
  }

  getUsers(filterValue) {
    return new Promise((resolve, reject) => {
      let result = this.userList
        .filter(user =>
          this.scope.widget.form.config.access.users.map(item => item.email).indexOf(user.email) < 0
        )
        .filter(user =>
          user.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.email.toLowerCase().includes(filterValue.toLowerCase())
        )
        .slice(0, 8)
      resolve(result)
    })
  }

  alreadyInvited(value) {

    if (!value) {
      this.userIsInvited = false;
      return
    }

    if (angular.isString(value)) {
      this.userIsInvited = this.scope.widget.form.config.access.users.map(item => item.email).indexOf(value) >= 0;
      return
    }

    if (angular.isDefined(value.email)) {
      this.scope.userIsInvited = this.scope.widget.form.config.access.users.map(item => item.email).indexOf(value.email) >= 0;
      return
    }

    this.userIsInvited = false;
  }

  validInvitedUser(value) {

    this.alreadyInvited(value);

    if (!value) {
      this.invitedUserIsValid = false;
      return
    }

    if (angular.isString(value)) {
      value = value.trim();
      let t = emailRegex.test(value);
      if (t) {
        this.invitedUserAdd = value
      }
      this.invitedUserIsValid = t;
      return
    }

    if (angular.isDefined(value.email)) {
      this.invitedUserAdd = value;
      this.invitedUserIsValid = true;
      return
    }

    this.invitedUserIsValid = false;
  }

  addInvitedUser() {
    this.scope.widget.form.config.access.users = this.scope.widget.form.config.access.users || [];
    if (angular.isString(this.invitedUserAdd)) {
      this.scope.widget.form.config.access.users.push({ email: this.invitedUserAdd })
    } else {
      this.scope.widget.form.config.access.users.push(this.invitedUserAdd)
    }
    this.invitedUserAdd = undefined;
    this.invitedUser = undefined;
    this.invitedUserIsValid = false;
  }

  deleteInvitedUser(email) {
    let index = this.scope.widget.form.config.access.users.map(item => item.email).indexOf(email)
    if (index >= 0) {
      this.scope.widget.form.config.access.users.splice(index, 1)
    }
  }

}



module.exports = UserList;
