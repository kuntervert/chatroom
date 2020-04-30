<template>
  <div class>
    <v-row>
      <h3>Logged in as: {{userData}}</h3>
    </v-row>
    <v-container
      id="container"
      ref="messageDisplay"
      style="overflow-y:auto;max-height:50vh; max-width: 60vw"
    >
      <v-col
        style=" max-width:70%; max-height:20%"
        v-for="(m, index) in otherMessages"
        :key="index"
      >
        <v-row>
          <p>{{m.userId}} ({{m.messageDate}})</p>
        </v-row>
        <v-row>
          <p style="word-wrap: break-word; max-width:100%">{{m.messageText}}</p>
        </v-row>
      </v-col>
    </v-container>
    <v-row>
      <v-col class="inputCol">
        <v-textarea
          class="msgField"
          rounded
          outlined
          rows="2"
          :rules="messageRules"
          no-resize
          v-model="userMessage"
          label="Type your message..."
          v-on:keyup.enter="sendMessages"
        ></v-textarea>
      </v-col>
      <v-btn class="msgBtn" @click="sendMessages()">Send</v-btn>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  data: () => ({
    username: null,
    otherMessages: null,
    userMessage: null,
    messageRules: [v => v.length <= 100 || "Username must be shorter"]
  }),
  mounted() {
    this.username = this.userData;
    this.getMessages();
  },
  computed: {
    ...mapGetters(["userData"])
  },
  methods: {
    scroll: function() {
      document.getElementById("container").scrollTop = document.getElementById(
        "container"
      ).scrollHeight;
    },
    async sendMessages() {
      var currentDate = new Date();
      let hours = currentDate.getHours();
      let minutes = currentDate.getMinutes();
      let deit = hours + ":" + minutes;
      const message = {
        userId: this.userData,
        messageText: this.userMessage,
        messageDate: deit
      };
      this.userMessage = null;
      await axios
        .post("http://localhost:3001/api/user/send", message)
        .then(response => response.data);

      this.getMessages();
    },
    async getMessages() {
      let messageData = null;
      await axios
        .get("http://localhost:3001/api/user/messages")
        .then(response => {
          let msgs = response.data;
          this.messageData = msgs.slice(-15);
          console.log(messageData);
        });
      this.otherMessages = this.messageData;
      console.log(this.otherMessages);
    }
  },
  updated() {
    this.scroll();
  }
};
</script>

<style scoped lang="scss">
.msgBtn {
  margin-right: 50%;
}
.msgField {
  max-width: 100%;
}
.inputCol {
  max-width: 27%;
  margin-left: 17%;
}
.msgRow {
  max-width: 60%;
}
</style>
