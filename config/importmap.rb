# Pin npm packages by running ./bin/importmap

pin "application"
pin_all_from "app/javascript/packs", under: "packs", to: "packs"
pin "@rails/actioncable", to: "actioncable.esm.js"
pin_all_from "app/javascript/channels", under: "channels"
