import angular from 'angular';

let emailRegex = /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/;

let apikey = () => {
  return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
};

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
        let invited = { 
          email: this.invitedUserAdd,
          apikey: apikey(),
          find: true 
        }
        this.scope.widget.form.config.access.users.push(invited);

        this.scope.transport.findUserProfile(invited.email)
        .then(profile => {
          profile = profile.data;
          invited.find = false;
          if(profile.type != "none"){
            invited.photo = profile.profile.photo;
            invited.name = profile.profile.name;
          }
        })
    
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

  editInvitedUser(user) {
    this.scope.dialog({
        title:"Edit user info",
        fields:{
          email:{
            title:"E-mail", 
            type:'text', 
            value:user.email,
            editable:false, 
            required:false
          },

          apikey:{
            title:"Apikey", 
            type:'text', 
            value:user.apikey,
            editable:false, 
            required:false
          },

          avatar:{
            title:"Avatar",
            type:"text",
            value: user.photo,
            editable:true, 
            required:false
          },

          name:{
            title:"Name",
            type:"text",
            value: user.name,
            editable:true, 
            required:false
          }
        }
    })
    .then(form => {
      user.name = form.fields.name.value;
      user.photo = form.fields.avatar.value;
    })
  }   

}



module.exports = UserList;
