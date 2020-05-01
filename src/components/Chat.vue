<template>
  <div style>
    <v-row>
      <h3>Logged in as: {{userData}}</h3>

    </v-row>
    <v-row>
          <h4>Users online: {{connections}}</h4>
    </v-row>
    <v-card outlined class="chatCard">
      <perfect-scrollbar style="max-width: 45vw; background-color: #EFDEFF;">
        <v-container
          id="container"
          ref="messageDisplay"
          style="max-height:50vh; max-width: 40vw; margin-left:5% "
        >
          <v-col
            style=" max-height:20%; padding-left: 0; "
            v-for="(m, index) in otherMessages"
            :key="index"
          >
            <v-row style="background-color: #D5AAFC;border-radius: 5px">
              <div
                style=" width:100%;padding-left:2%; text-align:left"
              >{{m.userId}} ({{m.messageDate}})</div>
            </v-row>
            <v-row style="background-color: #DEC0F9;border-radius: 5px;">
              <div style="width:100%; padding-left:2%; text-align: left">{{m.messageText}}</div>
            </v-row>
            
          </v-col>
          
        </v-container>

      </perfect-scrollbar>
              <small v-if="typing" class="text-white">{{typing}} is typing</small>
    </v-card>
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
      <v-col class="msgBtnCol">
        <v-btn class="msgBtn" @click="sendMessages()">Send</v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script src="/socket.io/socket.io.js"></script>
<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import io from 'socket.io-client';

const socket = io('http://devert.ee:3000');

export default {
  
  components: {
    PerfectScrollbar
  },
  data: () => ({
    username: null,
    typing: false,
    otherMessages: null,
    userMessage: null,
    connections: 0,
    messageRules: [v => v.length <= 200 || "Message characted limit exceeded"]
  }),
  created() {
    this.messageWatch()
    this.usersWatch()
    this.isTyping()
    this.notTyping()
     socket.on('connections', (data) => {
                this.connections = data;
    });



  },
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
    isTyping() {
    socket.on('typing', (data) => {
        this.typing = data;
    });
    },
    notTyping() {
    socket.on('stopTyping', () => {
        this.typing = false;
    });
    },
    messageWatch() {
      socket.on('message', data => {
      console.log("new mes message")
      console.log(data)
      this.getMessages()
    });
    },
    usersWatch() {
      socket.on('getCount', data => {
      this.userCount = data
    });
    },
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
        return
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
        value ? socket.emit('typing', this.$store.state.user.userId) : socket.emit('stopTyping')
    }
},
  updated() {
    this.scroll();

  },
};
</script>

<style scoped lang="scss">
.v-application {
  overflow-y: hidden;
}
.chatCard {
  border-color: #9a62e4;
  opacity: 1;
  max-width: 45vw;
  border-radius: 35px !important;
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
.inputCol {
  max-width: 27%;
  margin-left: 3%;
}
.msgRow {
  max-width: 60%;
}

@media only screen and (max-width: 600px) {

}
</style>
