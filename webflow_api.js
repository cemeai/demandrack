var token = '06b555feedd3c4eaa17899dc043b26309925af48eb448e2eb4f25fb2bbaf8611';
const Webflow = require('webflow-api')
const webflow = new Webflow({ token: token })

// Promise <[ Site ]>
// const items = webflow.items({collectionId: '5b8d5ccbcbd055b63724f24d', offset: 0});
// const items = webflow.items({collectionId: '5b8d5ccbcbd055b63724f24d', offset: 100});
// const items = webflow.items({collectionId: '5b8d5ccbcbd055b63724f24d', offset: 200});
// const items = webflow.items({collectionId: '5b8d5ccbcbd055b63724f24d', offset: 300});
const items = webflow.items({collectionId: '5b8d5ccbcbd055b63724f24d', offset: 400});

items.then(s => console.log(s));