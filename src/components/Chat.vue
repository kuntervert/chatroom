<template>
  <div class="mainDiv">
    <v-col class="mainCol">
      <v-row class="usernameRow">
        <h3>Logged in as: {{userData}}</h3>
      </v-row>
      <v-row class="onlineCounterRow">
        <h4>Users online: {{userCount}}</h4>
      </v-row>
      <v-row class="chatRow">
        <v-col class="chatCol">
          <v-card outlined class="chatCard">
            <perfect-scrollbar class="scrollBar">
              <v-container id="container" ref="messageDisplay" class="chatContainer">
                <v-col class="messageCol" v-for="(m, index) in otherMessages" :key="index">
                  <v-row class="userRow">
                    <div class="userDiv">{{m.userId}} ({{m.messageDate}})</div>
                  </v-row>
                  <v-row class="messageRow">
                    <div class="messageDiv">{{m.messageText}}</div>
                  </v-row>
                </v-col>
              </v-container>
            </perfect-scrollbar>
            <small v-if="typing" class="text-white">{{typing}} is typing...</small>
          </v-card>
        </v-col>
        <v-col class="onlineBox">
          <v-row class="onlineBoxHeader">Users chatting:</v-row>
          <div class="onlineUserRow" v-for="(u, index) in onlineUsers" :key="index">{{u.id}}</div>
        </v-col>
      </v-row>
      <v-row class="inputRow">
        <v-col class="inputCol">
          <v-textarea
            class="msgField"
            rounded
            outlined
            rows="2"
            no-resize
            v-model="userMessage"
            label="Type your message..."
            v-on:keyup.enter="sendMessages"
          ></v-textarea>
        </v-col>
        <v-col class="msgBtnCol">
          <v-btn class="msgBtn" @click="sendMessages()">Send</v-btn>
        </v-col>
      </v-row>
    </v-col>
  </div>
</template>
<script src="/socket.io/socket.io.js"></script>
<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import io from "socket.io-client";

const socket = io("https://devert.ee:3000");

export default {
  components: {
    PerfectScrollbar
  },
  data: () => ({
    username: null,
    typing: false,
    otherMessages: null,
    userMessage: null,
    onlineUsers: [],
    userCount: 0
  }),
  created() {
    this.messageWatch();
    this.isTyping();
    this.notTyping();
    this.whoOnline();
  },
  mounted() {
    this.username = this.userData;
    this.getMessages();
    let account = {
      id: this.$store.state.user.userId
    };

    socket.on("connect", () => {
      socket.emit("getOnline", account);
    });

    socket.on("connections", data => {
      this.userCount = data;
    });
    socket.on("newConnection", data => {
      this.onlineUsers = data;
    });
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
    whoOnline() {
      socket.on("onlineUser", data => {
        this.onlineUsers = data;
      });
    },
    isTyping() {
      socket.on("typing", data => {
        this.typing = data;
      });
    },
    notTyping() {
      socket.on("stopTyping", () => {
        this.typing = false;
      });
    },
    messageWatch() {
      socket.on("message", data => {
        this.getMessages();
      });
    },
    // sendUserCount() {
    //   let data = 10;
    //   socket.emit("newConnection", data);
    // },

    async sendMessages() {
      var currentDate = new Date();
      let deit = null;
      let hours = currentDate.getHours();
      let minutes = currentDate.getMinutes();
      if (minutes < 10) {
        deit = hours + ":" + "0" + minutes;
      } else {
        deit = hours + ":" + minutes;
      }
      if (this.userMessage === "") {
        return;
      }
      if (this.userMessage.length > 200) {
        return;
      }
      const message = {
        userId: this.userData,
        messageText: this.userMessage,
        messageDate: deit
      };

      this.userMessage = null;
      await axios
        .post("/api/user/send", message)
        .then(response => response.data);
      this.getMessages();
      this.scroll();
    },
    async getMessages() {
      let messageData = null;
      await axios.get("/api/user/messages").then(response => {
        let msgs = response.data;
        this.messageData = msgs.slice(-15);
      });
      this.otherMessages = this.messageData;
    }
  },
  watch: {
    userMessage(value) {
      value
        ? socket.emit("typing", this.$store.state.user.userId)
        : socket.emit("stopTyping");
    }
  },
  updated() {
    this.scroll();
  }
};
</script>

<style scoped lang="scss">
.v-application {
  margin-top: 0;
}
.mainDiv {
  display: flex;
  height: 80vh;
  margin-left: 2%;
  margin-top: 2%;
  max-width: 45vw;
}
.mainCol {
  max-width: 45vw;
}
.chatCol {
  padding-left: 0;
}

.chatCard {
  border-color: #9a62e4;
  opacity: 1;
  max-width: 45vw;
  border-radius: 35px !important;
}
.scrollBar {
  max-width: 45vw;
  background-color: #efdeff;
}
.messageCol {
  max-height: 20%;
  padding-left: 0;
}
.chatContainer {
  max-height: 50vh;
  max-width: 40vw;
  padding-left: 5%;
  padding-right: 5%;
}
.userRow {
  background-color: #d5aafc;
  border-radius: 5px;
}
.userDiv {
  width: 100%;
  padding-left: 2%;
  text-align: left;
}
.messageRow {
  background-color: #dec0f9;
  border-radius: 5px;
}
.messageDiv {
  width: 100%;
  padding-left: 2%;
  text-align: left;
}
.msgBtnCol {
  max-width: fit-content;
  padding-left: 0px;
}
.v-btn:not(.v-btn--round).v-size--default {
  margin-right: 50%;
  height: 7vh;
  margin-top: 1.2%;
  border-radius: 40px;
}
.msgBtn {
  background-color: #ebd5ff !important;
}
.msgField {
  max-width: 100%;
}
.inputRow {
  max-width: 75%;
}
.inputCol {
  max-width: 90%;
}
.msgRow {
  max-width: 60%;
}
.onlineBox {
  position: relative;
  max-width: 25%;
  height: 100%;
  margin-left: 5%;
  background-color: #ebd5ff !important;
  border-radius: 15px !important;
}
.onlineBoxHeader {
  justify-content: left;
  max-width: 100%;
  padding-left: 4%;
}
.onlineUserRow {
  padding-top: 5%;
  text-align: left;
}

@media only screen and (max-width: 600px) {
}
</style>
