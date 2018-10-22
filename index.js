const functions = require('firebase-functions')
const {dialogflow} = require('actions-on-google')
const {WebhookClient} = require('dialogflow-fulfillment');

const admin = require('firebase-admin');
admin.initializeApp();

process.env.DEBUG = 'dialogflow:debug';

exports.dialogflowFirebaseFullfillment = functions.https.onRequest((request, response) =>{
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
    
    function saveName(agent) {
        const nameParam = agent.parameters.name;
        //const context = agent.getContext('awaiting_name_confirm');
        const name = nameParam;// || context.parameters.name;
        
        agent.add(`Thank you, ` + name + `!`);
        
        return admin.database().ref('/names').push({name: name}).then((snapshot) => {
            console.log('database write sucessful: ' + snapshot.ref.toString());
        });
    }
    
    let intentMap = new Map();
    intentMap.set('Get Name', saveName);
    //intentMap.set('Confirm Name yes', getName);
    agent.handleRequest(intentMap);
});

const WELCOME_INTENT = 'Default Welcome Intent'
const FALLBACK_INTENT = 'Default Fallback Intent'
const NEED_QUOTE_INTENT = 'Need Quote'
const QUOTE_TYPE_ENTITY = 'TypeOfQuote'
const HALL_INTENT = 'Hall'
const HALL_TYPE_ENTITY = 'TypesOfHalls'
const OFFICE_INTENT = 'Office'
const OFFICE_TYPE_ENTITY = 'TypesOfOffices'
const LABS_INTENT = 'Labs'
const LABS_TYPES_ENTITY = 'TypesOfLabs'

const app = dialogflow()

app.intent(WELCOME_INTENT, (conv) => {
    conv.ask("Welcome my name is rogers and i can tell quotes and AMC college informations")
})

app.intent(FALLBACK_INTENT, (conv) => {
    conv.ask("I didn't understand what you're saying")
})

app.intent(NEED_QUOTE_INTENT, (conv) => {
    const quote_type = conv.parameters[QUOTE_TYPE_ENTITY].toLowerCase();
    if (quote_type == "inspiration"){
      conv.ask("Never confuse a single defeat with a final defeat.")   
    } else if (quote_type == "happiness"){
        conv.ask("A smile is happiness you'll find right under your nose.")
    } else if (quote_type == "friendship"){
        conv.ask("The greatest gift of life is friendship, and I have received it.")
    } else if (quote_type == "love"){
        conv.ask("Love yourself. It is important to stay positive because beauty comes from the inside out.")
    } else if (quote_type == "education"){
        conv.ask("Education is the most powerful weapon which you can use to change the world.")
    } else {
    conv.ask("Kind words do not cost much but they accomplish much.")
    }
}) 

app.intent(HALL_INTENT, (conv) => {
    const hall_type = conv.parameters[HALL_TYPE_ENTITY].toLowerCase();
    if (hall_type == "paul"){
      conv.ask("The paul linder hall is located at the north edge side of the campus near staffs parking area.")   
    } else if (hall_type == "humanities"){
        conv.ask("The humanities hall is located at the center part of the campus near library.")
    } else if (hall_type == "flint"){
        conv.ask("The flint house hall is located at the south edge side of the campus near students parking area .")
    } else if (hall_type == "jones"){
        conv.ask("jones hall is located at the northern part of the campus near paul linder love hall.")
    } else if (hall_type == "mainhall"){
        conv.ask("The  mainhall is located at the north  side of the campus near car parking area.")
    } else if (hall_type == "auditorium"){
    conv.ask("The auditorium is located at the southern edge side of the campus near flint house.")
    } else if (hall_type == "library"){
    conv.ask("The Library is located at the center of the campus.")
    } else {
    conv.ask("ask me about halls, mainhall is the heart of the campus.")
    }
}) 

app.intent(OFFICE_INTENT, (conv) => {
    const office_type = conv.parameters[OFFICE_TYPE_ENTITY].toLowerCase();
    if (office_type == "principal"){
      conv.ask("The principal office is located at the main hall .")   
    } else if (office_type == "buzzar"){
        conv.ask("The buzzar office is located at the main hall .")
    } else if (office_type == "nss"){
        conv.ask("The nss office is located at the maths department ground floor.")
    } else if (office_type == "slp"){
        conv.ask("The slp office is located at the paul linder hall third floor.")
    } else if (office_type == "physical"){
        conv.ask("The PET office is located near the college playground")
    } else {
    conv.ask("you can ask me about the offices in our college.")
    }
}) 

app.intent(LABS_INTENT, (conv) => {
    const labs_type = conv.parameters[LABS_TYPES_ENTITY].toLowerCase();
    if (labs_type == "computer"){
      conv.ask("The computer science lab is located at the paul linder love hall at second floor.")   
    } else if (labs_type == "physics"){
        conv.ask("The physics lab is located at the physics deparment.")
    } else if (labs_type == "chemistry"){
        conv.ask("The chemistry lab is located at the chemistry deparment .")
    } else if (labs_type == "botany"){
        conv.ask("The botany lab is located at the botany deparment.")
    } else if (labs_type == "zoology"){
        conv.ask("The zoology lab is located at the zoology deparment.")
    } else {
    conv.ask("you can ask me about the labs where all are located.")
    }
}) 

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)
