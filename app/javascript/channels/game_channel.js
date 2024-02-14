// // game_channel_subscription.js
// import consumer from "channels/consumer";

// function getCookie(cname) {
//   let name = cname + "=";
//   let ca = document.cookie.split(';');
//   for(let i = 0; i < ca.length; i++) {
//     let c = ca[i];
//     while (c.charAt(0) == ' ') {
//       c = c.substring(1);
//     }
//     if (c.indexOf(name) == 0) {
//       return c.substring(name.length, c.length);
//     }
//   }
//   return "";
// }

// const room_id = getCookie("room_id");

// export const gameChannelSubscription = consumer.subscriptions.create({ channel: 'GameChannel', id: room_id }, {
//   connected() {
//     console.log("Connected to GameChannel with room id :"+ room_id);
//   },
  
//   received(data) {
//       console.log("Received data:", data);
//       debugger
//   },

//   sendMove(data) {
//     console.log("send data to cable")
//     this.perform("move",  data);
//   }
// });
