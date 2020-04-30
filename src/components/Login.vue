<template>
  <v-card class="loginCard">
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            class="loginText"
            v-on:keyup.enter="testLogin"
            single-line
            rounded
            v-model="username"
            :rules="nameRules"
            label="Username"
            hide-details="true"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-btn class="loginBtn" @keydown.enter="testLogin()" @click="testLogin()">Login</v-btn>
    </v-container>
  </v-card>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
export default {
  data: () => ({
    username: "",
    nameRules: [v => v.length <= 25 || "Username must be shorter"]
  }),
  methods: {
    ...mapActions(["login"]),
    async testLogin() {
      let date = new Date();
      const userInfo = {
        userId: this.username,
        createdAt: date
      };
      try {
        await axios
          .post("http://localhost:3000/api/user/login", userInfo)
          .then(response => response.data);
        await this.login(userInfo);
        this.$router.push("/chat");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.loginCard {
  max-width: 15%;
  margin-left: 40%;
  margin-top: 15%;
  background-color: #9a62e4;
  opacity: 50%;
  border-radius: 35px !important;
}
.loginText {
  background-color: white;
  height: 150%;
}
.form {
  border-radius: 35px;
}
.loginBtn {
  background-color: #9a62e4 !important;
  color: white;
  font-size: 130%;
}
</style>
